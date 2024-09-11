import { Request, Response } from 'express';
import { connectToDatabase } from '../database';
import axios from 'axios';
import Order from '../database/models/models.order';
import User from '../database/models/models.customer';
import Product from '../database/models/models.product';

const PAYSTACK_SECRET_KEY = "sk_live_b656166f9c8b4216425d78a0ef4c49a390d84cbd";

export const createOrder = async (req: any, res: Response) => {
    const { products, location, deliveryTime } = await req.body;
    const customer =  req.user;
   
    
    try {
        await connectToDatabase();

        // Calculate the total amount
        let totalAmount:any = 0;
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).send({ msg: `Product with ID ${item.product} not found` });
            }
            totalAmount += product.price * item.quantity;
        }

        // Create the order
        const newOrder = new Order({
            customer:customer._id,
            products,
            totalAmount,
            location,
            deliveryTime
        });

        await newOrder.save();
        console.log(newOrder);

        const parseTotal = parseFloat(totalAmount)
        
        console.log(totalAmount);
        
        

        // Initiate Paystack payment
        // const user = await User.findById(customer);
        const paymentResponse = await axios.post('https://api.paystack.co/transaction/initialize', {
            email: 'simon@gmail.com',
            amount:  Math.round(parseTotal * 100) , // Paystack expects the amount in kobo (or smallest currency unit)
            metadata: {
                orderId: newOrder._id
            }, channels: ["card", "mobile_money"],
        }, {
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        });
 console.log(paymentResponse.data);
 
        return res.status(201).send({
            order: newOrder,
            paymentUrl: paymentResponse.data.data.authorization_url
        });

    } catch (error) {
        return res.status(500).send({ msg: 'Error creating order', error });
    }
};


export const verifyPayment = async (req: Request, res: Response) => {
    const { reference } = req.query;

    try {
        await connectToDatabase();

        // Verify payment with Paystack
        const paymentVerificationResponse = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        const { status, amount, metadata } = paymentVerificationResponse.data.data;

        if (status === 'success') {
            // Update the order
            const order = await Order.findById(metadata.orderId);
            if (!order) {
                return res.status(404).send({ msg: 'Order not found' });
            }

            order.paymentStatus = 'paid';
            order.status = 'confirmed';
            order.totalAmount = amount / 100; // Convert back from kobo
            await order.save();

            return res.status(200).send({ msg: 'Payment successful and order confirmed', order });
        } else {
            return res.status(400).send({ msg: 'Payment verification failed' });
        }

    } catch (error) {
        return res.status(500).send({ msg: 'Error verifying payment', error });
    }
};


export const getAllOrders = async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const orders = await Order.find().populate('customer partner products.product location');
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

