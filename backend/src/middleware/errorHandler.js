/**
 * Global error handling middleware.
 * Catches all errors passed via next(err) and returns a clean JSON response.
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.path} —`, err.message);

    const status = err.status || 500;
    const message = err.message || 'Internal server error';

    res.status(status).json({
        success: false,
        error: message,
    });
};

module.exports = errorHandler;