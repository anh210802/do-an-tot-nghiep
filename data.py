import json


class DATA:
    def __init__(self, device_id, time, longitude, latitude, states, powered):
        self.device_id = device_id
        self.time = time
        self.longitude = longitude
        self.latitude = latitude
        self.states = states
        self.powered = powered

    def form_data(self):
        data = {
            "device_id": self.device_id,
            "time": self.time,
            "longitude": self.longitude,
            "latitude": self.latitude,
            "states": self.states,
            "powered": self.powered
        }

        return data