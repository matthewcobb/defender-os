import React, { useState, useEffect } from 'react'
import axios from 'axios'

// import Battery20Icon from '@mui/icons-material/Battery20'
// import AccessTimeIcon from '@mui/icons-material/AccessTime'
// import BoltIcon from '@mui/icons-material/Bolt'
// import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import { CircularProgressBar } from '@tomickigrzegorz/react-circular-progress-bar'

function LeisurePanel() {
  const API_URL = "http://0.0.0.0:5000"
  const [batteryStatus, setBatteryStatus] = useState({})
  const [solarStatus, setSolarStatus] = useState({})
  const [error, setError] = useState('')

  const fetchStatus = async () => {
    try {
      const batteryResponse = await axios.get(API_URL + '/battery_status')
      if (batteryResponse.data.error) {
        throw new Error(batteryResponse.data.error)
      }
      setBatteryStatus(batteryResponse.data)

      const solarResponse = await axios.get(API_URL + '/solar_status')
      if (solarResponse.data.error) {
        throw new Error(solarResponse.data.error)
      }
      setSolarStatus(solarResponse.data)

      setError('')
    } catch (err) {
      setError(err.message || 'Failed to fetch data from the server.')
    }
  }

  useEffect(() => {
    fetchStatus()

    const interval = setInterval(() => {
      fetchStatus()
    }, 3000) // Fetches every 3 seconds

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
                  percent={batteryStatus.level}
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
                <h2>14hr 34m</h2>
              </div>

              <p className="text-secondary">Output</p>
              <div className="grid grid-middle mb-05">
                <h2>{solarStatus.output}</h2>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeisurePanel
