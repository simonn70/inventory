import { Request, Response } from 'express';
import { connectToDatabase } from '../database';
import Customer from '../database/models/models.customer';
import Vendor from '../database/models/models.vendor';
import { setUserLocation } from '../utils/services.utils';
import DeliveryGuy from '../database/models/models.deliveryGuy';


export const setLocation = async (request: Request, response: Response) => {
    const { longitude, latitude, userId, role } = request.body

    try {
        await connectToDatabase()

        let user: any 

        switch(role) {
            case "Customer":
             user = await setUserLocation(Customer, longitude, latitude, userId)
             break
            case "Vendor":
             user = await setUserLocation(Vendor, longitude, latitude, userId)
             break
            case "DeliveryGuy":
             user = await setUserLocation(DeliveryGuy, longitude, latitude, userId)
             break;
            default:
             throw new Error("Invalid user role")
        }
        return response.status(200).send({ msg: "location updated" }) 
    } catch (error) {
        return response.status(500).send({ msg: "internal server error", error })
    }
}