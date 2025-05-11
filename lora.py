import serial
import time

class LoRa:
    def __init__(self, port, baudrate):
        self.port = port
        self.baudrate = baudrate
        self.serial = None

    def getPort(self):
        return self.port

    def getBaudrate(self):
        return self.baudrate

    def openPort(self):
        try:
            self.serial = serial.Serial(self.port, self.baudrate, timeout=1)
            print(f"✅ Port {self.port} opened successfully")
            return True
        except Exception as e:
            print(f"❌ Cannot open port: {e}")
            self.serial = None
            return False

    def isOpen(self):
        return self.serial is not None and self.serial.is_open

    def openPortLoop(self):
        while not self.isOpen():
            try:
                self.serial = serial.Serial(self.port, self.baudrate, timeout=1)
                print(f"✅ Port {self.port} opened successfully")
                return True
            except Exception as e:
                print(f"❌ Cannot open port: {e}")
                time.sleep(1)

    def closePort(self):
        try:
            if self.isOpen():
                self.serial.close()
                print(f"🔌 Port {self.port} closed successfully")
                return True
            else:
                print("⚠️ Port is not open")
                return False
        except Exception as e:
            print(f"❌ Cannot close port: {e}")
            return False

    def write(self, data):
        try:
            if self.isOpen():
                self.serial.write(data.encode())
                print("📤 Data sent to device")
            else:
                print("⚠️ Cannot send data: Serial port is not open")
        except Exception as e:
            print(f"❌ Cannot send data: {e}")

    def read(self):
        try:
            if not self.isOpen():
                print("⚠️ Cannot read data: Serial port is not open")
                return None

            raw = self.serial.readline()
            data = raw.decode(errors="ignore").strip()

            if not data:
                return None

            print(f"📡 Raw bytes: {raw}")
            print(f"📡 Decoded data: {data}")

            if data.startswith("!") and data.endswith("#"):
                payload = data[1:-1]

                if payload == "Invalid GPS Data":
                    print("⚠️ GPS error: Invalid GPS Data received. Skipping...")
                    return None

                if ":" in payload:
                    data_type, content = payload.split(":", 1)
                    return {"type": data_type.lower(), "data": content}
                else:
                    return {"type": "raw", "data": payload}

            print("❌ Invalid data format. Skipping...")
            return None

        except Exception as e:
            print(f"❌ Error reading data: {e}")
            return None
