import { UserData, loginUserParams } from "../types"
import Customer from "../database/models/models.customer"
import DeliveryGuy from "../database/models/models.deliveryGuy"
import Vendor from "../database/models/models.vendor"
import { connectToDatabase } from "../database"
import { logIn } from "../utils/services.utils"


export const registerUser = async ({
    name, email, phoneNumber, password, verificationCode, role
}: UserData) => {
    try {
        await connectToDatabase()
        switch(role) {
            case "Customer":
                return await Customer.create({
                    name,
                    email,
                    phoneNumber,
                    password,
                    verificationCode
                })
            case "DeliveryGuy":
                return await DeliveryGuy.create({
                    name,
                    email,
                    phoneNumber,
                    password,
                    verificationCode
                })
            case "Vendor":
                return await Vendor.create({
                    storeName: name,
                    storeEmail: email,
                    phoneNumber,
                    password,
                    verificationCode
                })
        }
    } catch (error) {
        throw error
    }
}

export const loginUser = async ({ role, email, password }: loginUserParams) => {
    try {
        await connectToDatabase()
        switch(role) {
            case "Customer":
                const customer = await logIn(role, Customer, email, password)
                return customer

            case "DeliveryGuy":
                const delivery_guy = await logIn(role, DeliveryGuy, email, password)
                return delivery_guy

            case "Vendor":
                const vendor = await logIn(role, Vendor, email, password)
                return vendor
        }
    } catch (error) {
        throw error
    }
}

//get profile details  for user roles
// check role of each user and based on that fetch their profile details