const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors')
const app = express();
const port = 5000;


// Connect to MongoDB
connectToMongo();

// Middleware
app.use(cors())
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// User authentication routes
app.use('/api/auth', require('./routes/user'));

// Notes routes
app.use('/api/notes', require('./routes/notes'));

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});
