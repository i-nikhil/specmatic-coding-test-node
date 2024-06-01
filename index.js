const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// Mock product repository
const productRepository = {
    products: [],
    getAllProducts: function() {
        return this.products;
    },
    addProduct: function(product) {
        this.products.push(product);
    }
};

// Enum for valid product types
const ProductType = Object.freeze({
    gadget: 'gadget',
    book: 'book',
    food: 'food',
    other: 'other'
});

// Custom error response body
function ErrorResponseBody(timestamp, status, error, path) {
    this.timestamp = timestamp;
    this.status = status;
    this.error = error;
    this.path = path;
}

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
    
    if (!name || !type || !inventory || !cost 
        || isNaN(inventory) || isNaN(cost) 
        || typeof(inventory) == "boolean" || typeof(cost) == "boolean") {
        return res.status(400).json(
            new ErrorResponseBody(
                new Date().toISOString(),
                400,
                "Invalid Request field(s)",
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

    next();
}

app.get('/products', validateProductType, (req, res) => {
    const { type } = req.query;
    if (!type) {
        return res.status(200).json(productRepository.getAllProducts());
    }
    
    const filteredProducts = productRepository.getAllProducts().filter(
        product => product.type.toUpperCase() === type.toUpperCase()
    );

    if (filteredProducts.length > 0) {
        return res.status(200).json(filteredProducts);
    } else {
        return res.status(404).json(
            new ErrorResponseBody(
                new Date().toISOString(),
                404,
                `No products found for type: ${type}`,
                req.originalUrl
            )
        );
    }
});

app.post('/products', validateProductRequest, (req, res) => {
    const { name, type, inventory, cost } = req.body;

    const newProduct = {
        id: productRepository.getAllProducts().length + 1,
        name,
        type: type,
        inventory,
        cost
    };

    productRepository.addProduct(newProduct);
    return res.status(201).json({ id: newProduct.id });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
