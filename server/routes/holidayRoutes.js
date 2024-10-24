

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

router.delete('/holidays/:id', async (req, res) => {
    try {
        const holiday = await Holiday.findByIdAndDelete(req.params.id);
        if (!holiday) {
            return res.status(404).json({ message: 'Holiday not found' });
        }
        res.status(200).json({ message: 'Holiday deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
