const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const FetchUser = require('../middleware/FetchUser');

const JwtSecret = "M1thunHasSignedIt"

// Route for user signup "/api/auth/signup"
router.post('/signup', [
    body('name', 'Enter a valid name between 3-25 characters').isLength({ min: 3, max: 25 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password with at least 6 characters').isLength({ min: 6 }),
], async (req, res) => {
    // Validate request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return validation errors if present
        return res.status(400).json({ errors: errors.array() });
    } else {
        try {
            // Check if the user already exists
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ success: false, error: 'Email already exists' });
            }

            // Secure the password
            const salt = await bcrypt.genSalt(10)
            const SecurePass = await bcrypt.hash(req.body.password, salt)

            // Create a new user instance and save it
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: SecurePass,
            });
            user.save()
                .then(() => {

                    const data = {
                        user: {
                            id: user.id,
                        }
                    }

                    let token = jwt.sign(data, JwtSecret);

                    res.send({ success: true, token, name: user.name });
                });
        } catch (error) {
            console.error("Error saving user:", error);
            res.status(500).json({ error: "Internal Server Error", message: error });
        }
    }
});

// Route for user login "/api/auth/login"
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').exists(),
], async (req, res) => {
    // Validate request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Return validation errors if present
        return res.status(400).json({ errors: errors.array() });
    } else {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ success: false, error: 'Bad credentials!' });
            }
            const passwordCom = await bcrypt.compare(password, user.password)
            if (!passwordCom) {
                return res.status(400).json({ success: false, error: 'Bad credentials!' });
            }

            const data = {
                user: {
                    id: user.id,
                }
            }

            let token = jwt.sign(data, JwtSecret);

            res.send({ success: true, token, name: user.name });

        } catch (error) {
            console.error("Error saving user:", error);
            res.status(500).json({ error: "Internal Server Error", message: error });
        }
    }
});

// Route to get user data "/api/auth/getuser"
router.post('/getuser', FetchUser, async (req, res) => {
    try {
        let userID = req.user.id
        const user = await User.findById(userID).select('-password')
        res.send({ success: true, user });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ error: "Internal Server Error", message: error });
    }
}
);

module.exports = router;
