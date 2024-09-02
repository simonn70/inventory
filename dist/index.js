"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose")); // Import mongoose for database connection
const routes_auth_1 = __importDefault(require("./routes/routes.auth"));
const route_services_1 = __importDefault(require("./routes/route.services"));
const route_vendor_1 = __importDefault(require("./routes/route.vendor"));
const route_admin_1 = __importDefault(require("./routes/admin/route.admin"));
const route_cart_1 = __importDefault(require("./routes/route.cart"));
const route_partner_1 = __importDefault(require("./routes/partner/route.partner"));
const route_product_1 = __importDefault(require("./routes/route.product"));
const route_location_1 = __importDefault(require("./routes/route.location"));
const route_orders_1 = __importDefault(require("./routes/route.orders"));
const PORT = 3002;
const MONGODB_URI = "mongodb+srv://simonadjei70:QzlvSvnAxDMGaozU@cluster0.cgdpa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
};
app.use((0, cors_1.default)());
app.use("api/auth", routes_auth_1.default);
app.use("api/services", route_services_1.default);
app.use("api/admin", route_admin_1.default);
app.use("api/vendor", route_vendor_1.default);
app.use("api/product", route_product_1.default);
app.use("api/location", route_location_1.default);
app.use("api/orders", route_orders_1.default);
app.use("api/cart", route_cart_1.default);
app.use("api/partner", route_partner_1.default);
// Function to connect to the database and start the server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Replace `process.env.MONGODB_URI` with your actual MongoDB connection string
        yield mongoose_1.default.connect(MONGODB_URI, {
            dbName: 'laundry'
        });
        console.log("Connected to the database");
        // Start the server after successful database connection
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1); // Exit the process with a failure code
    }
});
// Call the function to start the server
startServer();
