from Scheduler.scheduler import *
from Utilities.lora import *
from Utilities.mqtt import *
from PrivateTasks.handleData import *
from data import *
from dotenv import load_dotenv
import os
import time

load_dotenv()

COM_PORT = os.getenv("COM_PORT")
BAUD_RATE = os.getenv("BAUD_RATE")
MQTT_BROKER = os.getenv("MQTT_BROKER")
MQTT_PORT = os.getenv("MQTT_PORT")
CLIENT_ID = os.getenv("CLIENT_ID")
TOPICS = [topic.strip() for topic in os.getenv("TOPICS", "").split(",")]

if None in [COM_PORT, BAUD_RATE, MQTT_BROKER, MQTT_PORT, CLIENT_ID]:
    print("Error: Missing environment variables!")
    exit(1)

scheduler = Scheduler()
scheduler.SCH_Init()

lora = LoRa(COM_PORT, BAUD_RATE)
if not lora.openPort():
    print("Failed to open LoRa port!")
    exit(1)

mqtt = MQTT(MQTT_BROKER, int(MQTT_PORT))
mqtt.connect(CLIENT_ID)


# Đăng ký các topic
for topic in TOPICS:
    mqtt.subscribe(topic)

handleData = HandleData(lora, mqtt)

def handleTask():
    handleData.handle(topic)

scheduler.SCH_Add_Task(handleTask, 0, 1)

while True:
    scheduler.SCH_Update()
    scheduler.SCH_Dispatch_Tasks()
    time.sleep(1)
