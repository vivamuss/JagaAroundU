const express = require("express");
const router = express.Router();
const { createDeal, getDeals } = require("../controllers/dealController");

router.post("/", createDeal);
router.get("/", getDeals);

module.exports = router;
