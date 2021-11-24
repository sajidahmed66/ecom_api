const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const { Product, validate } = require('../models/product');

module.exports.createProduct = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {

        if (err) return res.status(400).send("something went wrong while parseing form-data", err);
        const { error } = validate((_.pick(fields, ["name", "description", "price", "category", "quantity"])));
        if (error) return res.status(400).send(error.details[0].message);

        let product = new Product(_.pick(fields, ["name", "description", "price", "category", "quantity"]));

        if (files.photo) {
            fs.readFile(files.photo.filepath, (err, data) => {
                if (err) return res.status(400).send("something went wrong while reading file", err);
                product.photo.data = data;
                product.photo.contentType = files.photo.mimetype;
                product.save((err, result) => {
                    if (err) return res.status(400).send("something went wrong while saving product", err);
                    else return res.status(201).send(_.pick(result, ["_id", "name", "description", "price", "category", "quantity"]));
                })
            });
        } else {
            return res.status(400).send("no photo found");
        }
    });

};

//query params: ?page=1&limit=10
module.exports.getProducts = async (req, res) => {
    console.log(req.query);
    let order = req.query.order === 'desc' ? -1 : 1; //-1 for desc, 1 for asc;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const products = await Product.find()
        .select({ photo: 0 })  //to remove photo from response
        .populate('category', 'name') //to populate category name( name after category indicate to only send the name of the category)
        .limit(limit) //to limit the number of products
        .sort({ [sortBy]: order }); //to sort the products
    res.status(200).send(products);
};

module.exports.getProductById = async (req, res) => {
    // get id from req.params
    const productId = req.params.id;
    // find product by id
    const product = await Product.findById(productId)
        .select({ photo: 0 })  //to remove photo from response;
    // if product not found
    if (!product) return res.status(404).send("product not found");
    // send product
    res.status(200).send(product);
};

module.exports.updateProductById = async (req, res) => {

};

module.exports.getPhotoById = async (req, res) => {
    const productId = req.params.id;
    const product = await Product
        .findById(productId)
        .populate('category name');

    // if no product found
    if (!product) return res.status(404).send("product not found");
    res.set('Content-Type', product.photo.contentType);
    res.status(200).send(product.photo.data);
};


