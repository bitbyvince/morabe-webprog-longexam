const multer = require("multer");

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Choose a JPEG, PNG, or WebP image.");
      error.status = 400;
      return cb(error);
    }

    cb(null, true);
  },
});

function hasValidImageSignature(buffer, mimetype) {
  if (!buffer) return false;

  if (mimetype === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  if (mimetype === "image/png") {
    return (
      buffer.length >= 8 &&
      buffer
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    );
  }

  if (mimetype === "image/webp") {
    return (
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }

  return false;
}

upload.singleImage =
  (fieldName = "image", { required = true } = {}) =>
  (req, res, next) => {
    upload.single(fieldName)(req, res, (error) => {
      if (error) return next(error);

      if (!req.file && !required) return next();

      if (!req.file) {
        const missingFile = new Error(
          `Select an image in the "${fieldName}" field.`,
        );
        missingFile.status = 400;
        return next(missingFile);
      }

      if (!hasValidImageSignature(req.file.buffer, req.file.mimetype)) {
        const invalidImage = new Error(
          "The selected file is not a valid JPEG, PNG, or WebP image.",
        );
        invalidImage.status = 400;
        return next(invalidImage);
      }

      next();
    });
  };

module.exports = upload;
