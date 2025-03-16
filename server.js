require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mqttServer = require("./service/mqtt"); 
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 2108;

// Kết nối MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME,
        });

        console.log("Connected to MongoDB successfully!");
    } catch (err) {
        console.error("Cannot connect to MongoDB:", err);
        process.exit(1);
    }
}

connectDB();

// Xử lý lỗi MongoDB
mongoose.connection.on("error", (err) => {
    console.error("MongoDB Connection Error:", err);
});

// Middleware
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"), {
    etag: false,
    lastModified: false,
    setHeaders: (res, path) => {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
}));


// Cấu hình Session
app.use(
    session({
        secret: process.env.SECRET || "default_secret_key",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI, 
            dbName: process.env.DB_NAME,
            collectionName: "sessions",
            ttl: 14 * 24 * 60 * 60, 
            autoRemove: "native", 
        }),
        cookie: {
            secure: process.env.NODE_ENV === "production", 
            httpOnly: true, 
            maxAge: 14 * 24 * 60 * 60 * 1000, 
        },
    })
);

// Kiểm tra session đăng nhập
app.get("/auth/session", (req, res) => {
    if (req.session && req.session.user) {
        return res.json({ user: req.session.user });
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
});

// Trang chủ
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

// Định tuyến API
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Khởi động HTTP Server
app.listen(PORT, HOST, () => {
    console.log(`HTTP Server is running at http://${HOST}:${PORT}`);
});
