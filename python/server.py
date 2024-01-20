from flask import Flask, jsonify
from gpiozero import CPUTemperature
import time
import logging
from renogybt import RoverClient, BatteryClient

RETRY_DELAY = 5

# Logging INFO level
logging.basicConfig(level=logging.INFO)

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
    'mac_address': '7BD4C7F0-B018-68EA-BBAD-7D21D527310D',
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
    if dcdc_client.initialized:
        try:
            dcdc_client.trigger_read_section()
            return jsonify({dcdc_client.data}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        dcdc_client.loop.run_until_complete(dcdc_client.connect())
        return jsonify({"error": "RenogyBT not connected!"}), 500

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
