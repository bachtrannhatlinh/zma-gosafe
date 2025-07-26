// filepath: d:\gosafe\zma-gosafe\server\api\stringee\debug.js
export default function handler(req, res) {
  const API_KEY_SID = process.env.API_KEY_SID;
  const API_SECRET_KEY = process.env.API_SECRET_KEY;
  res.status(200).json({
    hasApiKey: !!API_KEY_SID,
    hasApiSecret: !!API_SECRET_KEY,
    apiKeyPrefix: API_KEY_SID ? API_KEY_SID.substring(0, 10) + '...' : 'Not set',
    timestamp: new Date().toISOString()
  });
}