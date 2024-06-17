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

// Login Path
function Login(req, res) {
    const { name, password } = req.body;

    // Retrieve user from database
    db.query('SELECT * FROM users WHERE name = $1', [name], (err, result) => {
        if (err) {
            console.log('Error fetching user from database', err);
            return res.status(500).json({ message: 'Internal error while logging in' });
        }

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.log('Error comparing passwords', err);
                return res.status(500).json({ message: 'Internal error while logging in' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Create JWT token
            const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET_KEY, { expiresIn: '1h' });

            return res.status(200).json({ message: 'Login successful', token });
        });
    });
}

module.exports = {
    Register,
    Login
}
