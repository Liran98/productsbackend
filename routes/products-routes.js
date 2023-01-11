const express = require('express');

const {check} = require('express-validator');

const productcontroller = require('../controllers/products-controllers');

const fileUpload = require('../middleware/file-uploads');

const router = express.Router();


router.get('/:pid',productcontroller.getProductById);

router.get('/user/:uid',productcontroller.getProductsbyUserId);


router.post('/',
fileUpload.single('image'),
[
check('product').notEmpty(),
check('price').notEmpty(),
check('description').notEmpty(),
],
productcontroller.addProduct
);

router.patch('/:pid',[
    check('product').notEmpty(),
    check('price').notEmpty(),
    check('description').notEmpty(),
],
    productcontroller.updateProduct
);

router.delete('/:pid', productcontroller.deleteProduct);

module.exports = router;
  