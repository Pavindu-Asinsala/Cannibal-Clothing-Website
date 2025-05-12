const jwt = require("jsonwebtoken");

// Middleware to check if the user is authenticated
const checkAuth = (req, res, next) => {
  console.log("header: ", req.header("Authorization"));
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // Verify token with secret from env
    req.user = decoded; // Attach the decoded token data (user info) to req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { checkAuth };
