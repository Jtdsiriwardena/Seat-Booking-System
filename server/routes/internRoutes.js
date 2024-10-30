const express = require('express');
const router = express.Router();
const { getAllInterns } = require('../controllers/internController');

router.get('/', getAllInterns);

module.exports = router;
