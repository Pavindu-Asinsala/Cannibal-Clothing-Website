const jwt = require("jsonwebtoken");

// Middleware to check if the user is authenticated
const checkAuth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token with the secret
    const decoded = jwt.verify(token, "your_jwt_secret"); 
    req.user = decoded; // Attach the decoded token data (user info) to req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Admin Middleware
const checkAdmin = (req, res, next) => {
  // Check if the role is either "Admin" or "Manager"
  if (req.user.role !== "Admin" && req.user.role !== "Manager") {
    return res.status(403).json({ message: "Access denied, admin privileges required" });
  }
  next();
};

module.exports = { checkAuth, checkAdmin };
