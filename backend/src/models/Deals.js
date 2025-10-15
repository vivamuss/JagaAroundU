const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  discount: String,
  expiry: Date,
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
});

// Geospatial index for location-based queries
dealSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Deals", dealSchema);
