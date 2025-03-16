from data import *
from Utilities.lora import *
from Utilities.mqtt import *
import json
import time
import random
import bson
import pandas as pd
import numpy as np
STATES = {"Lying", "Standing", "Feeding"}
import PrivateTasks.models as models


class HandleData:
    def __init__(self, lora, mqtt):
        self.lora = lora
        self.mqtt = mqtt
        self.data_buffer = []

    def handle(self, topic):
        # Đọc dữ liệu từ LoRa
        lora_data = self.lora.read()

        # Kiểm tra nếu không có dữ liệu hoặc không phải kiểu chuỗi
        if not lora_data or not isinstance(lora_data, str):
            return
        
        if lora_data == "Invalid GPS Data":
            print("Invalid GPS Data")
            return
        
        else:
            # Chia nhỏ dữ liệu
            lora_data = lora_data.split(":")

            if len(lora_data) < 4:
                print(f"Error: Incomplete LoRa data received: {lora_data}")
                return
            if lora_data[0] == "ID":
                device_id = lora_data[1]
                try:
                    AccX = float(lora_data[3])
                    AccY = float(lora_data[5])
                    AccZ = float(lora_data[7])
                except ValueError:
                    print(
                        f"Error: Invalid acceleration data: {lora_data[3]}, {lora_data[5]}, {lora_data[7]}")
                    return
                # Lưu dữ liệu vào danh sách
                self.data_buffer.append({"AccX": AccX, "AccY": AccY, "AccZ": AccZ})

                # Giới hạn danh sách chỉ chứa 10 phần tử gần nhất
                if len(self.data_buffer) > 10:
                    self.data_buffer.pop(0)
                VeDBA, SCAY = self.calculate_metrics()
                state = models.predict_label(VeDBA, SCAY)
                print(f"Predicted state: {state}")


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

            if lora_data[8] == "POWER":
                powered = int(lora_data[9])


            # Tạo đối tượng DATA
            # data = DATA(device_id, current_time, longitude,
            #             latitude, state, powered)
            json_data = json.dumps(data.form_data())

            # self.mqtt.send_data(topic, json_data)
            print(f"Sent data: {json_data}")

    def calculate_metrics(self):
        df = pd.DataFrame(self.data_buffer)

        # Tính giá trị gia tốc tĩnh (trung bình)
        df["AccX_static"] = df["AccX"].rolling(window=10, min_periods=1).mean()
        df["AccY_static"] = df["AccY"].rolling(window=10, min_periods=1).mean()
        df["AccZ_static"] = df["AccZ"].rolling(window=10, min_periods=1).mean()

        # Tính VeDBA
        df["VeDBA"] = abs(df["AccX"] - df["AccX_static"]) + \
            abs(df["AccY"] - df["AccY_static"]) + \
            abs(df["AccZ"] - df["AccZ_static"])

        # Tính SCAY theo công thức SCAY = 9.81 * AccY
        df["SCAY"] = 9.81 * df["AccY"]

        # Lấy giá trị VeDBA và SCAY của dữ liệu mới nhất
        latest_VeDBA = df["VeDBA"].iloc[-1]
        latest_SCAY = df["SCAY"].iloc[-1]

        return latest_VeDBA, latest_SCAY
