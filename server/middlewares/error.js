// Define a custom error handler class that extends the built-in Error class
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class constructor with the message
    this.statusCode = statusCode; // Add a status code property to the error
  }
}

// Middleware function to handle errors
export const errorMiddleware = (err, req, res, next) => {
  // Set default error message and status code if not provided
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle specific error types
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`; // Provide a more specific error message
    err = new ErrorHandler(message, 400); // Create a new ErrorHandler instance
  }

  // Send the error response with status code and message
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

// Export the ErrorHandler class for use in other modules
export default ErrorHandler;
