import serial

class LoRa:
    def __init__(self, port, baudrate):
        self.port = port
        self.baudrate = baudrate
        self.serial = None  # Tránh lỗi khi truy cập self.serial nếu chưa mở cổng

    def getPort(self):
        return self.port

    def getBaudrate(self):
        return self.baudrate

    def openPort(self):
        try:
            self.serial = serial.Serial(self.port, self.baudrate, timeout=1)
            print(f"Port {self.port} opened successfully")
            return True
        except Exception as e:
            print(f"Cannot open port: {e}")
            self.serial = None  # Đảm bảo self.serial không trỏ đến một đối tượng lỗi
            return False

    def closePort(self):
        try:
            if self.serial and self.serial.is_open:
                self.serial.close()
                print(f"Port {self.port} closed successfully")
                return True
            else:
                print("Port is not open")
                return False
        except Exception as e:
            print(f"Cannot close port: {e}")
            return False

    def write(self, data):
        try:
            if self.serial and self.serial.is_open:
                self.serial.write(data.encode())
                print("Data sent to device")
            else:
                print("Cannot send data: Serial port is not open")
        except Exception as e:
            print(f"Cannot send data: {e}")

    def read(self):
        try:
            if not self.serial or not self.serial.is_open:
                print("⚠️ Cannot read data: Serial port is not open")
                return None

            # Đọc dữ liệu từ Serial
            data = self.serial.readline().decode(errors="ignore").strip()
            
            if not data:
                return None  # Không có dữ liệu thì bỏ qua

            print(f"Received raw data: {data}")

            # Kiểm tra xem dữ liệu có đúng format không
            if data.startswith("!") and data.endswith("#"):
                payload = data[1:-1]  # Bỏ ký tự '!' và '#'

                # Nếu là thông báo lỗi GPS, cảnh báo nhưng không xử lý
                if payload == "Invalid GPS Data":
                    print("⚠️ GPS error: Invalid GPS Data received. Skipping...")
                    return None
                
                # Nếu là dữ liệu hợp lệ, trả về
                return payload  

            print("❌ Invalid data format. Skipping...")
            return None
        except Exception as e:
            print(f"❌ Error reading data: {e}")
            return None

