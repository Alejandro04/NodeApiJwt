const express = require('express');
const router = express.Router();

const Client = require('../models/Client')

router.get('/clients', async (req, res) => {

    try {
        const clients = await Client.find()
        res.json(clients);

    } catch (error) {
        res.json({
            error: error
        });
    }
})

router.post('/clients', async (req, res) => {
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


router.get('/clients/:id', async (req, res) => {

    try {
        const client = await Client.findById(req.params.id)
        res.json(client);

    } catch (error) {
        res.json({
            error: error
        });
    }
})


router.put('/clients/:id', async (req, res) => {
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

router.delete('/clients/:id', async (req, res) => {
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