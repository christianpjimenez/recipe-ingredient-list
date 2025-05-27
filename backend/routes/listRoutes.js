const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');

router.post('/generate', listController.generateList);

module.exports = router;
