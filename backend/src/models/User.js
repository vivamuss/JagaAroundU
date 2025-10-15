const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["company", "customer"], default: "customer" }
});

module.exports = mongoose.model("User", UserSchema);
