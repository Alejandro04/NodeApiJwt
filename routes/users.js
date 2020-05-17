const express = require('express');
const router = express.Router();

const Client = require('../models/User')

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
    
    if(!name || !email || password){
        return res.status(400).json({msg: 'Por favor ingrese todos los campos'})
    }

    
})

module.exports = router;