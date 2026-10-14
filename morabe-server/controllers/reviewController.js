const Review = require("../models/reviewModel");
const { HttpStatus } = require("../config/constants");

exports.createReview = async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, user: req.user.id });
    res.status(HttpStatus.CREATED).json(review);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("product", "productName")
      .populate("user", "firstName lastName");
    res.status(HttpStatus.OK).json(reviews);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "firstName lastName");
    res.status(HttpStatus.OK).json(reviews);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, user: req.user.id };
    const review = await Review.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });
    if (!review)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Review not found" });
    res.status(HttpStatus.OK).json(review);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Review not found" });
    res.status(HttpStatus.OK).json({ message: "Review deleted" });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
