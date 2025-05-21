require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const MongoStore = require("connect-mongo");
const tcpService = require("./service/tcpService");
const authRoutes = require("./routes/authRoutes");
const handleCowRoutes = require("./routes/handleCowRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const handleGatewayRoutes = require("./routes/gatewayRoutes");
const cookieParser = require('cookie-parser');
const wssService = require('./service/wssService');

const User = require("./models/userModel");
const Cow = require("./models/cowModel");
const Device = require("./models/deviceModel");

const HOST = process.env.HOST || "0.0.0.0";
const HTTP_PORT = process.env.HTTP_PORT || 8080;
const TCP_PORT = process.env.TCP_PORT || 8000;
const WSS_PORT = process.env.WSS_PORT || 8081;
const WSS_PATH = process.env.WSS_PATH || "/ws";

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
app.use("/handle-device", deviceRoutes);
app.use("/handle-gateway", handleGatewayRoutes);

// Mở cổng kết nối WebSocket
wssService.createWebSocketServer(HOST, WSS_PORT, WSS_PATH, async (msg) => {
    console.log(`🔌 WebSocket server running at ws://${HOST}:${WSS_PORT}${WSS_PATH}`);
    
    if (msg.request === "find_device") {
      console.log("📡 Nhận yêu cầu tìm thiết bị từ WebSocket client:", msg.device_id);
  
      try {
        const device = await Device.findOne({ deviceID: msg.device_id });
        if (!device) {
            console.log("❌ Không tìm thấy thiết bị với ID:", msg.device_id);
            return;
        }
        const cow = await Cow.findById(device.cowId);
        if (!cow) {
            console.log("❌ Không tìm thấy động vật với ID:", device.cowId);
            return;
        }
        const user = await User.findById(cow.userId);
        if (!user) {
            console.log("❌ Không tìm thấy người dùng với ID:", cow.userId);
            return;
        }
        const gateways = user.gateways;
        if (!gateways || gateways.length === 0) {
            console.log("❌ Người dùng không có gateway nào");
            return;
        }
        const gatewayId = gateways[0]; // Lấy gateway đầu tiên
        const find_state = msg.find_state || "find_device"; // Trạng thái tìm kiếm thiết bị

        tcpService.findDeviceOn(gatewayId, msg.device_id, find_state); // Gửi yêu cầu tìm thiết bị qua TCP

        console.log(`📡 Gửi yêu cầu tìm thiết bị ${msg.device_id} tới gateway ${gatewayId}`);
        } catch (err) {
            console.error("❌ Lỗi tìm thiết bị:", err);
        }
    }
  });

// Khởi động TCP Server
tcpService.startTcpServer(HOST, TCP_PORT, async (data) => {
    if (data.request === "ping") {
        console.log("📡 Nhận yêu cầu ping từ thiết bị:", data.gateway_id);
        wssService.broadcast(data); // Gửi lại cho tất cả WebSocket client
    }
    if (data.request === "get_device_id") {
        console.log("📡 Thiết bị mới gửi yêu cầu gán ID");
        // Gửi dữ liệu cho tất cả các WebSocket client
        wssService.broadcast(data);
    }
    if (data.request === "set_device_id") {
        console.log("📡 Thiết bị được xác nhận ID: ", data.device_id);
        // Gửi dữ liệu cho tất cả các WebSocket client
        cowId = data.cow_id;
        deviceId = data.device_id;
        const cow = await Cow.findOne({ idCow: cowId });
        if (!cow) {
            console.log("❌ Không tìm thấy động vật với ID:", cowId);
            return;
        }
        cow.deviceId = deviceId;
        cow.haveDevice = true;
        await cow.save();

        const device = new Device({
            cowId: cow._id,
            deviceID: deviceId,
            status: "connect",
            battery: 96,
        });
        await device.save();
        
        wssService.broadcast(data);
    }
    if (data.request === "gps_data") {
        console.log("📡 Nhận dữ liệu GPS từ thiết bị:", data.device_id);
        // Gửi dữ liệu cho tất cả các WebSocket client
        wssService.broadcast(data);
    }
    if (data.request === "info_data") {
        console.log("📡 Nhận dữ liệu hoạt động từ thiết bị:", data.device_id);
        // Gửi dữ liệu cho tất cả các WebSocket client
        wssService.broadcast(data);
    }
    if (data.request === "find_device") {
        console.log("📡 Nhận yêu cầu tìm thiết bị từ thiết bị:", data.device_id);
        // Gửi dữ liệu cho tất cả các WebSocket client
        wssService.broadcast(data);
    }
});


// Khởi động HTTP Server
app.listen(HTTP_PORT, HOST, () => {
    console.log(`🚀 Server is running at http://${HOST}:${HTTP_PORT}`);
});
