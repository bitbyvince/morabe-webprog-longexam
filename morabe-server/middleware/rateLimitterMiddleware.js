const attempts = new Map();

const cooldownFor = (failures) => {
  if (failures >= 10) return 30 * 60 * 1000; // 30 minutes
  if (failures >= 8) return 5 * 60 * 1000; // 5 minutes
  if (failures >= 5) return 3 * 60 * 1000; // 3 minutes
  return 0;
};

const getKey = (req) => {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  return `${ip}:${email}`;
};

// Remove old entries periodically so the map does not grow forever.
const cleanupTimer = setInterval(
  () => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    for (const [key, attempt] of attempts) {
      if (attempt.lastAttemptAt < oneDayAgo) {
        attempts.delete(key);
      }
    }
  },
  60 * 60 * 1000,
);

cleanupTimer.unref();

const loginLimiter = (req, res, next) => {
  const attempt = attempts.get(getKey(req));

  if (attempt?.lockedUntil && attempt.lockedUntil > Date.now()) {
    const retryAfterSeconds = Math.ceil(
      (attempt.lockedUntil - Date.now()) / 1000,
    );

    res.set("Retry-After", String(retryAfterSeconds));
    return res.status(429).json({
      message: "Too many failed login attempts. Try again later.",
      retryAfterSeconds,
    });
  }

  next();
};

const recordFailedLogin = (req) => {
  const key = getKey(req);
  const attempt = attempts.get(key) || { failures: 0 };

  attempt.failures += 1;
  attempt.lastAttemptAt = Date.now();

  const cooldown = cooldownFor(attempt.failures);
  attempt.lockedUntil = cooldown ? Date.now() + cooldown : 0;

  attempts.set(key, attempt);

  return cooldown ? { retryAfterSeconds: Math.ceil(cooldown / 1000) } : null;
};

const clearFailedLogins = (req) => {
  attempts.delete(getKey(req));
};

module.exports = {
  loginLimiter,
  recordFailedLogin,
  clearFailedLogins,
};
