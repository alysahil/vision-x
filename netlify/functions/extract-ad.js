import { callOpenAI, getBody, json, handleError } from "./_shared.js";

export const config = { path: "/api/extract-ad", timeout: 26 };

const AD_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string", description: "Primary headline of the ad. Empty string if none." },
    subhead: { type: "string", description: "Sub-headline / supporting line. Empty string if none." },
    body: { type: "string", description: "Body copy of the ad in full. Empty string if none." },
    cta_text: { type: "string", description: "Exact call-to-action text, e.g. 'Start free trial'. Empty string if none." },
    offer_mentioned: { type: "string", description: "Any offer, discount, trial, bundle, urgency. Empty string if none." },
    price_mentioned: { type: "string", description: "Any price, price range, or 'free'. Empty string if none." },
    claims: { type: "array", items: { type: "string" }, description: "Specific factual/performance claims the ad makes." },
    implied_persona: { type: "string", description: "The audience/person the ad is clearly speaking to." },
    implied_pain_point: { type: "string", description: "The problem or desire the ad is leveraging." },
  },
  required: [
    "headline",
    "subhead",
    "body",
    "cta_text",
    "offer_mentioned",
    "price_mentioned",
    "claims",
    "implied_persona",
    "implied_pain_point",
  ],
};

const SYSTEM_PROMPT = `You are an ad-copy normalization engine for a conversion-rate optimization tool.
Extract the ad into structured JSON. Be literal and quote the ad's own wording where possible.
Do not invent an offer, price, or claim that is not present — use an empty string or empty array instead.
The implied_persona and implied_pain_point are inferences and must be filled even when not stated verbatim.`;

export default async (req) => {
  try {
    const body = await getBody(req);
    const { text, image } = body;

    if (!text && !image) {
      return json(400, { error: "Provide either ad text or an ad screenshot." });
    }

    const userContent = [];
    if (image && typeof image === "string") {
      userContent.push({
        type: "text",
        text: "This is a screenshot of an ad. Read all visible text (headline, subhead, body, CTA, badges, offer, price) and normalize it. The source is 'screenshot'.",
      });
      userContent.push({ type: "image_url", image_url: { url: image, detail: "high" } });
    } else {
      userContent.push({
        type: "text",
        text: `Here is the ad copy. The source is 'text':\n\n"""\n${String(text).slice(0, 8000)}\n"""`,
      });
    }

    const result = await callOpenAI({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      schema: AD_SCHEMA,
      schemaName: "ad_record",
      temperature: 0.1,
    });

    return json(200, { ad: result });
  } catch (err) {
    return handleError(err);
  }
};
