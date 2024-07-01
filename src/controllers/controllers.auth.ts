import { Request, Response } from "express"
import { generateVerificationCode, passwordsMatch } from "../utils/validation.utils"
import { loginUser, registerUser } from "../services/services.auth"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer";
import updateUserByRole, { getUserByRole } from "../utils/services.utils";
import { connectToDatabase } from "../database";

export const register = async (request: Request, response: Response) => {
    let { role, name, email, phoneNumber, password, repeatPassword } = request.body


    if (!passwordsMatch(password, repeatPassword)) {
        return response.status(400).send({
            successful: false,
            msg: "Passwords don't match"
        })
    }

    const verificationCode = generateVerificationCode(6)
    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        let newUser = await registerUser({
            role,
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            verificationCode,
        })


        if(!newUser) {
            return response.status(401).send({
                successful: false,
                msg: "Could not create user"
            })
        }
        // TODO: send email to user with verification code
        // included

        return response.status(201).send({
            successuful: true,
            msg: "User Created!",
            user: newUser
        })

    } catch (error) {
        throw error
    }
}

export const verifyAccount = async (request: Request, response: Response) => {
    try {
        
    } catch (error) {
        throw error
    }
}

export const login = async (request: Request, response: Response) => {
    const { role, email, password } = request.body

    try {
        const user = await loginUser({
            role,
            email,
            password
        })

        const loggedInUser = JSON.parse(user)

        return response.status(200).send(loggedInUser)
    } catch (error) {
        return response.status(500).send({ msg: "Login failed "})
    }
}

export const logout = async (request: Request, response: Response) => {
    try {
        
    } catch (error) {
        throw error
    }
}





export const getProfile = async (req:any, res:Response) => {
   
    try {
        const user  = req.user;  // Assuming you have a middleware that sets req.user and req.role
        const  role = req.role;
        console.log(user,role);
        

      const profile = await getUserByRole(user?._id,role)
      if (!profile) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      res.status(200).json(profile);
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const updateProfile = async (req: any, res: Response) => {
    try {
      const { user } = req.user;  // Assuming you have a middleware that sets req.user and req.role
      const { role} = req.role;
      const updatedData = req.body;
  
      const updatedProfile = await updateUserByRole(user._id, role, updatedData);
  
      if (!updatedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  
  