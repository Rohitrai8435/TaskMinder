// Middleware function to check if the user is an admin
export const isAdmin = (req, res, next) => {
  // Check if the user is not an admin
  if (!req.user.isAdmin) {
    // If not an admin, send a 403 Forbidden response
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }

  // If the user is an admin, proceed to the next middleware or route handler
  next();
};
