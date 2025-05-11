import socket
import time
import threading
import os
import serial
from dotenv import load_dotenv
import json
import string
import bson
import pandas as pd
import numpy as np
STATES = {"Lying", "Standing", "Feeding"}
import models as models

load_dotenv()

HOST = os.getenv("HOST")
PORT = int(os.getenv("PORT"))
COM_PORT = os.getenv("COM_PORT")
BAUD_RATE = int(os.getenv("BAUD_RATE", "9600"))
GATEWAY_ID = os.getenv("GATEWAY_ID", "gateway_123")


def sanitize_serial(data):
    return ''.join(c for c in data if c in string.printable and c not in '\x00').strip()

class Client:
    def __init__(self, host, port, com_port, baud_rate):
        self.host = host
        self.port = port
        self.com_port = com_port
        self.baud_rate = baud_rate
        self.socket = None
        self.serial = None
        self.running = True
        self.device_threads = {}  
        self.device_id_memory = None
        self.cow_id_memory = None
        self.last_gps = None
        self.data_buffer = [] 
        self.last_action = ""

    def connect_device(self):
        while True:
            try:
                print(f"[DEVICE] Connecting to {self.com_port}...")
                self.serial = serial.Serial(self.com_port, self.baud_rate, timeout=1)
                print(f"[DEVICE] Connected on {self.com_port}")
                break
            except serial.SerialException as e:
                print(f"[DEVICE] Connection failed: {e}. Retry in 5s...")
                time.sleep(5)

    def connect_server(self):
        while True:
            try:
                print(f"[SERVER] Connecting to {self.host}:{self.port}...")
                self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                self.socket.connect((self.host, self.port))
                print(f"[SERVER] Connected to {self.host}:{self.port}")
                payload = json.dumps({
                    "request": "ping",
                    "gateway_id": GATEWAY_ID,
                })
                self.socket.sendall(payload.encode())
                print("[SYSTEM] Ping sent to server.")
                break
            except socket.error as e:
                print(f"[SERVER] Connection failed: {e}. Retry in 5s...")
                time.sleep(5)

    def serial_read(self):
        try:
            line = self.serial.readline().decode(errors='ignore').strip()
            if line:  # chỉ khi line không phải chuỗi rỗng sau strip()
                return line
            return None
        except Exception as e:
            print(f"[ERROR] Serial read error: {e}")
            return None

    def calculate_metrics(self):
        """ Tính toán VeDBA và SCAY từ dữ liệu gia tốc """
        if len(self.data_buffer) < 10:
            return "Unknown", "Unknown"

        df = pd.DataFrame(self.data_buffer)

        # Tính vector gia tốc tổng hợp
        df["acc_magnitude"] = np.sqrt(df["AccX"]**2 + df["AccY"]**2 + df["AccZ"]**2)
        df["acc_magnitude"] = df["acc_magnitude"].replace(0, 1e-8)  # Tránh lỗi chia cho 0

        # Tính SCAY
        df["SCAY"] = 9.81 * (df["AccY"] / df["acc_magnitude"])

        # Tính VeDBA bằng rolling mean
        df["AccX_static"] = df["AccX"].rolling(window=10, min_periods=1).mean()
        df["AccY_static"] = df["AccY"].rolling(window=10, min_periods=1).mean()
        df["AccZ_static"] = df["AccZ"].rolling(window=10, min_periods=1).mean()
        df["VeDBA"] = abs(df["AccX"] - df["AccX_static"]) + abs(df["AccY"] - df["AccY_static"]) + abs(df["AccZ"] - df["AccZ_static"])

        return df["VeDBA"].iloc[-1], df["SCAY"].iloc[-1]

    def handle_device(self, data):
        if data.startswith("!") and data.endswith("#"):
            data = data[1:-1]
            if data == "Invalid GPS Data":
                print(f"[DEVICE] Invalid GPS data received: {data}")
                return 
            if ":" in data:
                data = data.split(":")
                if data[0] != "ID":
                    print(f"[DEVICE] Invalid data format: {data}")
                    return
                device_id = data[1]
                if data[2] == "GPS":
                    longitude = data[3]
                    latitude = data[4]
                    current_gps = (longitude, latitude)
                    if current_gps != self.last_gps:
                        print(f"[DEVICE] GPS data received: {data}")
                        self.last_gps = current_gps
                        gps_payload_json = {
                            "request": "gps_data",
                            "gateway_id": GATEWAY_ID,
                            "device_id": device_id,
                            "longitude": longitude,
                            "latitude": latitude
                        }
                        try:
                            self.socket.sendall(json.dumps(gps_payload_json).encode())
                            print(f"[SYSTEM] Sent GPS data to server: {gps_payload_json}")
                        except socket.error as e:
                            print(f"[ERROR] Send failed: {e}")
                            self.connect_server()
                elif data[2] == "Accx" and data[4] == "Accy" and data[6] == "Accz":
                    try:
                        AccX = float(data[3])
                        AccY = float(data[5])
                        AccZ = float(data[7])
                    except ValueError:
                        print(f"[DEVICE] Invalid acceleration data: {data}")
                        return
                    self.data_buffer.append({"AccX": AccX, "AccY": AccY, "AccZ": AccZ})
                    if len(self.data_buffer) > 10:
                        self.data_buffer.pop(0)
                        
                    if len(self.data_buffer) < 10:
                        print(f"[SYSTEM] Waiting for more data before processing...")
                        return
                    
                    VeDBA, SCAY = self.calculate_metrics()
                    print(f"[DEVICE] VeDBA: {VeDBA}, SCAY: {SCAY}")
                    state = models.predict_label(VeDBA, SCAY)
                    
                    if (state == "Feeding" and VeDBA < 0.2):
                        state = "Lying"
                    print(f"[DEVICE] State of cow: {state}")
                    if self.last_action != state:
                        self.last_action = state
                        
                        if len(data) > 8 and data[8] == "POWER":
                            try:
                                power = float(data[9])
                                print(f"[DEVICE] Power data received: {power}")
                            except ValueError:
                                print(f"[DEVICE] Invalid power data: {data[9]}")
                                return
                        info_payload_json = {
                            "request": "info_data",
                            "gateway_id": GATEWAY_ID,
                            "device_id": device_id,
                            "state": state,
                            "power": "96",
                        }
                        try:
                            self.socket.sendall(json.dumps(info_payload_json).encode())
                            print(f"[SYSTEM] Sent info data to server: {info_payload_json}")
                        except socket.error as e:
                            print(f"[ERROR] Send failed: {e}")
                            self.connect_server()
                elif data[2] == "SET_BUZZER_ON":
                    print(f"[DEVICE] Buzzer ON command received: {data}")
                    try:
                        find_payload_json = {
                            "request": "find_device",
                            "gateway_id": GATEWAY_ID,
                            "device_id": device_id,
                            "find_state": "on"
                        }
                        self.socket.sendall(json.dumps(find_payload_json).encode())
                        print(f"[SYSTEM] Sent find_device ON command to server: {find_payload_json}")
                    except socket.error as e:
                        print(f"[ERROR] Send failed: {e}")
                        self.connect_server()
                elif data[2] == "SET_BUZZER_OFF":
                    print(f"[DEVICE] Buzzer OFF command received: {data}")
                    try:
                        find_payload_json = {
                            "request": "find_device",
                            "gateway_id": GATEWAY_ID,
                            "device_id": device_id,
                            "find_state": "off"
                        }
                        self.socket.sendall(json.dumps(find_payload_json).encode())
                        print(f"[SYSTEM] Sent find_device OFF command to server: {find_payload_json}")
                    except socket.error as e:
                        print(f"[ERROR] Send failed: {e}")
                        self.connect_server()
    def server_thread(self):
        while self.running:
            try:
                data = self.socket.recv(1024).decode().strip()
                if data:
                    print(f"[SERVER] Received: {data}")
                    
                    try:
                        json_data = json.loads(data)  # 👈 Parse JSON
                        if json_data.get("response") == "device_id":
                            device_id = json_data.get("device_id")
                            print(f"[SYSTEM] Device ID assigned: {device_id}")
                            self.serial.write(f"OK:ID:{device_id}\r".encode())
                            self.device_id_memory = device_id
                            self.cow_id_memory = json_data.get("cow_id")
                        
                        elif json_data.get("response") == "find_device":
                            device_id = json_data.get("device_id")
                            find_state = json_data.get("find_state")
                            print(f"[SYSTEM] Device ID found: {device_id}, find_state: {find_state}")
                            if find_state == "on":
                                self.serial.write(f"!ID:{device_id}:FIND:1#\r".encode())
                            elif find_state == "off":
                                self.serial.write(f"!ID:{device_id}:FIND:0#\r".encode())
                            else:
                                print(f"[SYSTEM] Invalid find_state: {find_state}")
                            self.device_id_memory = device_id
                            self.cow_id_memory = json_data.get("cow_id")
                        
                    except json.JSONDecodeError as e:
                        print(f"[ERROR] Failed to decode JSON: {e}")
                    
                    
            except socket.error as e:
                print(f"[ERROR] Socket error: {e}")
                self.connect_server()
            time.sleep(1)
            
    def serial_thread(self):
        while self.running:
            data = self.serial_read()
            if data:
                clean_data = sanitize_serial(data)
                print(f"[DEBUG] Sanitized data: {repr(clean_data)}")

                if clean_data == "!HELLO:FROM:DEVICE#":
                    print("[SYSTEM] A new device connected.")
                    try:
                        request_json = {
                            "request": "get_device_id",
                            "gateway_id": GATEWAY_ID,
                        }
                        self.socket.sendall(json.dumps(request_json).encode())
                        print("[SYSTEM] Sent get_device_id request to server.")
                    except socket.error as e:
                        print(f"[ERROR] Send failed: {e}")
                        self.connect_server()

                elif clean_data == self.device_id_memory and self.device_id_memory is not None:
                    print(f"[SYSTEM] Device ID {self.device_id_memory} already assigned.")
                    try:
                        request_json = {
                            "request": "set_device_id",
                            "gateway_id": GATEWAY_ID,
                            "device_id": self.device_id_memory,
                            "cow_id": self.cow_id_memory
                        }
                        self.socket.sendall(json.dumps(request_json).encode())
                        print("[SYSTEM] Sent set_device_id request to server.")
                        self.device_id_memory = None
                        self.cow_id_memory = None
                    except socket.error as e:
                        print(f"[ERROR] Send failed: {e}")
                        self.connect_server()
                
                self.handle_device(clean_data)
            time.sleep(1)

            
    def start(self):
        self.connect_device()
        self.connect_server()
        server_thread = threading.Thread(target=self.server_thread)
        server_thread.daemon = True
        server_thread.start()
        serial_thread = threading.Thread(target=self.serial_thread)
        serial_thread.daemon = True
        serial_thread.start()
        while self.running:
            try:
                time.sleep(1)
            except KeyboardInterrupt:
                print("🔌 Exiting...")
                self.running = False
                break
        

try:
    client = Client(HOST, PORT, COM_PORT, BAUD_RATE)
    client.start()
except KeyboardInterrupt:
    print("🔌 Exiting...")
    client.running = False
