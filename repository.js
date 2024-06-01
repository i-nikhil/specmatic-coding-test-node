// In memory product repository
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

module.exports = { productRepository, ProductType };
