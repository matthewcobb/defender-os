# setup a systemd service

from flask import Flask, jsonify
from gpiozero import CPUTemperature

app = Flask(__name__)

def fetch_cpu_temp():
  try:
    cpu = CPUTemperature()
    temp = round(cpu.temperature)
    return {"temp": temp}, 200
  except Exception as e:
    return jsonify({"error": str(e)}), 500

def fetch_battery_status():
  try:
    # Your battery status fetching logic
    return {"status": "Charging", "level": 75}, 200
  except Exception as e:
    return jsonify({"error": str(e)}), 500

def fetch_solar_status():
  try:
    # Your solar status fetching logic
    return {"status": "Active", "output": "5.2kW"}, 200
  except Exception as e:
    return jsonify({"error": str(e)}), 500

@app.route('/cpu_temp', methods=['GET'])
def cpu_temp():
  return fetch_cpu_temp()

@app.route('/battery_status', methods=['GET'])
def battery_status():
  return fetch_battery_status()

@app.route('/solar_status', methods=['GET'])
def solar_status():
  return fetch_solar_status()