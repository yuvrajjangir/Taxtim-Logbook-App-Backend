const jwt = require('jsonwebtoken');
require("dotenv").config();


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Failed to authenticate token.' });
      }
  
      req.userId = decoded.userID;
      next();
    });
  };

module.exports = verifyToken;
