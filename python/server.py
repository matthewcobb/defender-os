from flask import Flask, jsonify
from gpiozero import CPUTemperature
import time
import signal
import asyncio
import sys
import logging
from renogybt import RoverClient, BatteryClient
from threading import Thread

RETRY_DELAY = 5

# Logging INFO level
logging.basicConfig(level=logging.DEBUG)

# Start the BLE clients
def create_ble_client(config):
    logging.info("Initializing BLE client...")
    if config['type'] == 'RNG_CTRL':
        client = RoverClient(config)
    elif config['type'] == 'RNG_BATT':
        client = BatteryClient(config)
    return client

dcdc_config =  {
    'type': 'RNG_CTRL',
    'mac_address': 'FC:A8:9B:26:D2:DC',
    'name': 'BT-TH-9B26D2DC',
    'device_id': 255
}
dcdc_client = create_ble_client(dcdc_config)

# Routes
app = Flask(__name__)

def fetch_cpu_temp():
    try:
        cpu = CPUTemperature()
        temp = round(cpu.temperature)
        return {"temp": temp}, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def fetch_battery_status():
    if dcdc_client.data:
        try:
            return jsonify({dcdc_client.data}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "RenogyBT not connected!"}), 500

def start_ble_client():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(dcdc_client.connect())
    loop.run_forever()

thread = Thread(target=start_ble_client)
thread.start()

def fetch_battery_status():
    try:
        #fetch_battery_status()
        return {"status": "Active", "output": "5.2kW"}, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def fetch_solar_status():
    try:
        # Your solar status fetching logic
        return {"status": "Active", "output": "5.2kW"}, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Routes
@app.route('/cpu_temp', methods=['GET'])
def cpu_temp():
    return fetch_cpu_temp()

@app.route('/battery_status', methods=['GET'])
def battery_status():
    return fetch_battery_status()

@app.route('/solar_status', methods=['GET'])
def solar_status():
    return fetch_solar_status()

