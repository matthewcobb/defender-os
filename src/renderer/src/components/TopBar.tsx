import { useState, useEffect } from 'react'
import axios from 'axios'

function TopBar() {
  const API_URL = 'http://0.0.0.0:5000'
  const [cpuTemp, setCpuTemp] = useState({})
  const [error, setError] = useState('')
  const [date, setDate] = useState(new Date())

  const fetchCpuTemp = async () => {
    try {
      const response = await axios.get(API_URL + '/cpu_temp')
      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setCpuTemp(response.data)

      setError('')
    } catch (err) {
      setError(err.message || 'Failed to fetch data from the server.')
    }
  }

  useEffect(() => {
    fetchCpuTemp()

    const interval = setInterval(() => {
      fetchCpuTemp()
    }, 10000) // Fetches every 10 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="top-bar">
      <p className="app-name">
        DEFENDER<span className="text-secondary">OS</span>
      </p>
      <div className="cpu-temp monospace">{error ? '--' : cpuTemp.temp}ºC</div>
      <p className="monospace">{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
    </div>
  )
}

export default TopBar
