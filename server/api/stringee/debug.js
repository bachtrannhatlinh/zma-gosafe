// filepath: d:\gosafe\zma-gosafe\server\api\stringee\debug.js
export default function handler(req, res) {
  const STRINGEE_KEY = process.env.STRINGEE_KEY;
  const STRINGEE_SECRET = process.env.STRINGEE_SECRET;
  res.status(200).json({
    hasApiKey: !!STRINGEE_KEY,
    hasApiSecret: !!STRINGEE_SECRET,
    apiKeyPrefix: STRINGEE_KEY ? STRINGEE_KEY.substring(0, 10) + '...' : 'Not set',
    timestamp: new Date().toISOString()
  });
}