const router = require('express').Router();
const admin = require('../middlewares/admin');
const authorize = require('../middlewares/authorize')
const { getProducts, createProduct, getProductById, updateProductById } = require('../controllers/productController');

router.route('/')
    .get(getProducts)
    .post([authorize, admin], createProduct)
router.route('/:id')
    .get(getProductById)
    .put([authorize, admin], updateProductById)

module.exports = router;
