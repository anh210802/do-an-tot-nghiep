const setDeviceController = require('../controllers/setDeviceController');
const middlewareController = require('../controllers/middlewareController');
const express = require('express');
const router = express.Router();

router.post('/set-device', middlewareController.verifyToken, setDeviceController.setDevice);

router.post('/delete-device', middlewareController.verifyToken, setDeviceController.deleteDevice);

module.exports = router;