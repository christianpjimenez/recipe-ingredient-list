const router   = require('express').Router();
const recipeCtrl = require('../controllers/recipeController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

/* PUBLIC */
router.get('/',       recipeCtrl.getAll);
router.get('/:id',    recipeCtrl.getOne);

/* ADMIN-ONLY */
router.post('/',      verifyToken, isAdmin, recipeCtrl.create);
router.put('/:id',    verifyToken, isAdmin, recipeCtrl.update);
router.delete('/:id', verifyToken, isAdmin, recipeCtrl.remove);

module.exports = router;
