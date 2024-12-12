// create an order of products to be taken and tag it waiting approval, specify if u will return products
//when admin approves status changes to approved
// when products are returned fetch all products from order and and restock products

import Order from "../database/models/models.order";
import Product from "../database/models/models.product";

// Import Product model

export const createOrder = async (req, res) => {
  const { userId, warehouse, products } = req.body;

  try {
    // Validate userId
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Validate warehouse
    const validWarehouses = ["TEMA"];
    if (!validWarehouses.includes(warehouse)) {
      return res.status(400).json({ success: false, message: `Invalid warehouse. Must be one of: ${validWarehouses.join(", ")}` });
    }

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: "Products must be a non-empty array." });
    }

    // Check if each product exists in the product database
    for (const product of products) {
      if (!product.productId || !product.quantity) {
        return res.status(400).json({ success: false, message: "Each product must have a productId and quantity." });
      }

      if (product.quantity <= 0) {
        return res.status(400).json({ success: false, message: "Product quantity must be greater than 0." });
      }

      // Check if the product exists in the database
      const existingProduct = await Product.findById(product.productId);
      if (!existingProduct) {
        return res.status(400).json({ success: false, message: `Product with ID ${product.productId} does not exist.` });
      }
    }

    // Create new order
    const order = new Order({
      userId,
      warehouse,
      products,
      status: "pending", // Default to pending status
    });

    // Save the order to the database
    const savedOrder = await order.save();

    // Send success response
    return res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message || error,
    });
  }
};


export const approveOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId }).populate("products.productId");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.status !== "pending") {
      return res.status(400).json({ success: false, message: "Order is not pending" });
    }

    if (order) {
      for (const product of order.products) {
        const productDoc = await Product.findById(product.productId);
        if (productDoc.quantity < product.quantity) {
          return res
            .status(400)
            .json({ success: false, message: `Insufficient stock for product: ${productDoc.name}` });
        }
        productDoc.quantity -= product.quantity;
        await productDoc.save();
      }
    }

    order.status = "approved";
    await order.save();
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error approving order:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const returnProducts = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("products.productId");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    for (const product of order.products) {
      if (product.isReturned) continue; // Skip already returned products

      const productDoc = await Product.findById(product.productId);
      if (productDoc.isReturnable) {
        productDoc.quantity += product.quantity;
        await productDoc.save();
        product.isReturned = true;
      }
    }

    order.status = "completed"; // Update the status to completed if all products are returned
    await order.save();
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error handling returns:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


 // Adjust the path as necessary

export const fetchPendingOrders = async (req, res) => {
  try {
    // Find all orders with the status "pending"
    const pendingOrders = await Order.find({ status: "pending" })
      .populate("userId")
      .populate("products.productId");

    // Return the pending orders
    return res.status(200).json({ success: true, orders: pendingOrders });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    return res.status(500).json({ success: false, message: "Error fetching pending orders", error: error.message });
  }
};

 // Adjust the path as necessary

export const fetchOrdersByUserId = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    // Find all orders where userId matches the provided ID
    const userOrders = await Order.find({ userId }).populate("products.productId");

    // If no orders are found, return an appropriate response
    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found for this user" });
    }

    // Return the fetched orders
    return res.status(200).json({ success: true, orders: userOrders });
  } catch (error) {
    console.error("Error fetching orders by userId:", error);
    return res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};
