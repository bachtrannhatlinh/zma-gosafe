const jwt = require('jsonwebtoken');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🔑 Stringee token request received');
  
  try {
    const STRINGEE_API_KEY_SID = process.env.STRINGEE_API_KEY_SID;
    const STRINGEE_API_KEY_SECRET = process.env.STRINGEE_API_KEY_SECRET;

    if (!STRINGEE_API_KEY_SID || !STRINGEE_API_KEY_SECRET) {
      console.log('❌ Missing Stringee credentials');
      return res.json({
        success: false,
        error: 'Stringee credentials not configured'
      });
    }

    const now = Math.floor(Date.now() / 1000);
    const exp = now + (24 * 60 * 60);

    const payload = {
      jti: STRINGEE_API_KEY_SID + '-' + now,
      iss: STRINGEE_API_KEY_SID, // Sử dụng API_KEY_SID làm issuer
      exp: exp,
      userId: req.body.userId || 'user_' + Date.now()
    };

    const token = jwt.sign(payload, STRINGEE_API_KEY_SECRET, {
      algorithm: 'HS256',
      header: {
        typ: 'JWT',
        alg: 'HS256',
        cty: 'stringee-api;v=1'
      }
    });

    console.log('✅ Stringee token generated successfully');
    res.json({
      success: true,
      token: token,
      expires: exp
    });

  } catch (error) {
    console.error('❌ Stringee token error:', error);
    res.json({
      success: false,
      error: error.message
    });
  }
}
