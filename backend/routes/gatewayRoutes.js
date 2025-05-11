const handleGatewayController = require("../controllers/handleGatewayController");
const middlewareController = require("../controllers/middlewareController");
const express = require("express");
const router = express.Router();

router.post("/set-gateway", middlewareController.verifyToken, handleGatewayController.setGateway);
router.post("/delete-gateway", middlewareController.verifyToken, handleGatewayController.deleteGateway);
router.get("/get-all-gateway", middlewareController.verifyToken, handleGatewayController.getAllGateway);

module.exports = router;