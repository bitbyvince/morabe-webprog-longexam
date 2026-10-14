const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { HttpStatus } = require("../config/constants");
const {
  recordFailedLogin,
  clearFailedLogins,
} = require("../middleware/rateLimitterMiddleware");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: "buyer",
    });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(HttpStatus.CREATED).json({
      success: true,
      message: "Registration successful",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    res
      .status(HttpStatus.BAD_REQUEST)
      .json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: "Invalid email or password" });
    if (user.isActive === false)
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ success: false, message: "This account has been deactivated" });

    if (!user) {
      const cooldown = recordFailedLogin(req);

      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password",
        ...(cooldown && { retryAfterSeconds: cooldown.retryAfterSeconds }),
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const cooldown = recordFailedLogin(req);
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: "Invalid email or password", ...(cooldown && { retryAfterSeconds: cooldown.retryAfterSeconds }) });
    }
    clearFailedLogins(req);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (err) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => {
  res
    .status(HttpStatus.OK)
    .json({ success: true, message: "Logged out successfully" });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ success: false, message: "User not found" });
    res.status(HttpStatus.OK).json({ success: true, data: user });
  } catch (err) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user || !(await user.matchPassword(currentPassword))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};
