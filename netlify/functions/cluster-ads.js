import { callOpenAI, getBody, json, handleError } from "./_shared.js";

export const config = { path: "/api/cluster-ads", timeout: 26 };

const CLUSTER_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusters: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          angle: { type: "string", description: "Short angle label, e.g. 'price/discount', 'social proof', 'pain-point', 'feature', 'urgency'." },
          ad_indices: { type: "array", items: { type: "integer" }, description: "0-based indices into the provided ad list." },
          shared_promise: { type: "string", description: "The cluster's shared promise/angle in one sentence." },
          page_serves_angle: { type: "string", enum: ["strong", "partial", "poor"], description: "Whether the landing page currently serves that angle well." },
          assessment: { type: "string", description: "2-3 sentences on how well the page serves this angle and what's missing." },
          suggested_section: {
            type: "object",
            additionalProperties: false,
            properties: {
              headline: { type: "string" },
              body: { type: "string", description: "2 sentences of body copy." },
              proof_element: { type: "string", description: "One proof element to include, e.g. a stat, testimonial line, or logo note." },
            },
            required: ["headline", "body", "proof_element"],
          },
        },
        required: ["angle", "ad_indices", "shared_promise", "page_serves_angle", "assessment", "suggested_section"],
      },
    },
  },
  required: ["clusters"],
};

const SYSTEM_PROMPT = `You are a conversion-rate-optimization analyst. You are given the normalized records for several ads targeting the same landing page.

Cluster the ads by marketing ANGLE using semantic similarity on their claims and implied pain point. Example angles: "price/discount", "social proof", "pain-point", "feature/quality", "urgency/scarcity", "brand/prestige". Use 2-5 clusters; do not create a cluster per ad unless the ads genuinely differ.

For each cluster:
- angle: a short label.
- ad_indices: 0-based indices of the ads in the provided list (this is critical — index must point at the right source ad).
- shared_promise: the cluster's promise in one sentence.
- page_serves_angle: how well the current landing page serves this angle (strong / partial / poor), based on its copy, proof, and offer.
- assessment: 2-3 sentences explaining the gap for this angle.
- suggested_section: ready-to-paste headline + 2-sentence body + one concrete proof element that would close that gap, written so it can be used for dynamic `persistent/lotion-like/UTM-keyed` landing sections by ad angle.

Quote real ad and page copy. Never invent content not in the inputs.`;

export default async (req) => {
  try {
    const body = await getBody(req);
    const { ads, page } = body;
    if (!Array.isArray(ads) || ads.length < 2) {
      return json(400, { error: "At least two ad records are required for clustering." });
    }

    const result = await callOpenAI({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `ADS (index 0..${ads.length - 1}):\n${ads
            .map((a, i) => `[${i}] ${JSON.stringify(a)}`)
            .join("\n\n")}\n\nLANDING PAGE:\n${JSON.stringify(page || {}, null, 1).slice(0, 10000)}`,
        },
      ],
      schema: CLUSTER_SCHEMA,
      schemaName: "ad_clusters",
      temperature: 0.3,
    });

    return json(200, { clusters: result.clusters });
  } catch (err) {
    return handleError(err);
  }
};