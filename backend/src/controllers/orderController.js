const Order = require("../models/Order");
const Deal = require("../models/Deal");

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      dealId,
      title,
      dealDescription,
      originalPrice,
      discountPrice,
      category,
      specialInstructions,
      quantity
    } = req.body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !dealId || !title) {
      return res.status(400).json({
        error: "Missing required fields: customerName, customerEmail, customerPhone, dealId, title"
      });
    }

    const order = new Order({
      customerName,
      customerEmail,
      customerPhone,
      dealId,
      title,
      dealDescription,
      originalPrice,
      discountPrice,
      category,
      specialInstructions: specialInstructions || "",
      quantity: quantity || 1
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: order
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Get orders by customer email
exports.getOrdersByCustomer = async (req, res) => {
  try {
    const { customerEmail } = req.params;

    if (!customerEmail) {
      return res.status(400).json({ error: "Customer email is required" });
    }

    const orders = await Order.find({ customerEmail })
      .sort({ orderDate: -1 }) // Most recent first
      .exec();

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get all orders (for admin/business view)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ orderDate: -1 })
      .exec();

    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || !["pending", "confirmed", "in_progress", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: "Order status updated successfully",
      order: order
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};
