const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const verifyToken = require('./token/verifyToken');

const authController = require('./controllers/authController');

const app = express();

// Middleware for parsing JSON requests
app.use(cors());
app.use(bodyParser.json({limit: '100mb'}));

// Path
app.use('/register', authController.Register);

// Server port
const PORT  = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});