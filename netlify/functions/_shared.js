const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export function json(statusCode, body) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { "content-type": "application/json" },
  });
}

export function errorResponse(statusCode, message) {
  return json(statusCode, { error: message });
}

async function readJson(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

export async function getBody(req) {
  return readJson(req);
}

export async function callOpenAI({ messages, schema, schemaName, temperature = 0.2 }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const err = new Error(
      "OPENAI_API_KEY is not configured. Add it to your Netlify environment (or a local .env file) and redeploy."
    );
    err.statusCode = 500;
    throw err;
  }

  const payload = {
    model: process.env.OPENAI_MODEL || "gpt-4o",
    messages,
    temperature,
  };

  if (schema) {
    payload.response_format = {
      type: "json_schema",
      json_schema: { name: schemaName || "result", strict: true, schema },
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 110000);

  let res;
  try {
    res = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (e) {
    const err = new Error(
      e.name === "AbortError" ? "The analysis request timed out. Try again." : `Could not reach the model provider: ${e.message}`
    );
    err.statusCode = 502;
    throw err;
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  if (!res.ok) {
    let detail = text;
    try {
      detail = JSON.parse(text).error?.message || text;
    } catch {}
    const err = new Error(`Model provider error (${res.status}): ${detail}`);
    err.statusCode = 502;
    throw err;
  }

  const data = JSON.parse(text);
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    const err = new Error("Model returned an empty response.");
    err.statusCode = 502;
    throw err;
  }

  try {
    return JSON.parse(content);
  } catch {
    const err = new Error("Model returned malformed JSON.");
    err.statusCode = 502;
    throw err;
  }
}

export function handleError(err) {
  const status = err.statusCode || 500;
  return json(status, { error: err.message || "Unexpected server error." });
}

export function normalizeUrl(input) {
  if (!input || typeof input !== "string") return "";
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}
