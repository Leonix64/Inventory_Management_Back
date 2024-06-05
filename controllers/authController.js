const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { JWT_SECRET_KEY } = require('../token/verifyToken');

// Registration Path
function Register(req, res) {
    const { name, last_name, age, phone, gender, password } = req.body;

    // Password hash
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.log('Error generating password hash', err);
            return res.status(500).json({ message: 'Internal error while registering a user' });
        }

        // Insert into database
        db.query('INSERT INTO users (name, last_name, age, phone, gender, password) VALUES ($1, $2, $3, $4, $5, $6)', [name, last_name, age, phone, gender, hashedPassword], (err, result) => {
            if (err) {
                console.log('Error inserting into database', err);
                return res.status(500).json({ message: 'Error registering a user' });
            }
            console.log('User registered successfully');
            return res.status(201).json({ message: 'User registered successfully' });
        });
    });
}

module.exports = {
    Register
}