const express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
require('dotenv').config()
const router = express.Router();

const User = require('../models/User')

/**
 * @route   GET api/users
 * @desc    Get all users
 * @access  Private
 */

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        if (!users) throw Error('No users exist');
        res.json(users);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

router.post('/users', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Por favor ingrese todos los campos' })
    }

    User.findOne({ email }).then(user => {
        if (user) return res.status(400).json('El usuario ya existe')

        const newUser = new User({
            name,
            email,
            password
        })

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(newUser.password, salt);
        newUser.password = hash

        var token = jwt.sign(
            { mongoURI: process.env.MONGO_URI },
            process.env.STRING_SECRET,
            { expiresIn: '1h' }
        );

        newUser.save().then(user => {
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            })
        })
    })
})

module.exports = router;