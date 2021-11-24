const router = require('express').Router();
const admin = require('../middlewares/admin');
const authorize = require('../middlewares/authorize')
const { getProducts, createProduct, getProductById, updateProductById, getPhotoById, filterProducts } = require('../controllers/productController');

router.route('/')
    .get(getProducts)
    .post([authorize, admin], createProduct)
router.route('/:id')
    .get(getProductById)
    .put([authorize, admin], updateProductById)
router.route('/photo/:id')
    .get(getPhotoById)
router.route('/filter')
    .post(filterProducts)
module.exports = router;
