const express = require("express");
const router = express.Router();
const Deals = require("../models/Deals");

// Create a new deal
router.post("/", async (req, res) => {
  try {
    const newDeal = new Deals(req.body);
    await newDeal.save();
    res.json(newDeal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all deals
router.get("/", async (req, res) => {
  try {
    const deals = await Deals.find();
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get nearby deals
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: "Latitude and longitude required" });

    const deals = await Deals.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1000, // km → meters
        },
      },
    });

    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
