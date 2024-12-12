import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose"; // Import mongoose for database connection
import authRoutes from "./routes/routes.auth";

import admin from "./routes/admin/route.admin";

import partner from "./routes/partner/route.partner";
import productRoutes from './routes/route.product';
import orderRoutes from './routes/routes.order';

const PORT =5000;
const MONGODB_URI = "mongodb+srv://simonadjei70:QzlvSvnAxDMGaozU@cluster0.cgdpa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const app = express();

app.use(express.json());

const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors());

app.use("/api/auth", authRoutes);

app.use("/api/admin", admin);

app.use("/api/product", productRoutes);

app.use("/api/partner", partner);
app.use("/api/order", orderRoutes);
// Function to connect to the database and start the server
const startServer = async () => {
    try {
        // Replace `process.env.MONGODB_URI` with your actual MongoDB connection string
        await mongoose.connect(MONGODB_URI, {
           dbName:'laundry'
        });
        console.log("Connected to the database");

        // Start the server after successful database connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1); // Exit the process with a failure code
    }
};

// Call the function to start the server
startServer();
