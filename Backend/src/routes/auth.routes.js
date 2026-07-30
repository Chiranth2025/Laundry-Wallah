const express = require('express');
const router = express.Router();
// Import both functions from your controller
const { registerUser, loginUser } = require('../controller/auth.controller'); 

// http://localhost:3000/api/auth/register
router.post('/register', registerUser);

// http://localhost:3000/api/auth/login
router.post('/login', loginUser);

module.exports = router;