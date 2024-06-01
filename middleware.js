const { ProductType } = require('./repository');
const { ErrorResponseBody } = require('./controller');

// Middleware to validate product type query parameter
function validateProductType(req, res, next) {
    const type = req.query.type;
    if (type && !Object.values(ProductType).includes(type)) {
        return res.status(400).json(
            new ErrorResponseBody(
                new Date().toISOString(),
                400,
                `Invalid type parameter: ${type}`,
                req.originalUrl
            )
        );
    }
    next();
}

// Middleware to validate product request body
function validateProductRequest(req, res, next) {
    const { name, type, inventory, cost } = req.body;

    if (!name || !type || !inventory || !cost ) {
        return res.status(400).json(
            new ErrorResponseBody(
                new Date().toISOString(),
                400,
                "Request fields must not be null",
                req.originalUrl
            )
        );
    }

    if (!isNaN(name)) {
        return res.status(400).json(
            new ErrorResponseBody(
                new Date().toISOString(),
                400,
                "Name must not be a numeric value",
                req.originalUrl
            )
        );
    }

    if (name.toLowerCase() === "true" || name.toLowerCase() === "false") {
        return res.status(400).json(
            new ErrorResponseBody(
                new Date().toISOString(),
                400,
                "Name must not be boolean",
                req.originalUrl
            )
        );
    }

    if (!Object.values(ProductType).includes(type)) {
        return res.status(400).json(
            new ErrorResponseBody(
                new Date().toISOString(),
                400,
                `Invalid type parameter: ${type}`,
                req.originalUrl
            )
        );
    }

    if(isNaN(inventory) || isNaN(cost) || typeof(inventory) == "boolean" || typeof(cost) == "boolean")
    {
        return res.status(400).json(
            new ErrorResponseBody(
                new Date().toISOString(),
                400,
                `Invalid number fields`,
                req.originalUrl
            )
        );
    }

    next();
}

module.exports = { validateProductType, validateProductRequest };
