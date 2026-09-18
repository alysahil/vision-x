import { callOpenAI, getBody, json, handleError } from "./_shared.js";

export const config = { path: "/api/analyze-fit", timeout: 26 };

const DIMENSION = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "integer", description: "Fit score from 0 to 100." },
    applicable: {
      type: "boolean",
      description: "False only when the dimension genuinely cannot apply (e.g. neither the ad nor the page mentions any offer).",
    },
    verdict: { type: "string", description: "One of: Strong match, Partial match, Broken, N/A." },
    evidence: {
      type: "string",
      description: "1-3 sentences quoting the specific ad phrase and page phrase, or noting their absence.",
    },
    fix: { type: "string", description: "One concrete suggested fix." },
  },
  required: ["score", "applicable", "verdict", "evidence", "fix"],
};

const ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    dimensions: {
      type: "object",
      additionalProperties: false,
      properties: {
        persona_match: DIMENSION,
        offer_match: DIMENSION,
        product_framing_match: DIMENSION,
        proof_match: DIMENSION,
        objection_handling_match: DIMENSION,
        above_fold_continuity: DIMENSION,
      },
      required: [
        "persona_match",
        "offer_match",
        "product_framing_match",
        "proof_match",
        "objection_handling_match",
        "above_fold_continuity",
      ],
    },
    gap_list: {
      type: "array",
      description: "Gaps ordered by severity, most severe first.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          promise: { type: "string", description: "What the ad promised." },
          delivered: { type: "string", description: "What the page actually delivers." },
          why_dropoff: { type: "string", description: "Why this causes drop-off for the ad's audience." },
          fix: { type: "string", description: "The suggested fix." },
          severity: { type: "string", enum: ["high", "medium", "low"] },
        },
        required: ["promise", "delivered", "why_dropoff", "fix", "severity"],
      },
    },
    rewritten: {
      type: "object",
      additionalProperties: false,
      properties: {
        headline: { type: "string", description: "A rewritten above-the-fold headline that closes the single biggest gap." },
        subhead: { type: "string", description: "A rewritten above-the-fold subhead to pair with the headline." },
      },
      required: ["headline", "subhead"],
    },
    summary: { type: "string", description: "2-3 sentence executive summary of the fit." },
  },
  required: ["dimensions", "gap_list", "rewritten", "summary"],
};

const SYSTEM_PROMPT = `You are a conversion-rate-optimization analyst. Compare one ad to one landing page and score their fit.

Score these 6 dimensions from 0-100 each:
- persona_match: does the page's tone, imagery and language target the same person the ad implies?
- offer_match: is the ad's specific offer literally present and equally prominent on the page?
- product_framing_match: does the page describe the product the same way the ad frames it?
- proof_match: does the page supply proof for the specific claim the ad made?
- objection_handling_match: does the page address the objection the ad raises or implies (price, trust, effort, risk)?
- above_fold_continuity: within the first screen, is there a direct visual/copy echo of the ad's headline or promise (the "scent trail")?

For each dimension: a score, a one-line verdict (Strong match / Partial match / Broken / N/A), 1-3 sentences of evidence quoting the ad and page directly (or explicitly noting absence), and one suggested fix.

Set applicable=false ONLY for offer_match when neither the ad nor the page contains any offer, price, trial, discount, bundle or urgency element; give it the N/A verdict. Every other dimension is always applicable.

Then produce a gap_list ordered by severity (most severe first). Each gap is stated as: what the ad promised -> what the page delivers -> why this causes drop-off -> the suggested fix. Then suggest a rewritten above-the-fold headline and subhead that would close the single biggest gap.

Be specific and quote real text. Never invent page content that was not provided.`;

const WEIGHTS = {
  above_fold_continuity: 25,
  offer_match: 25,
  persona_match: 15,
  product_framing_match: 15,
  proof_match: 15,
  objection_handling_match: 15,
};

function clampScore(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function weightedOverall(dimensions) {
  let weightSum = 0;
  let scoreSum = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    const dim = dimensions?.[key];
    if (!dim || dim.applicable === false) continue;
    weightSum += weight;
    scoreSum += weight * clampScore(dim.score);
  }
  if (!weightSum) return 0;
  return Math.round(scoreSum / weightSum);
}

export default async (req) => {
  try {
    const body = await getBody(req);
    const { ad, page } = body;
    if (!ad || !page) {
      return json(400, { error: "Both ad and page records are required." });
    }

    const result = await callOpenAI({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `AD:\n${JSON.stringify(ad, null, 1)}\n\nLANDING PAGE:\n${JSON.stringify(page, null, 1).slice(
            0,
            14000
          )}`,
        },
      ],
      schema: ANALYSIS_SCHEMA,
      schemaName: "fit_analysis",
      temperature: 0.2,
    });

    for (const dim of Object.values(result.dimensions || {})) {
      dim.score = clampScore(dim.score);
    }
    result.overall_fit_score = weightedOverall(result.dimensions);
    result.ad_id = ad.id || null;
    result.page_url = page.url || "";

    return json(200, { analysis: result });
  } catch (err) {
    return handleError(err);
  }
};
