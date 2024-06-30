import { UserData } from "../types"
import Customer from "../database/models/models.customer"
import DeliveryGuy from "../database/models/models.deliveryGuy"
import Vendor from "../database/models/models.vendor"
import { connectToDatabase } from "../database"


export const registerUser = async (data: UserData) => {
    try {
        await connectToDatabase()
        switch(data.role) {
            case "Customer":
                return await Customer.create(data)
            case "DeliveryGuy":
                // create a customer;
                break;
            case "Vendor":
                // create a customer;
                break;
        }
    } catch (error) {
        throw error
    }
}