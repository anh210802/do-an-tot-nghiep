const handleCowController = require('../controllers/handleCowController');
const middlewareController = require('../controllers/middlewareController');
const express = require('express');
const router = express.Router();

router.use(middlewareController.verifyToken);

// Add a new cow
router.post('/add-cow', middlewareController.verifyToken, handleCowController.addCow);

// Get all cows for a user
router.get('/get-all-cows', middlewareController.verifyToken, handleCowController.getAllCows);

// Delete a cow by ID
router.delete('/delete-cow/:cowId', middlewareController.verifyToken, handleCowController.deleteCow);

// Update a cow by ID
router.put('/update-cow/:cowId', middlewareController.verifyToken, handleCowController.updateCow);

module.exports = router;