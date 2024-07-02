
import { Request, Response } from 'express';
import Product from '../database/models/models.product';
import Vendor from '../database/models/models.vendor';
import { connectToDatabase } from '../database';





export const createProduct = async (req: Request, res: Response) => {
    const { storeId, productName, price, description } = req.body;
 await connectToDatabase()
    try {
        const vendor = await Vendor.findById(storeId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        const product = new Product({
            productName,
            price,
            description,
            storeId
        });

        await product.save();

        await Vendor.findByIdAndUpdate(storeId, {
            $push: { products: product._id }
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).json({ message: error.message });
    }
};



export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const updateProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const product = await Product.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const deleteProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await Vendor.findByIdAndUpdate(product.storeId, { $pull: { products: product._id } });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getProductByStoreId = async (req: Request, res: Response) => {
    const { storeId } = req.params;

    try {
        const products = await Product.find({ storeId });
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this store' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by store ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

