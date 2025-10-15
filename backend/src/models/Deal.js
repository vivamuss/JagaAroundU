const mongoose = require("mongoose");

const DealSchema = new mongoose.Schema({
  title: String,
  description: String,
  discount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Deal", DealSchema);
