const express = require("express");
const router = express.Router();
const propertiesController = require("../controllers/propertiesController");

router.get("/", propertiesController.index);
// router.get("/:id", propertiesController.show);

module.exports = router;