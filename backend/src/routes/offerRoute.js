const express = require("express");
const router = express.Router();
const Offer = require("../models/Offer");

// Create a new offer
router.post("/", async (req, res) => {
  try {
    const { title, description, lat, lng } = req.body;
    if (!title || !lat || !lng) return res.status(400).json({ message: "Title and location required" });

    const offer = await Offer.create({
      title,
      description,
      location: { type: "Point", coordinates: [lng, lat] }, // GeoJSON format
    });

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get offers near a location
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query; // radius in km
    if (!lat || !lng) return res.status(400).json({ message: "Latitude and longitude required" });

    const offers = await Offer.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000, // convert km to meters
        },
      },
    });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
