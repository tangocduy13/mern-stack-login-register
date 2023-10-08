const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test } = require('../controllers/authController')
const authController = require('../controllers/authController')

// middleware
router.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173"
    })
)
router.get("/", test);
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/profile", authController.getProfile);

module.exports = router