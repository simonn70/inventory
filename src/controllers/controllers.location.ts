import { Request, Response } from 'express';
import { connectToDatabase } from '../database';
import Customer from '../database/models/models.customer';
import Vendor from '../database/models/models.vendor';


export const setUserCurrentLocation = async (request: Request, response: Response) => {
    const { longitude, latitude, userId } = request.body

    try {
        await connectToDatabase()
        const user = await Customer.findById(userId)

        if (!user) {
            return response.status(404).send({ msg: "user not found"})
        }

        user.location = {
            type: "Point",
            coordinates: [longitude, latitude]
        }

        await user.save()

        return response.status(200).send({ msg: "location updated" })
    } catch (error) {
        return response.status(500).send({ msg: "internal server error", error })
    }
}

export const setVendorLocation = async (request: Request, response: Response) => {
    const { longitude, latitude, vendorId } = request.body

    try {
        await connectToDatabase()
        const vendor = await Vendor.findById(vendorId)

        if (!vendor) {
            return response.status(404).send({ msg: "vendor not found"})
        }

        vendor.location = {
            type: "Point",
            coordinates: [longitude, latitude]
        }

        await vendor.save()

        return response.status(200).send({ msg: "location updated" })
    } catch (error) {
        return response.status(500).send({ msg: "internal server error", error })
    }
}
