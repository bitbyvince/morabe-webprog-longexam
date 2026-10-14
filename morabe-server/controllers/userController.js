const User = require("../models/userModel");
const { HttpStatus } = require("../config/constants");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(HttpStatus.CREATED).json(user);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(HttpStatus.OK).json(users);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.id.toString() !== req.params.id) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Not authorized" });
    }
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    res.status(HttpStatus.OK).json(user);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.id.toString() !== req.params.id) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: "Not authorized" });
    }
    const updates = { ...req.body };
    if (req.user.role !== "admin") {
      delete updates.role;
      delete updates.isActive;
    }
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    res.status(HttpStatus.OK).json(user);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "User not found" });
    res.status(HttpStatus.OK).json({ message: "User deleted" });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
