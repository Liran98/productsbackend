const express = require('express');
const { check } = require('express-validator');

const usercontroller = require('../controllers/users-controller');
// const fileUpload = require('../middleware/file-uploads');

const router = express.Router();

router.get('/',usercontroller.getUsers);

router.post('/signup',  
// fileUpload.single('image'),
[
    check('name').notEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:6}),
],
usercontroller.signUp
);

router.post('/login',usercontroller.login);

router.delete('/:uid' , usercontroller.deleteUser);

module.exports = router;