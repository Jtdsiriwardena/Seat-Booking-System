const express = require('express');
const { signup, login, googleLogin, updateInternId } = require('../controllers/authController');
const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/update-intern-id', updateInternId);

module.exports = router;