const express = require("express");
const router = express.Router();
const thresholdController = require("../controllers/threshold.controller");

router.post("/", thresholdController.setThreshold);
router.get("/", thresholdController.getThresholds);

module.exports = router;
