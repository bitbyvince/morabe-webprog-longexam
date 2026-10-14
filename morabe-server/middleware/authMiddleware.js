const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { HttpStatus } = require("../config/constants");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: "User no longer exists" });
      }
      if (user.isActive === false) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ success: false, message: "Account is deactivated" });
      }

      req.user = {
        id: user._id,
        role: user.role,
        email: user.email,
      };
      next();
    } catch (err) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: "Invalid or expired token" });
    }
  } else {
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ success: false, message: "No token provided" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`,
      });
    }
    next();
  };
};
