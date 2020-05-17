const express = require('express');
const auth = require('../middleware/auth')
const router = express.Router();

const Client = require('../models/Client')


/**
 * @route   GET api/clients
 * @desc    Get all clients
 * @access  Private
 */


router.get('/clients', auth, async (req, res) => {

    try {
        const clients = await Client.find()
        res.json(clients);

    } catch (error) {
        res.json({
            error: error
        });
    }
})

/**
 * @route   POST api/clients
 * @desc    Create a new client
 * @access  Private
 */

router.post('/clients', auth, async (req, res) => {
    const { name, description } = req.body;
    const errors = [];
    if (!name) {
        res.json({
            message: 'Ingrese el nombre'
        })
    }
    if (!description) {
        res.json({
            message: 'Ingrese la descripción'
        })
    }
    if (errors.length > 0) {
        res.json({
            errors,
            name,
            description
        })
    } else {
        try {
            const newClient = new Client({ name, description });
            await newClient.save();

            res.json({
                client: newClient
            });
        } catch (err) {
            console.log(err)
        }
    }
})

/**
 * @route   GET api/clients/:id
 * @desc    show client
 * @access  Private
 */

router.get('/clients/:id', auth, async (req, res) => {

    try {
        const client = await Client.findById(req.params.id)
        res.json(client);

    } catch (error) {
        res.json({
            error: error
        });
    }
})

/**
 * @route   PUT api/clients/:id
 * @desc    Update client
 * @access  Private
 */

router.put('/clients/:id', auth, async (req, res) => {
    const { name, description } = req.body;

    try {
        const client = await Client.findByIdAndUpdate(req.params.id, { name, description });
        res.json(client);

    } catch (error) {
        res.json({
            error: error
        });
    }
});


/**
 * @route   DELETE api/clients/:id
 * @desc    Delete client
 * @access  Private
 */

router.delete('/clients/:id', auth, async (req, res) => {
    const id = req.params.id

    try {
        const client = await Client.findByIdAndRemove(id)
        res.json(client)

    } catch (error) {
        res.json({
            error: error
        });
    }
});

module.exports = router;