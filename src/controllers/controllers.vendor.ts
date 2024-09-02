
import { Request, Response } from "express";

import Product from "../database/models/models.product";
import { connectToDatabase } from "../database";
import User from "../database/models/models.customer";

 




export const setupVendor = async (req: Request, res: Response) => {
    const { storeName, category, storePhoto, storeAddress, openingTime, closingTime } = req.body;
    const vendorId = req.params.id;
    await connectToDatabase()

    try {    
            let  vendor = await User.findByIdAndUpdate(
                vendorId,
                {
                    storeName,
                    category,
                    storePhoto,
                    storeAddress,
                    openingTime,
                    closingTime  
                },
                { new: true, runValidators: true }
            );

            if (!vendor) {
                return res.status(404).json({ message: 'Vendor not found' });
            }
       
        res.status(201).json(vendor);
    } catch (error) {
        console.error('Error setting up vendor:', error);
        res.status(400).json({ message: error.message });
    }
};



export const getAllVendors = async (req: Request, res: Response) => {
    await connectToDatabase()
    try {
        const vendors = await User.find();
        res.status(200)
    } catch (error) {
        console.error('Error fetcUsers:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getVendorById = async (req: Request, res: Response) => {
    const { vendorId } = req.params;
    console.log(vendorId);
    
    await connectToDatabase()
    try {
        const vendor = await User.findById(vendorId);
        console.log(vendor);
        
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json(vendor);
    } catch (error) {
        console.error('Error fetching vendor:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const deleteVendorById = async (req: Request, res: Response) => {
    const { id } = req.params;
    await connectToDatabase()
    try {
        const vendor = await User.findByIdAndDelete(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        await Product.deleteMany({ storeId: vendor._id });
        res.status(200).json({ message: 'Vendor and associated products deleted successfully' });
    } catch (error) {
        console.error('Error deleting vendor:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const searchVendors = async (req: Request, res: Response) => {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    if (!longitude || !latitude) {
        return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    try {
        await connectToDatabase()

        const parsedLongitude = parseFloat(longitude as string);
        const parsedLatitude = parseFloat(latitude as string);
        const parsedMaxDistance = parseInt(maxDistance as string);

        if (isNaN(parsedLongitude) || isNaN(parsedLatitude) || isNaN(parsedMaxDistance)) {
            return res.status(400).json({ message: 'Invalid query parameters' });
        }

        const vendors = await User.find({
            location: {
                $near: {
                    $maxDistance: parsedMaxDistance,
                    $geometry: {
                        type: "Point",
                        coordinates: [parsedLongitude, parsedLatitude]
                    },
                }
            }
        });

        if (vendors.length === 0) {
            return res.status(404).json({ message: 'no stores found nearby' });
        }

        res.status(200).send(vendors);
    } catch (error) {
        console.error('Error searching for nearby stores:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
