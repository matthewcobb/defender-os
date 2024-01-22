import React, { useState, useEffect } from 'react'
import axios from 'axios'
import LeisurePanel from './LeisurePanel'
import SolarPanel from './SolarPanel'
import StarterPanel from './StarterPanel'

function Home() {
  const API_URL = 'http://0.0.0.0:5000'
  const [data, setData] = useState({})
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL + '/renogy_data')
      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setData(response.data)

      setError('')
    } catch (err) {
      setError(err.message || 'Failed to fetch data from the server.')
    }
  }
  useEffect(() => {
    fetchData()
    const interval = setInterval(() => {
      fetchData()
    }, 5000) // Fetches every 3 seconds

    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [])

  return error ? (
    <div className="panel">Error: {error}</div>
  ) : (
    <div className="fade-in-fast">
      <LeisurePanel data={data} />
      <div className="grid">
        <div className="cell">
          <SolarPanel data={data} />
        </div>
        <div className="cell">
          <StarterPanel data={data} />
        </div>
      </div>
    </div>
  )
}

export default Home
