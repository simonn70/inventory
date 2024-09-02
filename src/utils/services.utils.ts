import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Customer from "../database/models/models.customer"

import { connectToDatabase } from "../database"
import User from "../database/models/models.customer"

const jwtSecret = process.env.JWT_SECRET

export const logIn = async (role: string, model: any, email: string, password: string) => {
    try {
        await connectToDatabase()
        let genericUser: any

        if (role == "Vendor") {
            genericUser = await model.findOne({ storeEmail: email })
        } else {
            genericUser = await model.findOne({ email })
        }
        

        if (!genericUser) {
            return JSON.stringify({ msg: "user  not found!"})
        }

        const passwordMatch = await bcrypt.compare(password, genericUser.password)

        if (!passwordMatch) {
            return JSON.stringify({ msg: "Auth failed" })
        }

        const token = jwt.sign({ userId: genericUser._id, email: genericUser.email,role:role }, jwtSecret, { expiresIn: "1h"})

        if (role == "Vendor") {
            return JSON.stringify({
                name: genericUser.storeName,
                email: genericUser.storeEmail,
                token: token
            })
        } else {
            return JSON.stringify({
                name: genericUser.name,
                email: genericUser.email,
                token: token
            })
        }

    } catch (error) {
        throw error
    }
}


 export const getUserByRole = async (id:String, role:String) => {
  let user:any;
  await connectToDatabase()
  switch (role) {
    case 'Customer':
      user = await User.findById(id).select('-password');
      break;
    case 'Vendor':
      user = await User.findById(id).select('-password');
    
    default:
      throw new Error('Invalid user role');
  }

  return user;
};


const updateUserByRole = async (id:String, role:String, updatedData:any) => {
  const options = { new: true, runValidators: true };  // Return the updated document and run validators
 await connectToDatabase()
  let updatedUser;
  switch (role) {
    case 'Customer':
      updatedUser = await Customer.findByIdAndUpdate(id, updatedData, options).select('-password');
      break;
    case 'Vendor':
      updatedUser = await User.findByIdAndUpdate(id, updatedData, options).select('-password');
   
    default:
      throw new Error('Invalid user role');
  }

  return updatedUser;
};

export const setUserLocation = async (model: any, longitude: string, latitude: string, userId: string) => {
  try {
    await connectToDatabase()
    const genericUser = await model.findById(userId)

    if (!genericUser) {
      return JSON.stringify({ msg: "could not find user"})
    }

    genericUser.location = {
      type: "Point",
      coordinates: [longitude, latitude]
    }

    await genericUser.save()
    return JSON.stringify({ msg: "location updated"})
  } catch (error) {
    throw error
  }
}

export default updateUserByRole