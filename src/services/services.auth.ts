import { Request, Response } from "express";
import bcrypt from "bcrypt";
// Adjust the path as needed
import jwt from "jsonwebtoken"; // Assuming you're using JWT for authentication
import { UserData, loginUserParams } from "../types"
import Customer from "../database/models/models.customer"
import { connectToDatabase } from "../database"
import { logIn } from "../utils/services.utils"
import User from "../database/models/models.customer"


export const registerUser = async ({
    name, email, phoneNumber, password, verificationCode, role
}: UserData) => {
    try {
        await connectToDatabase()
        switch(role) {
            case "customer":
                return await Customer.create({
                    name,
                    email,
                    phoneNumber,
                    password,
                    verificationCode
                })
            case "admin":
                return await User.create({
                    name,
                    email,
                    phoneNumber,
                    password,
                    verificationCode
                })
            case "partner":
                return await User.create({
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


export const login = async (request: Request, response: Response) => {
    const { role, email, password } = request.body;

    try {
        // Ensure the database is connected
        await connectToDatabase();

        // Find the user by email and role
        const user = await User.findOne({ email, role });

        if (!user) {
            return response.status(401).send({ msg: "Invalid email or password" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return response.status(401).send({ msg: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return response.status(403).send({ msg: "Account not verified" });
        }

        // Generate a token (assuming you're using JWT)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'defaultsecret',
            { expiresIn: '1h' } // Set token expiration as needed
        );

        // Send back the token and user data
        return response.status(200).send({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                // Include any other user fields you want to return
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        return response.status(500).send({ msg: "Login failed" });
    }
};


//get profile details  for user roles
// check role of each user and based on that fetch their profile details