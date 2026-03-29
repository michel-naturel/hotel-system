const { getSession } = require("./session.store");

function requireAuth(allowedRoles = []) {
  return (req, res, next) => {
    const safeAllowedRoles = Array.isArray(allowedRoles) ? allowedRoles : [];
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = getSession(token);
    if (!user) {
      return res.status(401).json({ message: "Invalid session" });
    }

    if (safeAllowedRoles.length > 0 && !safeAllowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    req.token = token;
    next();
  };
}

module.exports = {
  requireAuth,
};
