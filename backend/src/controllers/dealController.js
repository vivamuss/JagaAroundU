const Deal = require("../models/Deal");

exports.createDeal = async (req, res) => {
  try {
    const deal = new Deal(req.body);
    await deal.save();
    res.json(deal);
  } catch (err) {
    res.status(500).json({ error: "Failed to create deal" });
  }
};

exports.getDeals = async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch deals" });
  }
};
