const handleDeviceController = require('../controllers/handleDeviceController');
const middlewareController = require('../controllers/middlewareController');
const express = require('express');
const router = express.Router();

router.post('/set-device', middlewareController.verifyToken, handleDeviceController.setDevice);

router.post('/delete-device', middlewareController.verifyToken, handleDeviceController.deleteDevice);

module.exports = router;