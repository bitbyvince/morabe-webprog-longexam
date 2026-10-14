const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, reviewController.createReview);
router.get("/", protect, authorize("admin"), reviewController.getReviews);
router.get("/product/:productId", reviewController.getReviewsByProduct);
router.put("/:id", protect, reviewController.updateReview);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  reviewController.deleteReview,
);

module.exports = router;
