const express = require('express');
const router = express.Router();
const { sendOtp, createUser, loginUser, logoutUser, getProfile, updateProfile, changePassword, deleteAccount } = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.post('/sendotp', sendOtp);
router.post('/signup', createUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, updateProfile);
router.put('/password', isAuthenticated, changePassword);
router.delete('/account', isAuthenticated, deleteAccount);

module.exports = router;
