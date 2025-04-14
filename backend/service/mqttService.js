const aedes = require("aedes")();
const net = require("net");
const mqtt = require("mqtt");


const mqttServer = net.createServer(aedes.handle);
const PORT = process.env.MQTT_PORT || 1883; 

aedes.on("publish", async function (packet, client) {
    if (!client) return;

    try {
        const topic = packet.topic;
        const message = packet.payload.toString();
        console.log(`📨 Message received on topic [${topic}]: ${message}`);

        if (topic === "gateway/device-status/response") {
            const data = JSON.parse(message);
            const { serialNumber, connected } = data;
            console.log(`Device ${serialNumber} is ${connected ? "connected" : "disconnected"}`);
        }
    } catch (err) {
        console.error("Lỗi xử lý message MQTT:", err);
    }
});

module.exports = mqttServer;
