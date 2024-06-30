import { Request, Response } from "express"
import { generateVerificationCode, passwordsMatch } from "../utils/validation.utils"
import { registerUser } from "../services/services.auth"


export const register = async (request: Request, response: Response) => {
    let { role, name, email, phoneNumber, password, repeatPassword } = request.body


    if (!passwordsMatch(password, repeatPassword)) {
        return response.status(400).send({
            successful: false,
            msg: "Passwords don't match"
        })
    }

    const verificationCode = generateVerificationCode(6)

    try {
        // hash password here
        // add jwt
        let newUser = await registerUser({
            role,
            name,
            email,
            phoneNumber,
            password,
            verificationCode,
        })

        if(!newUser) {
            return response.status(401).send({
                successful: false,
                msg: "Could not create user"
            })
        }

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
    try {
        
    } catch (error) {
        throw error
    }
}

export const logout = async (request: Request, response: Response) => {
    try {
        
    } catch (error) {
        throw error
    }
}