const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");

dotenv.config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
//connect to database
connectDB();
//routes

// Routes
app.use("/api/auth", authRoutes);

//upload
app.use("/api/uploads", uploadRoutes);

//product
app.use("/api/products", productRoutes);

//category 
app.use("/api/categories",categoryRoutes);

//cart
app.use("/api/carts",cartRoutes);

//order
app.use("/api/orders",orderRoutes);

// user


//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})