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
        .select({ photo: 0 }) //to remove photo from response;
        .populate('category', 'name')
    // if product not found
    if (!product) return res.status(404).send("product not found");
    // send product
    res.status(200).send(product);
};


module.exports.getPhotoById = async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId)
        .populate('category', 'name');

    // if no product found
    if (!product) return res.status(404).send("product not found");
    res.set('Content-Type', product.photo.contentType);
    res.status(200).send(product.photo.data);
};


module.exports.updateProductById = async (req, res) => {
    console.log(req.params.id);
    const productId = req.params.id;
    const product = await Product.findById(productId)

    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send("Something went wrong while parseing data")
        let updatedProduct = _.pick(fields, ["name", "descripton", "price", "category", "quantity"]);
        _.assignIn(product, updatedProduct);

        //check if photo is present thn save it
        if (files.photo) {
            fs.readFile(files.photo.filepath, (err, data) => {
                if (err) return res.status(400).send("something went wrong while reading file", err);
                product.photo.data = data;
                product.photo.contentType = files.photo.contentType;
                product.save((err, result) => {
                    if (err) return res.status(400).send("something went wrong while saving product", err);
                    else return res.status(200).send(_.pick(result, ["_id", "name", "description", "price", "category", "quantity"]));
                })
            })
        } else {
            product.save((err, result) => {
                if (err) return res.status(400).send("something went wrong while saving product", err);
                else return res.status(200).send({
                    message: "product updated successfully",
                    data: _.pick(result, ["_id", "name", "description", "price", "category", "quantity"])
                });
            })
        }

    });

};

module.exports.deleteProductById = async (req, res) => { };

/*
const body = {

    order: 'desc',
    sortBy: 'price',
    limit: 6,
    skip: 20,
    filter: {
        price: [0, 1000], //to filter the products by price range
        category: ['', '', '',], //to filter by category
    }
}

*/

module.exports.filterProducts = async (req, res) => {

    let order = req.body.order === 'desc' ? -1 : 1; //-1 for desc, 1 for asc;
    let sortBy = req.body.sortBy ? req.body.sortBy : 'name';
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let filters = req.body.filter ? req.body.filter : [];
    let args = {};


    for (let key in filters) {
        if (filters[key].length > 0) {
            if (key === 'price') {
                args['price'] = {
                    $gte: filters.price[0],
                    $lte: filters.price[1]
                }
            }
            if (key === 'category') {
                args['category'] = {
                    $in: filters.category
                }
                console.log(args);
            }
        }
    }

    const products = await Product.find(args)
        .select({ photo: 0 })
        .populate('category', 'name')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);
    if (!products) return res.status(200).send("no products found")
    res.status(200).send(products);
};
