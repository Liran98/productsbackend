const bcrypt = require('bcrypt');
const User = require('../models/user');
const fs = require('fs');

async function getUsers(req, res, next) {
    let users;
    try {
        users = await User.find({}, '-passowrd');
    } catch (err) {
        const error = new Error('failed to fetch users', 500);
        return next(error);
    }          //users.jsx
    res.json({ allUsers: users.map(user => user.toObject({ getters: true })) });
};

async function signUp(req, res, next) {

    const { name, email, password } = req.body;

    let existinguser;

    try {
        existinguser = await User.findOne({ email: email });
    } catch (err) {
        const error = new Error('Signing up failed', 500);
        return next(error);
    }

    if (existinguser) {
        const error = new Error(
            'User exists already, pick a different user or login if you are the owner.',
            422
        );
        return next(error);
    }

    let hashedpassword;
    try {
        hashedpassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new Error('Hashing failed', 500);
        return next(error);

    }
    const createdUser = new User({
        name,
        email,
        password: hashedpassword,
        image: req.file.path,
        products: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new Error(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }
    //auth.jsx
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
}


async function login(req, res, next) {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new Error('Login failed', 500);
        return next(error);
    }
    if (!existingUser) {
        const error = new Error('User does not exist!', 422);
        return next(error);
    }

    let pass = true;
    try {
        pass = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new Error(' please check your credentials', 500);
        return next(error);
    }

    if (!pass) {
        const error = new Error(
            'Invalid credentials, could not log you in.',
            403 );
            return next(error);
    }



    //auth.jsx
    res.json({ message: 'Logged in!', user: existingUser.toObject({ getters: true }) });
}


async function deleteUser(req, res, next) {

    const userId = req.params.uid;

    let usertoDelete = await User.findByIdAndDelete({ _id: userId });


    if (!usertoDelete) {
        const error = new HttpError('no users to delete.', 404);
        return next(error);
    }

    const imagepath = usertoDelete.image;
    fs.unlink(imagepath, err => {
        console.log("deleting image");
    });                     //deletion in userItem.jsx
    res.status(200).json({ message: 'deleted user successfully' });
}

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
exports.deleteUser = deleteUser;





