//view their orders
//update order
//create services
//chat feature
//notification

import { Request, Response } from 'express';
import User from '../../database/models/models.customer';
import { connectToDatabase } from '../../database';

import Order from '../../database/models/models.order';

// Get all partners
export const getAllPartners = async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const partners = await User.find({ role: 'partner' })
            .populate('services')
            .populate('location')
            .populate('address')
            .populate('savedAddresses')
          

        return res.status(200).send(partners);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching partners', error });
    }
};

// Get partner by ID based on the services they offer
export const getPartnerById = async (req: Request, res: Response) => { 
    const { partnerId } = req.params;

    try {
        await connectToDatabase();

        const partner = await User.findOne({ _id: partnerId, role: 'partner' })
            .populate('services')
            .populate('location')
            .populate('address')
           
           
        if (!partner) {
            return res.status(404).send({ msg: 'Partner not found' });
        }

        return res.status(200).send(partner);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching partner by ID', error });
    }
};

// Get partners by service ID
export const getPartnersByService = async (req: Request, res: Response) => {
    const { serviceId } = req.params;

    try {
        await connectToDatabase();

        const partners = await User.find({ role: 'partner', services: serviceId })
            .populate('services')
            .populate('location')
            .populate('address')
            .populate('savedAddresses')
            

        if (partners.length === 0) {
            return res.status(404).send({ msg: 'No partners found for this service' });
        }

        return res.status(200).send(partners);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching partners by service', error });
    }
};

//update order


// Add service to partner's services
export const addServiceToPartner = async (req: Request, res: Response) => {
    const { partnerId, serviceId } = req.body;

    try {
        await connectToDatabase();

        // Ensure the service exists
       

        // Find the partner and update their services field
        const updatedPartner = await User.findOneAndUpdate(
            { _id: partnerId, role: 'partner' },
            { $addToSet: { services: serviceId } },  // Use $addToSet to avoid duplicates
            { new: true }  // Return the updated document
        ).populate('services');

        if (!updatedPartner) {
            return res.status(404).send({ msg: 'Partner not found' });
        }

        return res.status(200).send(updatedPartner);
    } catch (error) {
        return res.status(500).send({ msg: 'Error adding service to partner', error });
    }
};


export const updateOrderStatus = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { partnerId } = req.body;

    try {
        await connectToDatabase();

        // Find the order by ID and ensure the partner matches the one associated with the order
        const order = await Order.findOne({ _id: orderId, partner: partnerId });

        if (!order) {
            return res.status(404).send({ msg: 'Order not found or partner does not have permission to update this order' });
        }

        // Update the order status to 'completed'
        order.status = 'completed';
        order.updatedAt = Date.now();  // Update the 'updatedAt' timestamp
        await order.save();

        return res.status(200).send({ msg: 'Order status updated to completed', order });
    } catch (error) {
        return res.status(500).send({ msg: 'Error updating order status', error });
    }
};

