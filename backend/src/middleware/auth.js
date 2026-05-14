/**
 * Auth middleware placeholder.
 * Currently passes all requests through.
 * Replace with JWT verification when authentication is added.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const auth = (req, res, next) => {
    next();
};

module.exports = auth;