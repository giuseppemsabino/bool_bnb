const express = require("express");
const router = express.Router();
const propertiesController = require("../controllers/propertiesController");

// index
router.get("/", propertiesController.index);

//show
router.get("/:id", propertiesController.show);

//store
router.post("/", propertiesController.storeProperty);
router.post("/:id", propertiesController.storeReview);

//destroy
router.delete("/:id", propertiesController.destroy);

module.exports = router;
