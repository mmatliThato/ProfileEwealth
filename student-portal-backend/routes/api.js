const express = require('express');
const { register, login, resetPassword, sendVerificationCode, getProfile } = require('../controllers/authController');
const { validateToken, authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);




// Route for password reset
router.post('/reset-password', resetPassword);

// Route to send verification code
router.post('/send-verification-code', sendVerificationCode);

// Protected route for getting the user's profile using JWT-based authorization
// router.get("/profile", validateToken, getProfile);

router.get("/profile", validateToken, (req, res) => {
    res.json("profile");
  });




module.exports = router;
