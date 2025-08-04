const jwt = require('jsonwebtoken');

app.post('/auth/zalo-login', async (req, res) => {
  try {
    const { zaloUserId, name, avatar, phoneNumber } = req.body;
    
    console.log('Received Zalo login request:', { zaloUserId, name, phoneNumber });
    
    if (!zaloUserId) {
      return res.status(400).json({ error: 'Zalo User ID is required' });
    }
    
    // Tạo JWT token
    const jwtToken = jwt.sign(
      {
        userId: zaloUserId,
        name: name,
        avatar: avatar,
        phoneNumber: phoneNumber,
        platform: 'zalo',
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Optional: Lưu user vào database
    // await saveOrUpdateUser({ zaloUserId, name, avatar, phoneNumber });
    
    res.json({
      success: true,
      jwtToken: jwtToken,
      user: { 
        userId: zaloUserId, 
        name, 
        avatar, 
        phoneNumber 
      }
    });
    
  } catch (error) {
    console.error('Zalo login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});