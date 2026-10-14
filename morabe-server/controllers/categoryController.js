const Category = require("../models/categoryModel");
const { HttpStatus } = require("../config/constants");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(HttpStatus.CREATED).json(category);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(HttpStatus.OK).json(categories);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Category not found" });
    res.status(HttpStatus.OK).json(category);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category)
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Category not found" });
    res.status(HttpStatus.OK).json(category);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(HttpStatus.NOT_FOUND).json({ message: "Category not found" });
    res.status(HttpStatus.OK).json({ message: "Category deleted" });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
