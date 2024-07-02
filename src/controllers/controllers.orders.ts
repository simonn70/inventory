import { Request, Response, response } from "express";
import { connectToDatabase } from "../database";
import Order from "../database/models/models.order";


export const createOrder = async (request: Request, response: Response) => {
    const { 
        vendorId, customerId, services,
        deliveryGuyId, invoice, status
    } = request.body

    try {
        await connectToDatabase()
        const newOrder = await Order.create({
            vendorId,
            customerId,
            services,
            deliveryGuy: deliveryGuyId,
            invoice,
            status
        })

        if (!newOrder) {
            return response.status(400).send({ msg: "could not create order"})
        }

        return response.status(200).send({ msg: "order created", order: newOrder })
    } catch (error) {
       return response.status(500).send({ msg: "error creating order, try again"})
    }
}


export const getOrder = async (request: Request, response: Response) => {
    const { id } = request.params
    try {
        await connectToDatabase()
        const order = await Order.findById(id)
        if (!order) {
            return response.status(404).send({ msg: "could not find order"})
        }
        return response.status(200).send({ order: order })
    } catch (error) {
        // return response.status(500).send({ msg: "error fetching order"})
        throw error
    }
}

export const getAllOrders = async (request: Request, response: Response) => {
    try {
        await connectToDatabase()
        const orders = await Order.find({})
        if (!orders) {
            return response.status(404).send({ msg: "could not find orders" })
        }
        return response.status(200).send({ orders: orders })
    } catch (error) {
        return response.status(500).send({ msg: "error fetching orders"})
    }
}

export const deleteOrder = async (request: Request, response: Response) => {
    const { id } = request.params

    try {
        await connectToDatabase()
        const deletedOrder = await Order.findByIdAndDelete(id)
        if (!deletedOrder) {
            return response.status(404).send({ msg: "no order to delete"})
        }
        return response.status(200).send({ msg: "order deleted successfully", deletedOrder: deletedOrder })
    } catch (error) {
        return response.status(500).send({ msg: "error deleting order"})   
    }
}

export const updateOrder = async (request: Request, response: Response) => {
    const data = request.body
    const { id } = request.params

    try {
        await connectToDatabase()
        const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true })
        if (!updatedOrder) {
            return response.status(404).send({ msg: "no order found to update"})
        }
        return response.status(200).send({ msg: "order updated", order: updatedOrder })
    } catch (error) {
        return response.status(500).send({ msg: "error updating order" })
    }
}