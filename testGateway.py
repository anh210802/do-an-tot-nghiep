import paho.mqtt.client as mqtt
import json
import time
import random

BROKER = "192.168.0.104"  
PORT = 1883
GATEWAY_ID = "gateway_01"
TOPIC_SUB = f"gateway/{GATEWAY_ID}/control"
TOPIC_PUB = f"gateway/{GATEWAY_ID}/data"

# Kết nối MQTT
client = mqtt.Client(client_id=GATEWAY_ID)
client.connect(BROKER, PORT, 60)

# Hàm callback khi nhận dữ liệu từ server
def on_message(client, userdata, msg):
    print(f"📩 Nhận lệnh từ server: {msg.topic} - {msg.payload.decode()}")

client.on_message = on_message
client.subscribe(TOPIC_SUB)  # Lắng nghe lệnh điều khiển từ server

# Gửi dữ liệu lên server mỗi 5 giây
def send_data():
    data = {
        "device_id": "65ee123456789abcd1234567",
        "time": time.strftime("%Y-%m-%d %H:%M:%S"),
        "longitude": round(random.uniform(100.0, 110.0), 6),
        "latitude": round(random.uniform(10.0, 20.0), 6),
        "states": "active",
        "powered": random.randint(0, 100)
    }
    payload = json.dumps(data)
    client.publish(TOPIC_PUB, payload)
    print(f"📤 Sent: {payload}")

while True:
    send_data()
    time.sleep(5)
