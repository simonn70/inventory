import { UserData, loginUserParams } from "../types"
import Customer from "../database/models/models.customer"
import DeliveryGuy from "../database/models/models.deliveryGuy"
import Vendor from "../database/models/models.vendor"
import { connectToDatabase } from "../database"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const jwtSecret = process.env.JWT_SECRET

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
                const customer = await Customer.findOne({ email })

                if (!customer) {
                    return JSON.stringify({ msg: "customer not found!"})
                }

                const passwordMatch = await bcrypt.compare(password, customer.password)

                if (!passwordMatch) {
                    return JSON.stringify({ msg: "Auth failed" })
                }

                const token = jwt.sign({ userId: customer._id, email: customer.email }, jwtSecret, { expiresIn: "1h"})

                return JSON.stringify({
                    name: customer.name,
                    email: customer.email,
                    token: token
                })
        }
    } catch (error) {
        throw error
    }
}