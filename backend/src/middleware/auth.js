/**
 * AUTHENTICATION MIDDLEWARE (auth.js)
 * This acts as a security gatekeeper for your API routes.
 * 
 * Current State: "Open Gate" - It allows every request to pass through 
 * to the next function without checking for a password or token.
 */

/**
 * @param {import('express').Request} req - The incoming request object
 * @param {import('express').Response} res - The outgoing response object
 * @param {import('express').NextFunction} next - The function that tells Express to move to the next piece of logic
 */
const auth = (req, res, next) => {
    // TODO: IMPLEMENT SECURITY LOGIC HERE
    // Example: 
    // 1. Get the token from the request headers (req.headers.authorization)
    // 2. Verify the token using a library like 'jsonwebtoken'
    // 3. If invalid, return res.status(401).json({ message: 'Unauthorized' })
    // 4. If valid, call next()

    // Right now, we simply call next() to let the request proceed to the controller.
    next();
};

// Export the middleware so it can be applied to specific routes in items.routes.js or sales.routes.js
module.exports = auth;