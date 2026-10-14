const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { registerValidation } = require("../middleware/validationMiddleware");

router.post(
  "/",
  protect,
  authorize("admin"),
  registerValidation,
  userController.createUser,
);

router.get("/", protect, authorize("admin"), userController.getUsers);
router.get("/:id", protect, userController.getUserById);
router.put("/:id", protect, userController.updateUser);
router.delete("/:id", protect, authorize("admin"), userController.deleteUser);
router.patch("/update/:id", protect, userController.updateUser);

module.exports = router;
