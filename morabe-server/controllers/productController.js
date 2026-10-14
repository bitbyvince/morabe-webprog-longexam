const Product = require("../models/productModel");
const { HttpStatus } = require("../config/constants");
const cloudinary = require("../config/cloudinary");

const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "bulldogs-exchange/products", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(buffer);
  });

exports.createProduct = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please select a product image.",
    });
  }

  const uploadedImage = await uploadBufferToCloudinary(req.file.buffer);
  try {
    const product = await Product.create({
      ...req.body,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      seller: req.user.role === "seller" ? req.user.id : req.body.seller,
      images: [uploadedImage.secure_url],
      imagePublicIds: [uploadedImage.public_id],
    });
    res.status(HttpStatus.CREATED).json(product);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      supplier,
      sort,
      search,
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (supplier) filter.seller = supplier;
    if (search) filter.productName = { $regex: search, $options: "i" };

    // Build sort object
    let sortOption = {};
    if (sort) {
      const sortFields = sort.split(",").map((field) => {
        if (field.startsWith("-")) return [field.substring(1), -1];
        return [field, 1];
      });
      sortOption = Object.fromEntries(sortFields);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate("category")
      .populate("seller", "firstName lastName email")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Products retrieved successfully.",
      count: total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: products,
    });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("seller", "firstName lastName email");
    if (!product)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Product not found" });
    res.status(HttpStatus.OK).json(product);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin"
        ? { _id: req.params.id }
        : { _id: req.params.id, seller: req.user.id };
    const product = await Product.findOne(filter);

    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: "Product not found",
      });
    }

    // Update the text fields when they were sent.
    product.productName = req.body.productName ?? product.productName;
    product.description = req.body.description ?? product.description;
    product.price = req.body.price ?? product.price;
    product.category = req.body.category ?? product.category;
    product.quantity = req.body.quantity ?? product.quantity;
    product.condition = req.body.condition ?? product.condition;

    // Replace its image only when a new file was sent.
    if (req.file) {
      const uploadedImage = await uploadBufferToCloudinary(req.file.buffer);
      product.images = [uploadedImage.secure_url];
      product.imagePublicIds = [uploadedImage.public_id];
    }

    await product.save();
    return res.status(HttpStatus.OK).json(product);
    if (!product)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Product not found" });
    res.status(HttpStatus.OK).json(product);
  } catch (err) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Product not found" });
    res.status(HttpStatus.OK).json({ message: "Product deleted" });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

exports.uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          'No file received. Send a file using the form-data key "image".',
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "bulldogs-exchange/products" },
        (error, uploadedImage) => {
          if (error) return reject(error);
          resolve(uploadedImage);
        },
      );

      stream.end(req.file.buffer);
      stream.end(req.file.buffer);
    });

    

    product.images.push(result.secure_url);
    product.imagePublicIds.push(result.public_id);
    await product.save();

    return res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



