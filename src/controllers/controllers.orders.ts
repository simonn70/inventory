import { Request, Response } from 'express';
import { connectToDatabase } from '../database';
import axios from 'axios';
import Order from '../database/models/models.order';
import Location from '../database/models/models.location';
import User from '../database/models/models.customer';
import Product from '../database/models/models.product';

const PAYSTACK_SECRET_KEY = "sk_live_b656166f9c8b4216425d78a0ef4c49a390d84cbd";

export const createOrder = async (req: any, res: Response) => {
    const { products, paymentMethod, locationCategory, deliveryTime, pickupTime } = req.body;
    const customer = req.user;

    try {
        await connectToDatabase();

        // Find the location by locationCategory
        const location = await Location.findOne({ category: locationCategory });
        if (!location) {
            return res.status(404).send({ msg: `Location with category '${locationCategory}' not found` });
        }

        // Calculate the total amount for the order and populate service in products
        let totalAmount: number = 0;
        const populatedProducts = [];
        
        for (const item of products) {
            const product = await Product.findById(item.product).populate('service');
            if (!product) {
                return res.status(404).send({ msg: `Product with ID ${item.product} not found` });
            }

            totalAmount += product.price * item.quantity;
            populatedProducts.push({
                product: product._id,
                service: product.service.name,
                quantity: item.quantity,
            });
        }

        // Create the order object
        const newOrder = new Order({
            customer: customer._id,
            products: populatedProducts,
            totalAmount,
            paymentMethod,
            location: location._id,
            deliveryTime,
            pickupTime,
        });

        // Save the order to the database
        await newOrder.save();

        // Handle payment based on payment method
        if (paymentMethod === 'card') {
            // Proceed with Paystack payment
            const parseTotal = parseFloat(totalAmount.toFixed(2));

            // Initialize Paystack payment
            const paymentResponse = await axios.post('https://api.paystack.co/transaction/initialize', {
                email: customer.email, // assuming customer object has an email field
                amount: Math.round(parseTotal * 100), // amount in Kobo
                metadata: {
                    orderId: newOrder._id
                },
                channels: ["card", "mobile_money"],
            }, {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            });

            return res.status(201).send({
                order: newOrder,
                paymentUrl: paymentResponse.data.data.authorization_url
            });
        } else if (paymentMethod === 'payOnDelivery') {
            // Skip payment processing for Pay on Delivery
            return res.status(201).send({
                order: newOrder,
                message: 'Order created successfully. Payment will be made on delivery.'
            });
        } else {
            return res.status(400).send({ msg: 'Invalid payment method' });
        }
    } catch (error) {
        return res.status(500).send({ msg: 'Error creating order', error });
    }
};



export const getAllOrders = async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const orders = await Order.find().populate("products.product");
        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching orders', error });
    }
};


export const getOrderById = async (req: Request, res: Response) => {
    const { orderId } = req.params;

    try {
        await connectToDatabase();
        const order = await Order.findById(orderId).populate('customer partner products.product location');
        if (!order) {
            return res.status(404).send({ msg: 'Order not found' });
        }
        return res.status(200).send(order);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching order', error });
    }
};


export const updateOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const updateData = req.body;

    try {
        await connectToDatabase();
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });
        if (!updatedOrder) {
            return res.status(404).send({ msg: 'Order not found' });
        }
        return res.status(200).send(updatedOrder);
    } catch (error) {
        return res.status(500).send({ msg: 'Error updating order', error });
    }
};


export const deleteOrder = async (req: Request, res: Response) => {
    const { orderId } = req.params;

    try {
        await connectToDatabase();
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).send({ msg: 'Order not found' });
        }
        return res.status(200).send({ msg: 'Order deleted successfully' });
    } catch (error) {
        return res.status(500).send({ msg: 'Error deleting order', error });
    }
};


export const getOrdersByPartner = async (req: Request, res: Response) => {
    const { partnerId } = req.params;

    try {
        await connectToDatabase();
        const orders = await Order.find({ partner: partnerId })
            

        if (!orders.length) {
            return res.status(404).send({ msg: 'No orders found for this partner' });
        }

        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching orders by partner', error });
    }
};


export const getOrdersByCustomer = async (req: Request, res: Response) => {
    const { customerId } = req.params;

    try {
        await connectToDatabase();
        const orders = await Order.find({ customer: customerId })
           

        if (!orders.length) {
            return res.status(404).send({ msg: 'No orders found for this customer' });
        }

        return res.status(200).send(orders);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching orders by customer', error });
    }
};

