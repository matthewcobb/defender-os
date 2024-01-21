from quart import Quart, jsonify
import logging
from gpiozero import CPUTemperature
from renogybt import RoverClient, BatteryClient  # Assuming these are in renogybt.py

dcdc_config =  {
    'type': 'RNG_CTRL',
    'mac_address': 'FC:A8:9B:26:D2:DC',
    'name': 'BT-TH-9B26D2DC',
    'device_id': 255
}

battery_config =  {
    'type': 'RNG_BATT',
    'mac_address': 'AC:4D:16:19:14:1A',
    'name': 'BT-TH-9B26D2DC',
    'device_id': 255
}

# Logging INFO level
logging.basicConfig(level=logging.INFO)

# Create clients
dcdc_client = RoverClient(dcdc_config)
battery_client = BatteryClient(battery_config)

# Flask
app = Quart(__name__)

@app.before_serving
async def before_serving():
    await dcdc_client.start()
    await battery_client.start()

def fetch_dcdc_status():
    if dcdc_client.latest_data:
        return jsonify(dcdc_client.latest_data), 200
    else:
        return jsonify({"error": "RenogyBT not connected!"}), 500

def fetch_battery_status():
    if battery_client.latest_data:
        return jsonify(battery_client.latest_data), 200
    else:
        return jsonify({"error": "RenogyBT not connected!"}), 500

@app.route('/dcdc_status', methods=['GET'])
async def dcdc_status():
    return fetch_dcdc_status()

@app.route('/battery_status', methods=['GET'])
async def battery_status():
    return fetch_battery_status()

# CPU Temp
@app.route('/cpu_temp', methods=['GET'])
def cpu_temp():
    try:
        cpu = CPUTemperature()
        temp = round(cpu.temperature)
        return {"temp": temp}, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)