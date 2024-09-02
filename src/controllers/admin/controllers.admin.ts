// view all partners
//view customers

import User from "../../database/models/models.customer";
import Order from "../../database/models/models.order";

// assign orders to partners


export const viewAllPartners = async (req, res) => {
    try {
        const partners = await User.find().populate('user'); // Assuming Partner references a User model
        res.status(200).json({ successful: true, partners });
    } catch (error) {
        console.error('Error fetching partners:', error);
        res.status(500).json({ successful: false, msg: 'Failed to fetch partners' });
    }
};

export const viewAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer').populate('assignedPartner'); // Populating customer and assignedPartner fields
        res.status(200).json({ successful: true, orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ successful: false, msg: 'Failed to fetch orders' });
    }
};

export const assignOrderToPartner = async (req, res) => {
    const { orderId, partnerId } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ successful: false, msg: 'Order not found' });
        }

        const partner = await User.findById(partnerId);
        if (!partner) {
            return res.status(404).json({ successful: false, msg: 'Partner not found' });
        }

        order.assignedPartner = partnerId; // Assuming you have an `assignedPartner` field in your Order schema
        await order.save();

        res.status(200).json({ successful: true, msg: 'Order assigned to partner successfully', order });
    } catch (error) {
        console.error('Error assigning order to partner:', error);
        res.status(500).json({ successful: false, msg: 'Failed to assign order to partner' });
    }
};

export const viewAllCustomers = async (req, res) => {
    try {
        const customers = await User.find();
        res.status(200).json({ successful: true, customers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ successful: false, msg: 'Failed to fetch customers' });
    }
};
