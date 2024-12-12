import Warehouse from "../database/models/models.warehouse";

// Create a new warehouse
export const createWarehouse = async (req, res) => {
  try {
    const { name, location, capacity, managerId } = req.body;

    const newWarehouse = new Warehouse({
      name,
      location,
      capacity,
      managerId,
    });

    const savedWarehouse = await newWarehouse.save();
    res.status(201).json({ message: "Warehouse created successfully", warehouse: savedWarehouse });
  } catch (error) {
    res.status(500).json({ message: "Error creating warehouse", error: error.message });
  }
};

// Get all warehouses
export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().populate("managerId");
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching warehouses", error: error.message });
  }
};

// Get a single warehouse by ID
export const getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await Warehouse.findById(id).populate("managerId");

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: "Error fetching warehouse", error: error.message });
  }
};

// Update a warehouse
export const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedWarehouse = await Warehouse.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedWarehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.status(200).json({ message: "Warehouse updated successfully", warehouse: updatedWarehouse });
  } catch (error) {
    res.status(500).json({ message: "Error updating warehouse", error: error.message });
  }
};

// Delete a warehouse
export const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWarehouse = await Warehouse.findByIdAndDelete(id);

    if (!deletedWarehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    res.status(200).json({ message: "Warehouse deleted successfully", warehouse: deletedWarehouse });
  } catch (error) {
    res.status(500).json({ message: "Error deleting warehouse", error: error.message });
  }
};
