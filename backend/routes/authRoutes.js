const router        = require('express').Router();
const authCtrl      = require('../controllers/authController');

// /api/auth/register   POST {email, password}
router.post('/register', authCtrl.register);

// /api/auth/login      POST {email, password}
router.post('/login',    authCtrl.login);

module.exports = router;
