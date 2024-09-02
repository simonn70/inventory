import { Request, Response } from 'express';

import { connectToDatabase } from '../database';
import Service from '../database/models/models.services';

export const createService = async (req: Request, res: Response) => {
    const { name, description } = req.body;
    try {
        await connectToDatabase();
        const newService = new Service({ name, description });
        await newService.save();

        return res.status(201).send(newService);
    } catch (error) {
        return res.status(500).send({ msg: 'Error creating service', error });
    }
};


export const getAllServices = async (req: Request, res: Response) => {
    try {
        await connectToDatabase();
        const services = await Service.find();

        return res.status(200).send(services);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching services', error });
    }
};


export const getServiceById = async (req: Request, res: Response) => {
    const { serviceId } = req.params;

    try {
        await connectToDatabase();
        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).send({ msg: 'Service not found' });
        }

        return res.status(200).send(service);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching service', error });
    }
};


export const updateService = async (req: Request, res: Response) => {
    const { serviceId } = req.params;
    const { name, description } = req.body;

    try {
        await connectToDatabase();
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { name, description, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).send({ msg: 'Service not found' });
        }

        return res.status(200).send(updatedService);
    } catch (error) {
        return res.status(500).send({ msg: 'Error updating service', error });
    }
};



export const deleteService = async (req: Request, res: Response) => {
    const { serviceId } = req.params;

    try {
        await connectToDatabase();
        const deletedService = await Service.findByIdAndDelete(serviceId);

        if (!deletedService) {
            return res.status(404).send({ msg: 'Service not found' });
        }

        return res.status(200).send({ msg: 'Service deleted successfully' });
    } catch (error) {
        return res.status(500).send({ msg: 'Error deleting service', error });
    }
};


