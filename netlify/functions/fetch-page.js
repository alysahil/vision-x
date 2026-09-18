import * as cheerio from "cheerio";
import { getBody, json, handleError, normalizeUrl } from "./_shared.js";

export const config = { path: "/api/fetch-page", timeout: 26 };

const MAX_TEXT = 15000;
const ABOVE_FOLD_BUDGET = 1200;
const MAX_FETCH_BYTES = 3_000_000;

function clean(str) {
  return String(str || "").replace(/\s+/g, " ").trim();
}

function isCtaLike($, el) {
  const text = clean($(el).text()).toLowerCase();
  if (!text || text.length > 60) return false;
  const cls = `${$(el).attr("class") || ""} ${$(el).attr("id") || ""} ${$(el).attr("role") || ""}`.toLowerCase();
  if (/btn|button|cta|signup|sign-up|submit/.test(cls)) return true;
  return /^(get|start|try|book|buy|claim|download|sign ?up|subscribe|request|schedule|join|learn more|shop|order|apply|contact)/.test(
    text
  );
}

function absolutize(src, base) {
  if (!src) return "";
  try {
    return new URL(src, base).toString();
  } catch {
    return src;
  }
}

function matchesMeta($, el, re) {
  const cls = `${$(el).attr("class") || ""} ${$(el).attr("id") || ""} ${$(el).attr("data-testid") || ""}`;
  return re.test(cls);
}

function pushUnique(arr, value, cap = 25) {
  const v = clean(value);
  if (!v || v.length < 3) return;
  if (arr.some((x) => x.toLowerCase() === v.toLowerCase())) return;
  if (arr.length < cap) arr.push(v);
}

export default async (req) => {
  try {
    const body = await getBody(req);
    const rawHtml = body.html;
    let baseUrl = normalizeUrl(body.url);
    let html = "";
    let finalUrl = baseUrl;
    let fetchWarning = "";

    if (rawHtml && typeof rawHtml === "string" && rawHtml.trim().length > 40) {
      html = rawHtml;
    } else if (baseUrl) {
      let res;
      try {
        res = await fetch(baseUrl, {
          redirect: "follow",
          headers: {
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "accept-language": "en-US,en;q=0.9",
          },
          signal: AbortSignal.timeout(20000),
        });
      } catch (e) {
        return json(200, {
          fetched: false,
          url: baseUrl,
          warning: `Could not fetch the page (${e.message}). Paste the page HTML or upload a screenshot instead.`,
        });
      }
      finalUrl = res.url || baseUrl;
      if (!res.ok) {
        return json(200, {
          fetched: false,
          url: finalUrl,
          warning: `The page returned HTTP ${res.status}. It may be behind a login wall or bot protection. Paste the HTML or upload a screenshot instead.`,
        });
      }
      const contentType = res.headers.get("content-type") || "";
      if (!/html|xml/i.test(contentType)) {
        return json(200, {
          fetched: false,
          url: finalUrl,
          warning: `The URL returned "${contentType || "unknown content"}" rather than HTML. Paste the HTML or upload a screenshot instead.`,
        });
      }
      const reader = res.body?.getReader();
      if (reader) {
        const decoder = new TextDecoder();
        let received = 0;
        let out = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          received += value.length;
          out += decoder.decode(value, { stream: true });
          if (received > MAX_FETCH_BYTES) break;
        }
        out += decoder.decode();
        html = out;
      } else {
        html = await res.text();
      }
    } else {
      return json(400, { error: "Provide a landing page URL or pasted HTML." });
    }

    const $ = cheerio.load(html);
    $("script, style, noscript, template, svg, iframe, link, meta[http-equiv]").remove();

    const title = clean($("title").first().text());
    const metaDescription = clean($('meta[name="description"]').attr("content") || "");

    const headings = [];
    $("h1, h2, h3").each((_, el) => pushUnique(headings, $(el).text(), 40));

    const proofElements = [];
    const objectionHandling = [];
    const ctaCandidates = [];

    const ordered = $("h1, h2, h3, h4, p, li, a[href], button, img, blockquote, figcaption");
    let aboveFoldText = "";
    let afHeadline = "";
    let afSubhead = "";
    let afCta = "";
    let afImage = "";
    let afImageAlt = "";
    let afHtml = "";
    let seenHeadline = false;

    ordered.each((_, el) => {
      const tag = (el.tagName || "").toLowerCase();
      const text = clean($(el).text());

      if (aboveFoldText.length < ABOVE_FOLD_BUDGET) {
        if (/^h[1-4]$/.test(tag) && text) {
          if (!afHeadline) afHeadline = text;
          else if (!afSubhead && text !== afHeadline) afSubhead = text;
          aboveFoldText += ` ${text}`;
        } else if (tag === "p" && text) {
          if (!afSubhead && seenHeadline) afSubhead = text;
          aboveFoldText += ` ${text}`;
        } else if ((tag === "a" || tag === "button") && !afCta && isCtaLike($, el)) {
          afCta = text;
          aboveFoldText += ` [CTA: ${text}]`;
        } else if (tag === "img" && !afImage) {
          afImage = absolutize($(el).attr("src") || $(el).attr("data-src"), finalUrl);
          afImageAlt = clean($(el).attr("alt") || "");
          if (afImageAlt) aboveFoldText += ` [image: ${afImageAlt}]`;
        } else if (text && tag !== "img") {
          aboveFoldText += ` ${text}`;
        }
        if (!afHtml) {
          const outer = $.html(el) || "";
          if (outer) afHtml = outer.slice(0, 1200);
        }
        if (afHeadline) seenHeadline = true;
      }

      if ((tag === "a" || tag === "button") && isCtaLike($, el)) {
        pushUnique(ctaCandidates, text, 15);
      }

      if (matchesMeta($, el, /(testimonial|review|rating|logo|trust|client|guarantee|badge|stat|award|press|as-seen)/i)) {
        pushUnique(proofElements, text, 30);
      }
      if (matchesMeta($, el, /(faq|question|guarantee|refund|money.?back|risk|cancel|support|objection)/i)) {
        pushUnique(objectionHandling, text, 30);
      }
    });

    $("details > summary").each((_, el) => pushUnique(objectionHandling, $(el).text(), 30));
    $("[class*='faq' i] h2, [class*='faq' i] h3, [class*='faq' i] p").each((_, el) =>
      pushUnique(objectionHandling, $(el).text(), 30)
    );
    $("blockquote, [class*='testimonial' i] p").each((_, el) => pushUnique(proofElements, $(el).text(), 30));

    const bodyClone = cheerio.load($.html());
    bodyClone("script, style, noscript, svg").remove();
    let fullText = clean(bodyClone("body").text());
    const truncated = fullText.length > MAX_TEXT;
    if (truncated) fullText = fullText.slice(0, MAX_TEXT);

    const reviewCount = fullText.match(/([\d.,]+\s*\+?\s*(?:reviews?|ratings?|customers?|users?|teams?|companies))/i);
    const starRating = fullText.match(/(\d(?:[.,]\d)?)\s*(?:\/\s*5|out of 5|stars?\b)/i);
    const socialProofPhrase = fullText.match(/(trusted by[^.]{0,80}|used by[^.]{0,80}|as seen (?:in|on)[^.]{0,80}|rated [^.]{0,60})/i);

    let blocked = false;
    const lowered = fullText.toLowerCase();
    if (/sign in to continue|log ?in to continue|access denied|captcha|enable javascript|verify you are human/.test(lowered)) {
      blocked = true;
    }

    return json(200, {
      fetched: true,
      url: finalUrl,
      title,
      metaDescription,
      headings: headings.slice(0, 25),
      aboveFold: {
        headline: afHeadline,
        subhead: afSubhead,
        cta: afCta,
        image: afImage,
        imageAlt: afImageAlt,
        text: clean(aboveFoldText).slice(0, ABOVE_FOLD_BUDGET),
        html: afHtml,
      },
      ctaCandidates,
      proofElements,
      objectionHandling,
      signals: {
        reviewCount: reviewCount ? clean(reviewCount[0]) : "",
        starRating: starRating ? clean(starRating[0]) : "",
        socialProofPhrase: socialProofPhrase ? clean(socialProofPhrase[0]) : "",
      },
      blocked,
      warning: fetchWarning,
      fullText,
      truncated,
    });
  } catch (err) {
    return handleError(err);
  }
};
