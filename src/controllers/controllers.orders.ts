import { Request, Response, response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from "../database";
import Order from "../database/models/models.order";
import Customer from '../database/models/models.customer';
import Vendor from '../database/models/models.vendor';
import DeliveryGuy from '../database/models/models.deliveryGuy';
import { initializePayment, verifyPayment } from "../utils/order.utils";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export const createOrder = async (req:Request, res:Response) => {
  const { vendorId, customerId, services, deliveryGuyId,email,  paymentDetails, paymentMethod } = req.body;

  if (!vendorId || !customerId || !services  || !paymentDetails || !paymentMethod) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await connectToDatabase();
    
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

   
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }


    let deliveryGuy = null;
    if (deliveryGuyId) {
      deliveryGuy = await DeliveryGuy.findById(deliveryGuyId);
      if (!deliveryGuy) {
        return res.status(404).json({ message: 'Delivery guy not found' });
      }
    }

    let paymentResponse;
    const callbackUrl = 'http://your-frontend-url.com/payment/callback';
    if (paymentMethod === 'card') {
      paymentResponse = await initializePayment({
        email: email,
        amount: paymentDetails.amount * 100, // Amount in kobo for Paystack (NGN 50.00)
        metadata: paymentDetails.metadata,
        callback_url: callbackUrl,
       

      });
    } else if (paymentMethod === 'momo') {
      paymentResponse = await initializePayment({
        email: paymentDetails.email,
        amount: paymentDetails.amount * 100, // Amount in kobo for Paystack (NGN 50.00)
        metadata: paymentDetails.metadata,
        channels: ['mobile_money'],
        callback_url: callbackUrl,
       
      });
    } else {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    if (!paymentResponse.status) {
      return res.status(400).json({ message: 'Payment initialization failed' });
    }

    
    const order = new Order({
      vendorId,
      customerId,
      services,
      deliveryGuy: deliveryGuyId,
      invoice:paymentResponse.data.reference,
      status: 'Pending',
    });

    await order.save();
    console.log(paymentResponse,order);
    


    res.status(201).json({  payment: paymentResponse.data });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOrderPayment = async (req:Request, res:Response) => {
  const { reference } = req.body;
   await connectToDatabase()
  
  try {
    const paymentVerification = await verifyPayment(reference);
    if (!paymentVerification.status) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

  
    let order = await Order.findOne({ invoice: reference })
    .populate("services")
    .populate("deliveryGuy")
    .populate("customerId");
  
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'Paid';
    await order.save();

    res.status(200).json({ message: 'Payment verified and order updated', order });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};





export const webhook = async (req:Request, res:Response) => {
    const secret = req.headers['x-paystack-signature'];
    
    // Verify the webhook signature
    if (!secret || secret !== PAYSTACK_SECRET_KEY) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const event = req.body;
  
    try {
      await connectToDatabase();
  
      // Handle the event
      switch (event.event) {
        case 'charge.success':
          const { reference, status } = event.data;
          if (status === 'success') {
            
            const order = await Order.findOne({ invoice: reference });
            if (order) {
              order.status = 'Paid';
              await order.save();
            }
          }
          break;
   
        default:
          break;
      }
  
      res.status(200).json({ message: 'Webhook received' });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  


export const getOrder = async (request: Request, response: Response) => {
    const { id } = request.params
    try {
        await connectToDatabase()
        const order = await Order.findById(id)
        if (!order) {
            return response.status(404).send({ msg: "could not find order"})
        }
        return response.status(200).send({ order: order })
    } catch (error) {
        // return response.status(500).send({ msg: "error fetching order"})
        throw error
    }
}

export const getAllOrders = async (request: Request, response: Response) => {
    try {
        await connectToDatabase()
        const orders = await Order.find({})
        if (!orders) {
            return response.status(404).send({ msg: "could not find orders" })
        }
        return response.status(200).send({ orders: orders })
    } catch (error) {
        return response.status(500).send({ msg: "error fetching orders"})
    }
}

export const deleteOrder = async (request: Request, response: Response) => {
    const { id } = request.params

    try {
        await connectToDatabase()
        const deletedOrder = await Order.findByIdAndDelete(id)
        if (!deletedOrder) {
            return response.status(404).send({ msg: "no order to delete"})
        }
        return response.status(200).send({ msg: "order deleted successfully", deletedOrder: deletedOrder })
    } catch (error) {
        return response.status(500).send({ msg: "error deleting order"})   
    }
}

export const updateOrder = async (request: Request, response: Response) => {
    const data = request.body
    const { id } = request.params

    try {
        await connectToDatabase()
        const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true })
        if (!updatedOrder) {
            return response.status(404).send({ msg: "no order found to update"})
        }
        return response.status(200).send({ msg: "order updated", order: updatedOrder })
    } catch (error) {
        return response.status(500).send({ msg: "error updating order" })
    }
}