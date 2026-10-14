const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/", cartController.createCart);
router.get("/", cartController.getCarts);
router.get("/user/:userId", cartController.getCartByUser);
router.put("/:id", cartController.updateCart);
router.delete("/:id", cartController.deleteCart);

module.exports = router;
