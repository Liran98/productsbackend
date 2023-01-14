const mongoose = require('mongoose');
const fs = require('fs');

const Product = require('../models/product');
const User = require('../models/user');


async function getProductById(req, res, next) {
    const productId = req.params.pid;

    let product = await Product.findById(productId);
                  //updateproducts.jsx
    res.json({  products: product.toObject({ getters: true }) });
}

async function getProductsbyUserId(req, res, next) {
    const userId = req.params.uid;

let userWithProducts = await User.findById(userId).populate('products');
                //usersproducts.jsx
    res.json({products:userWithProducts.products.map(user => user.toObject({ getters: true })) });
}

async function addProduct(req, res, next) {
    const {product , price ,description , owner } = req.body;

    const createdProduct = new Product({
        product,
        price,
        description,
        // image:req.file.path,
        owner
    });

    let user;
    try{
        user = await User.findById(owner);
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdProduct.save({ session: sess });
        user.products.push(createdProduct); 
        await user.save({ session: sess }); 
        await sess.commitTransaction();
    }catch(err){
        const error = new Error
        ("could not add the products , check your inputs ",403);
  
        return next(error);
    }
   
                           //addProducts.jsx
    res.status(201).json({ product: createdProduct });
};

async function updateProduct(req, res, next) {

const { product , description , price}=req.body;

const productId = req.params.pid;

let theproducts = await Product.findById(productId);



theproducts.product = product;
theproducts.description = description;
theproducts.price = price;


await theproducts.save();
                       //updateProduct.jsx
res.status(200).json({ products:theproducts.toObject({ getters: true }) });

}


async function deleteProduct(req, res, next) {
    const productId = req.params.pid;

    let products = await Product.findById(productId).populate('owner');

    // const imagepath = products.image;

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await products.remove({session: sess});
    products.owner.products.pull(products);
    await products.owner.save({session: sess});
    await sess.commitTransaction();


    // fs.unlink(imagepath ,err => {
    //     console.log("deleting image");
    //   });                   //deletion in productitems.jsx
      res.status(200).json({ message: 'Deleted product.' });
};



exports.getProductById =  getProductById;
exports.getProductsbyUserId =  getProductsbyUserId;
exports.addProduct = addProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;