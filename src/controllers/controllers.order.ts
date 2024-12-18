// create an order of products to be taken and tag it waiting approval, specify if u will return products
//when admin approves status changes to approved
// when products are returned fetch all products from order and and restock products

import Order from "../database/models/models.order";
import Product from "../database/models/models.product";

// Import Product model

import User from "../database/models/models.customer"; // Adjust the path to your User model
 // Adjust the path to your Product model
import { sendEmail } from "../utils/sendSms.utils"; // Adjust the path to your sendEmail function

export const createOrder = async (req, res) => {
  const { userId, warehouse, products } = req.body;

  try {
    // Validate userId
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: "Products must be a non-empty array." });
    }

    // Check if each product exists in the product database and reduce stock
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
        return res
          .status(400)
          .json({ success: false, message: `Product with ID ${product.productId} does not exist.` });
      }

      // Check if there is enough stock available
      if (existingProduct.av_quantity < product.quantity) {
        return res
          .status(400)
          .json({ success: false, message: `Insufficient stock for product ID ${product.productId}.` });
      }

      // Reduce the available quantity of the product
      // existingProduct.av_quantity -= product.quantity;
      // await existingProduct.save();
    }

    // Create new order
    const order = new Order({
      userId,
      warehouse,
      products,
      createdAt: Date.now(),
      status: "pending", // Default to pending status
    });

    // Save the order to the database
    const savedOrder = await order.save();

    // Fetch all users with the admin role
    const adminUsers = await User.find({ role: "admin" });

    // Notify each admin via email
    const emailPromises = adminUsers.map((admin) => {
      const subject = "New Order Created";
      const orderDetailsUrl = `https://imsystems.vercel.app/admin/orders`; // Add this to .env
      const emailBody = orderDetailsUrl;
      return sendEmail(subject, emailBody, admin.email);
    });

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

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

// Adjust the path to your Order model

export const trackOrdersByMonth = async (req, res) => {
  try {
    // Aggregate orders by month
    const ordersByMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 }, // Count the number of orders
          orders: { $push: "$$ROOT" }, // Include all order details
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          count: 1,
          orders: 1,
        },
      },
    ]);

    // Map months to names for better readability
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Add month names to the result
    const formattedData = ordersByMonth.map((entry) => ({
      month: months[entry.month - 1],
      year: entry.year,
      count: entry.count,
      orders: entry.orders,
    }));

    // Return the aggregated data
    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error tracking orders by month:", error);
    res.status(500).json({ error: "Failed to track orders by month." });
  }
};




 // Adjust path to your Order model

export const approveOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the order by orderId and populate userId and product details
    const order = await Order.findOne({ orderId })
      .populate("products.productId")
      .populate("userId");

    // Check if the order exists
    if (!order) {
      console.log("Order not found with orderId:", orderId); // Log if order is not found
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check if the order is pending
    if (order.status !== "pending") {
      return res.status(400).json({ success: false, message: "Order is not pending" });
    }

    // Check and update product quantities
    for (const product of order.products) {
      const productDoc = await Product.findById(product.productId);
      if (productDoc.quantity < product.quantity) {
        return res
          .status(400)
          .json({ success: false, message: `Insufficient stock for product: ${productDoc.name}` });
      }
      productDoc.av_quantity -= product.quantity;
      await productDoc.save();
    }

    // Update the order status to approved
    order.status = "approved";
    await order.save();

    // Send email notification to the user
    const userEmail = order.userId.email; // Get user's email
    const subject = "Your Order Has Been Approved";
    const orderDetailsUrl = `https://imsystems.vercel.app/signin`; // Add this to your .env
    const emailBody = `
      Your order has been approved! You can view the details by clicking the button below:
      ${orderDetailsUrl}
    `;

    await sendEmail(subject, orderDetailsUrl, userEmail);

    // Send success response
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error approving order:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};




export const rejectOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId }).populate("products.productId");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.status !== "pending") {
      return res.status(400).json({ success: false, message: "Order is not pending" });
    }

    // You can add any additional rejection logic here if needed
    order.status = "rejected";
    await order.save();
    return res.status(200).json({ success: true, message: "Order has been rejected", order });
  } catch (error) {
    console.error("Error rejecting order:", error);
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
