const router = require('express').Router();
const ingredientCtrl = require('../controllers/ingredientController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// 🟢 Public
router.get('/',       ingredientCtrl.getAll);
router.get('/:id',    ingredientCtrl.getOne);

// 🔐 Admin-only
router.post('/',      verifyToken, isAdmin, ingredientCtrl.create);
router.put('/:id',    verifyToken, isAdmin, ingredientCtrl.update);
router.delete('/:id', verifyToken, isAdmin, ingredientCtrl.remove);

module.exports = router;
