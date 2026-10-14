const Log = require("../models/logModel.js");

const logger = {
  info: async (message, metadata = {}) => {
    try {
      await Log.create({ level: "info", message, metadata });
    } catch (error) {
      console.error("Failed to write info log:", error);
    }
  },
  
  warn: async (message, metadata = {}) => {
    try {
      await Log.create({ level: "warn", message, metadata });
    } catch (error) {
      console.error("Failed to write warn log:", error);
    }
  },
  
  error: async (message, metadata = {}) => {
    try {
      await Log.create({ level: "error", message, metadata });
    } catch (error) {
      console.error("Failed to write error log:", error);
    }
  }
};

// Middleware to log all requests
const auditLoggerMiddleware = (request, response, next) => {
  const startTime = Date.now();

  response.on("finish", () => {
    const statusCode = response.statusCode;

    const logData = {
      method: request.method,
      path: request.path,
      ip: request.ip || request.socket?.remoteAddress || null,
      userId: request.user?.id?.toString() || null,
      userEmail: request.user?.email || null,
      role: request.user?.role || null,
      statusCode,
      durationMs: Date.now() - startTime,
    };

    const message = `${logData.method} ${logData.path} - ${statusCode}`;

    if (statusCode >= 500) {
      void logger.error(message, logData);
    } else if (statusCode >= 400) {
      void logger.warn(message, logData);
    } else {
      void logger.info(message, logData);
    }
  });

  next();
};

module.exports = { logger, auditLoggerMiddleware };
