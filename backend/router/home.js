const router = require("express").Router();
router.get("/", (req, res) => {
  res.send("Welcome to the dashboard page");
})

module.exports = router;