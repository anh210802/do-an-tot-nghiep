// const aedes = require("aedes")();
// const net = require("net");
// const DeviceData = require("../models/dataModel"); // Import model MongoDB

// const MQTT_PORT = process.env.MQTT_PORT || 1883;
// const HOST = process.env.HOST || "0.0.0.0";

// const mqttServer = net.createServer(aedes.handle);

// mqttServer.listen(MQTT_PORT, HOST, () => {
//     console.log(`MQTT server started on ${HOST}:${MQTT_PORT}`);
// });

// aedes.on("client", (client) => {
//     console.log("Client Connected:", client.id);
// });

// aedes.on("clientDisconnect", (client) => {
//     console.log("Client Disconnected:", client.id);
// });

// aedes.on("subscribe", (subscriptions, client) => {
//     console.log("Client Subscribe:", subscriptions, "Client:", client.id);
// });

// aedes.on("unsubscribe", (subscriptions, client) => {
//     console.log("Client Unsubscribe:", subscriptions, "Client:", client.id);
// });

// aedes.on("publish", async (packet, client) => {
//     if (!client) return;

//     try {
//         const payload = JSON.parse(packet.payload.toString());
//         console.log(`Received from ${client.id}:`, payload);

//         // Lưu vào MongoDB
//         const data = new DeviceData({
//             device_id: payload.device_id,
//             time: new Date(payload.time),
//             longitude: payload.longitude,
//             latitude: payload.latitude,
//             states: payload.states,
//             powered: payload.powered,
//         });

//         await data.save();
//         // console.log("Saved to MongoDB:", data);
//     } catch (err) {