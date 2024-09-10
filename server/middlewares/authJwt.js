const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

module.exports = async function (req, res, next) {
  // Get the token from the authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Split the 'Bearer' prefix and extract the actual token
  const token = authHeader.split(" ")[1]; // Extracts the token after 'Bearer '

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Invalid token format." });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token. User not found." });
    }

    // Attach the user to the request object for further usage
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle any error that occurs during token verification
    return res.status(400).json({ message: "Invalid token.", error });
  }
};
