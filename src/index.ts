import express from "express"
import cors from "cors"
import "dotenv/config"
import authRoutes from "./routes/routes.auth"
import vendorRoutes from './routes/route.vendor'
import productRoutes from './routes/route.product'
import locationRoutes from "./routes/route.location"
import ordersRoutes from "./routes/route.orders"

const PORT = 3002

const app = express()

app.use(express.json())
const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use("/auth", authRoutes)
app.use("/vendor", vendorRoutes)
app.use("/product", productRoutes)
app.use("/location", locationRoutes)
app.use("/orders", ordersRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})