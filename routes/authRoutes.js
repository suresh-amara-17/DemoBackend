const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

// example admin-only
router.get('/admin-only', verifyToken, checkRole('admin'), (req, res) => {
  res.json({ message: 'You are an admin!' });
});

module.exports = router;