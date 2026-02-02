const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/sensors", require("./sensor.routes"));

module.exports = router;
