import React, { useState, useEffect } from 'react';

const wsUrl = import.meta.env.VITE_WSS_URL || "ws://localhost:8081/ws"; // Địa chỉ WebSocket server

const Notification = () => {
  const [message, setMessage] = useState(null);  // Lưu trữ thông báo từ WebSocket

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to WebSocket server.");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message: ", data);
      if (data.request === 'get_device_id') {
        setMessage('Phát hiện thiết bị mới vào lúc ' + new Date().toLocaleTimeString() + ' tại ' + data.gateway_id);
      }
      if (data.request === 'ping') {
        setMessage('Thiết bị Gateway đã kết nối vào lúc ' + new Date().toLocaleTimeString() + ' tại ' + data.gateway_id);
      }
      if (data.request === 'set_device_id') {
        setMessage('Thiết bị đã được xác nhận ID: ' + data.device_id + ' vào lúc ' + new Date().toLocaleTimeString() + ' tại ' + data.gateway_id);
      }
      if (data.request === 'find_device') {
        setMessage('Thiết bị đang bật còi ' + new Date().toLocaleTimeString() + ' tại ' + data.device_id + ' với trạng thái ' + data.find_state);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Tự động ẩn thông báo sau 5 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div>
      {message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-4 px-6 rounded-lg shadow-lg font-semibold z-50 animate-fade-in-down">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Notification;
