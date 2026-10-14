const Cart = require("../models/cartModel");
const { HttpStatus } = require("../config/constants");

exports.createCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    const incomingItems = req.body.items || [];

    if (!incomingItems.length) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "At least one product is required" });
    }

    if (!cart) {
      const newCart = await Cart.create({
        user: req.user.id,
        items: incomingItems,
        totalPrice: incomingItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      });
      return res.status(HttpStatus.CREATED).json(newCart);
    }

    incomingItems.forEach((incomingItem) => {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === incomingItem.product.toString(),
      );

      if (existingItem) {
        existingItem.quantity += incomingItem.quantity;
      } else {
        cart.items.push(incomingItem);
      }
    });

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    await cart.save();
    res.status(HttpStatus.CREATED).json(cart);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.getCarts = async (req, res) => {
  try {
    const carts = await Cart.find({ user: req.user.id })
      .populate("user", "firstName lastName email")
      .populate("items.product");
    res.status(HttpStatus.OK).json(carts);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.getCartByUser = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );
    if (!cart)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Cart not found" });
    res.status(HttpStatus.OK).json(cart);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const existing = await Cart.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!existing)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Cart not found" });
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cart)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Cart not found" });
    res.status(HttpStatus.OK).json(cart);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!cart)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Cart not found" });
    res.status(HttpStatus.OK).json({ message: "Cart deleted" });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
