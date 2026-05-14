/**
 * GLOBAL ERROR HANDLING MIDDLEWARE (errorHandler.js)
 * This is the final stop for any request that encounters an error.
 * Instead of letting the server crash or sending a raw "stack trace" to the user,
 * this function formats the error into a clean, readable JSON object.
 */

/**
 * @param {Error} err - The error object caught by the controller
 * @param {import('express').Request} req - The original request object
 * @param {import('express').Response} res - The response object used to send the error back
 * @param {import('express').NextFunction} next - The next middleware function (required by Express signature)
 */
const errorHandler = (err, req, res, next) => {
    // 1. LOGGING
    // Prints the error details to the server console for developers to see.
    // Example output: [ERROR] POST /api/items — price must be greater than 0
    console.error(`[ERROR] ${req.method} ${req.path} —`, err.message);

    // 2. DETERMINE STATUS CODE
    // If the error has a specific status (like 400 or 404), use it.
    // Otherwise, default to 500 (Internal Server Error).
    const status = err.status || 500;

    // 3. DETERMINE MESSAGE
    // Use the error's own message, or a generic fallback if none exists.
    const message = err.message || 'Internal server error';

    // 4. SEND RESPONSE
    // Sends the error back to the frontend/client in a consistent format.
    res.status(status).json({
        success: false,
        error: message,
    });
};

// Export so it can be registered in server.js (usually as the very last app.use())
module.exports = errorHandler;