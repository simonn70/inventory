import { Request, Response } from 'express';

import { connectToDatabase } from '../database';
import Product from '../database/models/models.product';

// Create a new product



import Warehouse from "../database/models/models.warehouse";

export const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      itemCode, 
      itemDescription, 
      project, 
      category, 
      itemType, 
      warehouse, 
      quantity, 
      reorderLevel, 
      isReturnable 
    } = req.body;

    // Validate category
    const validCategories = ["high_voltage", "low_voltage"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Must be one of: ${validCategories.join(", ")}` });
    }

    // Validate itemType
    const validItemTypes = ["cables", "Switchgear", "plugs", "cones", "SF6-GS", "accessory", "control", "supply", "protection"];
    if (!validItemTypes.includes(itemType)) {
      return res.status(400).json({ message: `Invalid item type. Must be one of: ${validItemTypes.join(", ")}` });
    }

    // Validate warehouse
    const validWarehouses = ["TEMA", "WAREHOUSE_A", "Clothing", "Food", "Stationery"];
    if (!validWarehouses.includes(warehouse)) {
      return res.status(400).json({ message: `Invalid warehouse. Must be one of: ${validWarehouses.join(", ")}` });
    }

    // Create new product
    const newProduct = new Product({
      name,
      itemCode,
      itemDescription,
      project,
      category,
      itemType,
      warehouse,
      quantity,
      reorderLevel,
      isReturnable,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};


// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.status(200).json({ message: "products fetched successfully", products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get a single product by ID


// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
       // Ensure validation rules are applied
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const {productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// Get product status by ID

// user get details

//get warehouse dashboard details , total revenue based on number in stock times unit price , number of products in stock , pending orders
