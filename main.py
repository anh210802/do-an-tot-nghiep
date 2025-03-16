from Scheduler.scheduler import *
from Utilities.lora import *
from Utilities.mqtt import *
from PrivateTasks.handleData import *
from data import *
from dotenv import load_dotenv
import os
import time

load_dotenv()

com_port = os.getenv("COM_PORT")
baud_rate = os.getenv("BAUD_RATE")
mqtt_broker = os.getenv("MQTT_BROKER")
mqtt_port = os.getenv("MQTT_PORT")
client_id = os.getenv("CLIENT_ID")

if None in [com_port, baud_rate, mqtt_broker, mqtt_port, client_id]:
    print("Error: Missing environment variables!")
    exit(1)

scheduler = Scheduler()
scheduler.SCH_Init()

lora = LoRa(com_port, baud_rate)
if not lora.openPort():
    print("Failed to open LoRa port!")
    exit(1)

mqtt = MQTT(mqtt_broker, int(mqtt_port))
mqtt.connect(client_id)

topic = input("Enter topic: ").strip()
mqtt.subscribe(topic)

handleData = HandleData(lora, mqtt)

def handleTask():
    handleData.handle(topic)

scheduler.SCH_Add_Task(handleTask, 0, 1)

while True:
    scheduler.SCH_Update()
    scheduler.SCH_Dispatch_Tasks()
    time.sleep(1)
