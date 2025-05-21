const http = require("http");
const WebSocket = require("ws");

let wss = null;

function createWebSocketServer(host = "0.0.0.0", port = 8081, path = "/ws", onMessageCallback) {
    const server = http.createServer();
    wss = new WebSocket.Server({ server, path });

    wss.on("connection", (ws) => {
        console.log("🔗 WebSocket client connected");

        ws.on("message", (msg) => {
            console.log("💬 WS client:", msg.toString());
            try {
                const parsedMsg = JSON.parse(msg.toString());
                if (onMessageCallback) {
                    onMessageCallback(parsedMsg);  // 👈 Gọi callback truyền từ ngoài
                }
            } catch (err) {
                console.error("❌ Error parsing WebSocket message:", err);
            }
        });

        ws.on("close", () => {
            console.log("❌ WebSocket client disconnected");
        });
    });

    server.listen(port, host, () => {
        console.log(`🔌 WebSocket server running at ws://${host}:${port}${path}`);
    });
}


function broadcast(message) {
    if (!wss) return;
    const payload = typeof message === "string" ? message : JSON.stringify(message);

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}

module.exports = {
    createWebSocketServer,
    broadcast,
};
