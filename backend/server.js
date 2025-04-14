require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");
const mqttService = require("./service/mqttService");
const authRoutes = require("./routes/authRoutes");
const handleCowRoutes = require("./routes/handleCowRoutes");
const cookieParser = require('cookie-parser');

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 2108;
const MONGO_URI = process.env.MONGODB_URI;
const SECRET_KEY = process.env.SECRET || "default_secret_key";
const NODE_ENV = process.env.NODE_ENV || "development";

// Kết nối MongoDB
async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI, { dbName: process.env.DB_NAME });
        console.log("✅ Connected to MongoDB successfully!");
    } catch (err) {
        console.error("❌ Cannot connect to MongoDB:", err);
        process.exit(1);
    }
}
connectDB();

// Xử lý lỗi MongoDB
mongoose.connection.on("error", (err) => console.error("❌ MongoDB Error:", err));
mongoose.connection.on("disconnected", () => console.warn("⚠️ MongoDB Disconnected!"));

// Middleware
const app = express();

// Cấu hình CORS (cho phép gửi cookies)
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // URL frontend
    credentials: true, // Cho phép gửi cookie
}));

app.use(morgan("dev"));
app.use(express.json());

// Cấu hình Session
app.set("trust proxy", 1); // Nếu chạy trên production với proxy
app.use(cookieParser(
));

// Định tuyến API
app.use("/auth", authRoutes);
app.use("/handle-cow", handleCowRoutes);

// Khởi động HTTP Server
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
});
