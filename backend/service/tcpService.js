const net = require('net');

// Lưu socket theo gateway_id
const gatewaySockets = {};

function startTcpServer(host, port, onData) {
    const server = net.createServer((socket) => {
        console.log('💻 New TCP connection established');
        
        socket.on('data', (data) => {
            try {
                const parsedData = JSON.parse(data.toString());
                console.log("📡 Received TCP data:", parsedData);

                // Nếu là yêu cầu gán ID từ thiết bị
                if (parsedData.request === "ping" && parsedData.gateway_id) {
                    const gatewayId = parsedData.gateway_id;
                    gatewaySockets[gatewayId] = socket; // Lưu socket theo gateway_id
                    console.log(`🗂️ Stored socket for gateway ${gatewayId}`);
                }

                onData(parsedData); // Gọi callback để xử lý tiếp
            } catch (e) {
                console.log("❌ Error parsing TCP data:", e);
            }
        });

        socket.on('end', () => {
            console.log('💻 TCP connection closed');
        });

        socket.on('error', (err) => {
            console.error('❌ Socket error:', err.message);
        });
    });

    server.listen(port, host, () => {
        console.log(`📡 TCP Server listening on ${host}:${port}`);
    });
}

// Gửi lại device ID về thiết bị (qua TCP)
function sendDeviceId(gatewayId, deviceId, CowId) {
    const socket = gatewaySockets[gatewayId];
    if (socket) {
        const response = JSON.stringify({ response: "device_id", device_id: deviceId, cow_id: CowId });
        socket.write(response);
        console.log(`✅ Sent device ID ${deviceId} to ${gatewayId}`);
    } else {
        console.warn(`⚠️ No socket found for gateway ${gatewayId}`);
    }
}

function findDeviceOn(gatewayId, deviceId, find_state) {
    const socket = gatewaySockets[gatewayId];
    if (socket) {
        const response = JSON.stringify({ response: "find_device", device_id: deviceId, find_state: find_state });
        socket.write(response);
        console.log(`✅ Sent find_device to gateway ${gatewayId}`);
    } else {
        console.warn(`⚠️ No socket found for gateway ${gatewayId}`);
    }
}

module.exports = { startTcpServer, sendDeviceId, findDeviceOn };
