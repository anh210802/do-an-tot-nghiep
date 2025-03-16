from data import *
from Utilities.lora import *
from Utilities.mqtt import *
import json
import time
import random
import bson

STATES = {"Lying", "Daring", "Eating"}

class HandleData:
    def __init__(self, lora, mqtt):
        self.lora = lora
        self.mqtt = mqtt

    def handle(self, topic):
        # Đọc dữ liệu từ LoRa
        lora_data = self.lora.read()

        # Kiểm tra nếu không có dữ liệu hoặc không phải kiểu chuỗi
        if not lora_data or not isinstance(lora_data, str):
            return

        # Chia nhỏ dữ liệu
        lora_data = lora_data.split(":")

        if len(lora_data) < 4:
            print(f"Error: Incomplete LoRa data received: {lora_data}")
            return
        if lora_data[0] == "ID":
            # device_id = lora_data[1]
            device_id = str(bson.ObjectId())
        current_time = time.strftime("%Y-%m-%dT%H:%M:%SZ")

        # Kiểm tra dữ liệu GPS có hợp lệ không
        if lora_data[2] == "GPS":
            data_gps = lora_data[3].split(",")
            try:
                longitude = float(data_gps[0])
                latitude = float(data_gps[1])
            except ValueError:
                print(f"Error: Invalid GPS data: {data_gps[0]}, {data_gps[1]}")
                return

        if lora_data[4] == "POWER":
            powered = int(lora_data[5])

        # Chọn trạng thái ngẫu nhiên
        state = random.choice(list(STATES))

        # Tạo đối tượng DATA
        data = DATA(device_id, current_time, longitude, latitude, state, powered)
        json_data = json.dumps(data.form_data())

        self.mqtt.send_data(topic, json_data)
        print(f"Sent data: {json_data}")
