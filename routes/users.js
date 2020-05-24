const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')
require('dotenv').config()
const router = express.Router();

const User = require('../models/User')

/**
 * @route   GET api/users
 * @desc    Get all users
 * @access  Private
 */

router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        if (!users) res.status(400).json({ msg: 'No existen usuarios' })
        res.json(users);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

/**
 * @route   POST api/users
 * @desc    Create a new user
 * @access  Private
 */

router.post('/api/users', auth, async (req, res) => {
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

        const salt = bcrypt.genSaltSync(10);
        if (!salt) return res.status(400).json({ msg: 'Error bcrypt salt' })

        const hash = bcrypt.hashSync(newUser.password, salt);
        if (!hash) return res.status(400).json({ msg: 'Error bcrypt hash' })

        newUser.password = hash

        const token = jwt.sign(
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

/**
 * @route   GET api/user
 * @desc    Get a user
 * @access  Private
 */

router.post('/api/user', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Usuario no existe' })

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email

        });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

/**
 * @route   DELETE api/users/:id
 * @desc    Delete user
 * @access  Private
 */

router.delete('/api/users/:id', auth, async (req, res) => {
    const id = req.params.id

    try {
        const users = await User.findByIdAndRemove(id)
        res.json({ success: true })

    } catch (error) {
        res.status(404).json({ success: false })
    }
});

module.exports = router;