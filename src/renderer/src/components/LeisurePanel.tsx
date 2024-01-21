import React, { useState, useEffect } from 'react'
import axios from 'axios'

/*
DCDC Response
{'function': 'READ', 'model': 'RBC50D1S-G1', 'device_id': 96, 'battery_percentage': 99, 'battery_voltage': 13.2, 'battery_current': 0.13, 'battery_temperature': 25, 'controller_temperature': 17, 'load_status': 'off', 'load_voltage': 12.5, 'load_current': 0.0, 'load_power': 0, 'pv_voltage': 14.0, 'pv_current': 0.02, 'pv_power': 2, 'max_charging_power_today': 17, 'max_discharging_power_today': 0, 'charging_amp_hours_today': 3, 'discharging_amp_hours_today': 0, 'power_generation_today': 40, 'power_consumption_today': 0, 'power_generation_total': 39610, 'charging_status': 'mppt', 'battery_type': 'lithium'}
*/

/*
Battery Response
{'function': 'READ', 'cell_count': 4, 'cell_voltage_0': 3.3, 'cell_voltage_1': 3.3, 'cell_voltage_2': 3.3, 'cell_voltage_3': 3.3, 'sensor_count': 4, 'temperature_0': 12.0, 'temperature_1': 12.0, 'temperature_2': 12.0, 'temperature_3': 12.0, 'current': 0.0, 'voltage': 13.2, 'remaining_charge': 92.53, 'capacity': 99.99, 'model': 'RBT100LFP12S-G', 'device_id': 247}
*/

// import Battery20Icon from '@mui/icons-material/Battery20'
// import AccessTimeIcon from '@mui/icons-material/AccessTime'
// import BoltIcon from '@mui/icons-material/Bolt'
// import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import { CircularProgressBar } from '@tomickigrzegorz/react-circular-progress-bar'

function LeisurePanel() {
  const API_URL = "http://0.0.0.0:5000"
  const [batteryStatus, setBatteryStatus] = useState({})
  const [dcdcStatus, setDcdcStatus] = useState({})
  const [error, setError] = useState('')

  const fetchStatus = async () => {
    try {
      const batteryResponse = await axios.get(API_URL + '/battery_status')
      if (batteryResponse.data.error) {
        throw new Error(batteryResponse.data.error)
      }
      setBatteryStatus(batteryResponse.data)

      const dcdcResponse = await axios.get(API_URL + '/dcdc_status')
      if (dcdcResponse.data.error) {
        throw new Error(dcdcResponse.data.error)
      }
      setDcdcStatus(dcdcResponse.data)

      setError('')
    } catch (err) {
      setError(err.message || 'Failed to fetch data from the server.')
    }
  }

  useEffect(() => {
    fetchStatus()

    const interval = setInterval(() => {
      fetchStatus()
    }, 10000) // Fetches every 3 seconds

    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [])

  return (
    <div className="grid mb-05">
      <div className="panel">
        {error ? (
          <div>Error: {error}</div>
        ) : (
          <div className="grid gutter-1">
            <div className="cell-shrink">
              <div className="p-relative">
                <CircularProgressBar
                  percent={batteryStatus['remaining_charge']}
                  linearGradient={['#94EB9D', '#6EF3EE']}
                  size={104}
                  colorCircle="#1A1D1B"
                  fontWeight={500}
                  fontColor="#ffffff"
                  fill="#2D4240"
                  // styles={{
                  //   borderRadius: "50%",
                  //   boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
                  // }}
                />
              </div>
            </div>
            <div className="cell">
              <p className="text-secondary">Time remaining</p>
              <div className="grid grid-middle mb-05">
                <h2>{batteryStatus}</h2>
              </div>

              <p className="text-secondary">Output</p>
              <div className="grid grid-middle mb-05">
                <h2>{dcdcStatus['load_power']}w</h2>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeisurePanel
