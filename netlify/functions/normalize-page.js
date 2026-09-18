import { callOpenAI, getBody, json, handleError } from "./_shared.js";

export const config = { path: "/api/normalize-page", timeout: 26 };

const PAGE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    above_fold_headline: { type: "string" },
    above_fold_subhead: { type: "string" },
    above_fold_cta: { type: "string" },
    above_fold_image_alt_or_desc: { type: "string" },
    offer_stated_on_page: { type: "string", description: "Literal offer text, or empty string if none is shown." },
    price_stated_on_page: { type: "string", description: "Literal price text, or empty string if none is shown." },
    proof_elements: {
      type: "array",
      items: { type: "string" },
      description: "Concrete proof shown on the page: testimonials, logos, review counts, ratings, guarantees, stats. Empty array if none.",
    },
    objection_handling: {
      type: "array",
      items: { type: "string" },
      description: "FAQ items, guarantee copy, risk-reversal copy found on the page. Empty array if none.",
    },
    product_framing_summary: { type: "string", description: "1-3 sentences on how the page frames the product and who it is for." },
    full_page_text: { type: "string", description: "The page's readable text, condensed but faithful." },
  },
  required: [
    "above_fold_headline",
    "above_fold_subhead",
    "above_fold_cta",
    "above_fold_image_alt_or_desc",
    "offer_stated_on_page",
    "price_stated_on_page",
    "proof_elements",
    "objection_handling",
    "product_framing_summary",
    "full_page_text",
  ],
};

const SYSTEM_PROMPT = `You normalize a landing page into structured JSON for a conversion-rate-optimization tool.
You are given machine-extracted signals from the live page (in DOM reading order). The signal extraction is imperfect.
Rules:
- Prefer the literal page wording. Do not invent offers, prices, proof, or objections that are not evidenced.
- "Above the fold" means the first screen: the first headline, the first supporting line, and the first real CTA.
- If a proof or objection-handling item is a noisy CSS artifact or navigation text, drop it.
- If an offer or price is genuinely absent, use an empty string.
- Condense full_page_text to the meaningful content, preserving exact phrasing of headlines, offers, and proof.`;

export default async (req) => {
  try {
    const body = await getBody(req);
    const { signals, url, image } = body;

    if (!signals && !image) {
      return json(400, { error: "Provide extracted page signals or a landing page screenshot." });
    }

    const content = [];
    content.push({
      type: "text",
      text: `Landing page URL: ${url || "(not provided)"}\n\nMachine-extracted page signals:\n${JSON.stringify(
        signals || {},
        null,
        1
      ).slice(0, 16000)}`,
    });

    if (image && typeof image === "string") {
      content.push({
        type: "text",
        text: "Also attached is a screenshot of the landing page's first screen. Use it to correct the above-the-fold fields (headline, subhead, CTA, hero image description).",
      });
      content.push({ type: "image_url", image_url: { url: image, detail: "high" } });
    }

    const page = await callOpenAI({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
      schema: PAGE_SCHEMA,
      schemaName: "page_record",
      temperature: 0.1,
    });

    page.url = url || "";
    return json(200, { page });
  } catch (err) {
    return handleError(err);
  }
};
