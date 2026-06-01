const rateLimitMap = {};
const RATE_LIMIT   = 10;
const WINDOW_MS    = 60 * 60 * 1000;

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = rateLimitMap[ip];
  if (!entry || now > entry.reset) {
    rateLimitMap[ip] = { count: 1, reset: now + WINDOW_MS };
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST')
    return { statusCode: 405, body: 'Method Not Allowed' };

  const ip = event.headers['x-forwarded-for'] || 'unknown';
  if (!checkRateLimit(ip))
    return { statusCode: 429, body: JSON.stringify({ error: 'Rate limit exceeded' }) };

  const systemPrompt = process.env.SYSTEM_PROMPT;
  if (!systemPrompt)
    return { statusCode: 500, body: JSON.stringify({ error: 'SYSTEM_PROMPT env var not set' }) };

  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
