const Intern = require('../models/Intern');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { internID, firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const intern = new Intern({ internID, firstName, lastName, email, password: hashedPassword });
    await intern.save();
    
    res.status(201).json({ message: 'Intern registered successfully!' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const intern = await Intern.findOne({ email });

    if (!intern || !await bcrypt.compare(password, intern.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: intern._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};