const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadImageMiddleware.js");

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  protect,
  authorize("admin", "seller"),
  upload.singleImage("image"),
  productController.createProduct,
);
router.put(
  "/:id",
  protect,
  authorize("admin", "seller"),
  upload.singleImage("image", { required: false }),
  productController.updateProduct,
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  productController.deleteProduct,
);
router.post(
  "/product/:id/upload-image",
  protect,
  authorize("admin"),
  upload.singleImage("image", { required: false }),
  productController.uploadProductImage,
);


module.exports = router;
