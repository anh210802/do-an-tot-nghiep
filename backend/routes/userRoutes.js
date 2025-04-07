const userController = require('../controllers/userController');
const middlewareController = require('../controllers/middlewareController');
const express = require('express');
const router = express.Router();

router.get('/', middlewareController.verifyToken, userController.getUser);

module.exports = router;