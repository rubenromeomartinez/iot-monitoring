const express = require("express");
const router = express.Router();

router.get("/realtime", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = router;
