// errorHandler.js

const errorHandler = (err, req, res, next) => {
  // 1. Log the error for the developer (you) to see in the terminal
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  // 2. Determine the status code. 
  // If the error has a custom status (like our ApiError), use it. 
  // Otherwise, default to 500 (Internal Server Error).
  const statusCode = err.statusCode || 500;
  console.log(err.message);
  
  // 3. Determine the message.
  const message = err.message || "Something went wrong on the server.";

  // 4. Handle Mongoose/MongoDB specific errors (Optional but highly recommended)
  if (err.name === 'CastError') {
    // This happens if someone passes an invalid MongoDB ID in the URL
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: ${err.value}`
    });
  }

  if (err.code === 11000) {
    // This is MongoDB's error code for a duplicate unique field (like an existing email)
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered. This record already exists."
    });
  }

  // 5. Send the final standardized response to the frontend
  res.status(statusCode).json({
    success: false,
    message: message,
    // SECURITY: Only send the stack trace if you are NOT in production!
    // The stack trace reveals file paths and vulnerable code lines.
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

export default errorHandler