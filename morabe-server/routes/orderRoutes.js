const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, orderController.createOrder);
router.get("/", protect, orderController.getOrders);
router.get("/:id", protect, orderController.getOrderById);
router.post("/:id/cancel", protect, orderController.cancelOrder);
router.put("/:id", protect, authorize("admin"), orderController.updateOrder);
router.delete("/:id", protect, authorize("admin"), orderController.deleteOrder);

module.exports = router;
