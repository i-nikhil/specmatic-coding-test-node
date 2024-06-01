const express = require('express');
const bodyParser = require('body-parser');
const { validateProductType, validateProductRequest } = require('./middleware');
const { getAllProducts, addProduct } = require('./controller');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

app.get('/products', validateProductType, getAllProducts);
app.post('/products', validateProductRequest, addProduct);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
