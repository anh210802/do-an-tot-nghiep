import paho.mqtt.client as mqtt
import json

class MQTT:
    def __init__(self, broker, port):
        self.broker = broker
        self.port = port
        self.client = None

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
        else:
            print(f"Failed to connect, return code {rc}")

    def on_message(self, client, userdata, message):
        print(f"Received message: {message.payload.decode()} from topic: {message.topic}")

    def subscribe(self, topic):
        if self.client:
            self.client.subscribe(topic)
            print(f"Subscribed to {topic}")
        else:
            print("Client is not connected.")

    def on_publish(self, client, userdata, mid):
        print(f"Message {mid} published successfully.")

    def on_disconnect(self, client, userdata, rc):
        print("Disconnected from MQTT Broker.")
        if rc != 0:
            print("Attempting to reconnect...")
            try:
                client.reconnect()
            except Exception as e:
                print(f"Reconnect failed: {e}")

    def connect(self, client_id):
        self.client = mqtt.Client(client_id=client_id)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_publish = self.on_publish
        self.client.on_disconnect = self.on_disconnect

        try:
            self.client.connect(self.broker, self.port, 60)
            self.client.loop_start()
        except Exception as e:
            print(f"Connection failed: {e}")

    def send_data(self, topic, data):
        if self.client:
            payload = data
            result = self.client.publish(topic, payload)

            if result.rc != mqtt.MQTT_ERR_SUCCESS:
                print("Failed to publish message!")
            else:
                print(f"Message sent to {topic}: {payload}")
        else:
            print("Client is not connected.")

    def disconnect(self):
        if self.client:
            self.client.loop_stop()
            self.client.disconnect()
            print("MQTT client stopped.")
