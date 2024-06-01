const { productRepository } = require('./repository');

// Custom error response body
function ErrorResponseBody(timestamp, status, error, path) {
    this.timestamp = timestamp;
    this.status = status;
    this.error = error;
    this.path = path;
}

// Get all products or filter by type
function getAllProducts(req, res) {
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
}

// Add a new product
function addProduct(req, res) {
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
}

module.exports = { getAllProducts, addProduct, ErrorResponseBody };
