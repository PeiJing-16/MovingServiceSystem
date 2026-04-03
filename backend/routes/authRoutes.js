
const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile, deleteUserAccount, loginAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', loginAdmin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserAccount);

module.exports = router;