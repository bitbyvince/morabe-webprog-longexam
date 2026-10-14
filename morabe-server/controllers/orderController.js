const Order = require("../models/orderModel");
const { HttpStatus } = require("../config/constants");

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user.id });
    res.status(HttpStatus.CREATED).json(order);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };
    const orders = await Order.find(filter)
      .populate("user", "firstName lastName email")
      .populate("items.product");
    res.status(HttpStatus.OK).json(orders);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne(
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, user: req.user.id },
    )
      .populate("user", "firstName lastName email")
      .populate("items.product");
    if (!order)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Order not found" });
    res.status(HttpStatus.OK).json(order);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Order not found" });
    res.status(HttpStatus.OK).json(order);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Order not found" });

    if (!["processing", "confirmed"].includes(order.orderStatus)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "This order can no longer be cancelled",
      });
    }

    order.orderStatus = "cancelled";
    await order.save();
    res.status(HttpStatus.OK).json(order);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Order not found" });
    res.status(HttpStatus.OK).json({ message: "Order deleted" });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
