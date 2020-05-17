const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth')
require('dotenv').config()
const router = express.Router();

const User = require('../models/User')


/**
 * @route   POST api/auth/login
 * @desc    Login user
 * @access  Public
 */

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Por favor ingrese todos los campos' })
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Usuario no existe' })

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' })

        const token = jwt.sign(
            { mongoURI: process.env.MONGO_URI },
            process.env.STRING_SECRET,
            { expiresIn: '1h' }
        );
        if (!token) return res.status(400).json({ msg: 'Token inválido' })

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

/**
 * @route   POST api/users
 * @desc    Register new user
 * @access  Public
 */

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Por favor ingrese todos los campos' })
    }

    try {
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Usuario ya existe' })

        const salt = await bcrypt.genSalt(10);
        if (!salt) return res.status(400).json({ msg: 'Error bcrypt salt' })

        const hash = await bcrypt.hash(password, salt);
        if (!hash) return res.status(400).json({ msg: 'Error bcrypt hash' })

        const newUser = new User({
            name,
            email,
            password: hash
        });

        const savedUser = await newUser.save();
        if (!savedUser) return res.status(400).json({ msg: 'Error al intentar guardar usuario' })

        const token = jwt.sign(
            { mongoURI: process.env.MONGO_URI },
            process.env.STRING_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: {
                id: savedUser.id,
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

module.exports = router;