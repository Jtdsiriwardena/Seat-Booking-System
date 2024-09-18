

const express = require('express');
const router = express.Router();
const Holiday = require('../models/Holiday'); 


router.post('/holidays', async (req, res) => {
    try {
        const { date, reason } = req.body;
        const holiday = new Holiday({ date, reason });
        await holiday.save();
        res.status(201).json(holiday);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/holidays', async (req, res) => {
    try {
        const holidays = await Holiday.find();
        res.json(holidays);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
