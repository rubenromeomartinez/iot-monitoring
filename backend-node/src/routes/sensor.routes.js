const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensor.controller");

router.get("/", sensorController.getSensors);
router.get("/readings", sensorController.getReadings);

module.exports = router;
