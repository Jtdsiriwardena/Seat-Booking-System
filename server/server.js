const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const jwt = require('jsonwebtoken');
const app = express();
const internRoutes = require('./routes/internRoutes');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.internId = decoded.id; 
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

app.use('/api/auth', authRoutes);

app.use('/api/bookings', authMiddleware, bookingRoutes);

app.use('/api/interns', internRoutes);


const holidayRoutes = require('./routes/holidayRoutes');
app.use('/api', holidayRoutes);

app.use((req, res, next) => {
    console.log(`Request URL: ${req.originalUrl}`);
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
