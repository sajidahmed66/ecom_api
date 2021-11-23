const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const { Product, validate } = require('../models/product');

module.exports.createProduct = async (req, res) => {
    console.log(req.body);

    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        // 
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

}
module.exports.getProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).send(products);
};

module.exports.getProductById = async (req, res) => {

};

module.exports.updateProductById = async (req, res) => { };


