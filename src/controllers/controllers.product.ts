import { Request, Response } from 'express';

import { connectToDatabase } from '../database';
import Product from '../database/models/models.product';

// Create a new product
export const createProduct = async (req: any, res: Response) => {
    const { name, description, service, productType, price, imageUrl } =await req.body;
     // Assuming this is set by middleware

    try {
        await connectToDatabase();

        const newProduct = new Product({
            name,
            description,
            service,
            productType,
            price,
            imageUrl,
          
        });

        const savedProduct = await newProduct.save();

        return res.status(201).send({ msg: 'Product created successfully', product: savedProduct });
    } catch (error) {
        return res.status(500).send({ msg: 'Error creating product', error });
    }
};

// Fetch all products
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        await connectToDatabase();

        const products = await Product.find().populate('service');

        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching products', error });
    }
};

// Fetch products by service
export const getProductsByService = async (req: Request, res: Response) => {
    const { serviceId } = req.params;

    try {
        await connectToDatabase();

        const products = await Product.find({ service: serviceId }).populate('service')

        return res.status(200).send(products);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching products by service', error });
    }
};

// Fetch product by ID
export const getProductById = async (req: Request, res: Response) => {
    const { productId } = req.params;

    try {
        await connectToDatabase();

        const product = await Product.findById(productId).populate('service')

        if (!product) {
            return res.status(404).send({ msg: 'Product not found' });
        }

        return res.status(200).send(product);
    } catch (error) {
        return res.status(500).send({ msg: 'Error fetching product by ID', error });
    }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const updates = req.body;

    try {
        await connectToDatabase();

        const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true }).populate('service').populate('createdBy');

        if (!updatedProduct) {
            return res.status(404).send({ msg: 'Product not found' });
        }

        return res.status(200).send({ msg: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        return res.status(500).send({ msg: 'Error updating product', error });
    }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;

    try {
        await connectToDatabase();

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).send({ msg: 'Product not found' });
        }

        return res.status(200).send({ msg: 'Product deleted successfully' });
    } catch (error) {
        return res.status(500).send({ msg: 'Error deleting product', error });
    }
};
