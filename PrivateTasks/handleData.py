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
        self.last_gps = None  # Lưu giá trị GPS cuối cùng

    def handle(self, topic):
        # Đọc dữ liệu từ LoRa
        lora_data = self.lora.read()

        # Kiểm tra nếu không có dữ liệu hoặc không phải kiểu chuỗi
        if not lora_data or not isinstance(lora_data, str):
            return
        
        if lora_data == "Invalid GPS Data":
            print("⚠ Invalid GPS Data")
            return

        try:
            # Chia nhỏ dữ liệu
            lora_data = lora_data.split(":")
            if lora_data[0] != "ID":
                print("⚠ Error: Data format incorrect")
                return

            device_id = lora_data[1]

            # Xử lý dữ liệu GPS
            if lora_data[2] == "GPS":
                longitude = lora_data[3]
                latitude = lora_data[4]
                current_gps = (longitude, latitude)

                # Chỉ in GPS nếu nó thay đổi
                if current_gps != self.last_gps:
                    print(f"📍 Device {device_id} - New GPS: {longitude}, {latitude}")
                    self.last_gps = current_gps  # Cập nhật tọa độ cuối

            # Xử lý dữ liệu gia tốc
            elif lora_data[2] == "Accx" and lora_data[4] == "Accy" and lora_data[6] == "Accz":
                try:
                    AccX = float(lora_data[3])
                    AccY = float(lora_data[5])
                    AccZ = float(lora_data[7])
                except ValueError:
                    print(f"⚠ Error: Invalid acceleration data: {lora_data[3]}, {lora_data[5]}, {lora_data[7]}")
                    return
                
                # Lưu dữ liệu vào buffer (chỉ giữ tối đa 10 giá trị gần nhất)
                self.data_buffer.append({"AccX": AccX, "AccY": AccY, "AccZ": AccZ})
                if len(self.data_buffer) > 10:
                    self.data_buffer.pop(0)

                # Đảm bảo đủ dữ liệu để tính toán
                if len(self.data_buffer) < 10:
                    print("⏳ Waiting for more data before processing...")
                    return

                # Tính toán VeDBA và SCAY
                VeDBA, SCAY = self.calculate_metrics()
                print(f"📊 VeDBA: {VeDBA:.4f}, SCAY: {SCAY:.4f}")

                # Dự đoán trạng thái
                state = models.predict_label(VeDBA, SCAY)
                if (state == "Feeding" and VeDBA < 0.2):
                    state = "Lying"
                print(f"🧠 Predicted state: {state}")

                # Kiểm tra trạng thái nguồn điện (POWER)
                if len(lora_data) > 8 and lora_data[8] == "POWER":
                    try:
                        powered = int(lora_data[9])
                        print(f"🔋 Power Status: {powered}")
                    except ValueError:
                        print("⚠ Error: Invalid POWER value")

        except IndexError:
            print("⚠ Error: Received incomplete data packet")

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
