import React, { useState, useEffect } from 'react'
import axios from 'axios'
import LeisurePanel from './LeisurePanel'
import SolarPanel from './SolarPanel'
import OutputPanel from './OutputPanel'
import toast from 'react-hot-toast'

function Home() {
  const API_URL = 'http://0.0.0.0:5000'
  const [data, setData] = useState({})
  const [error, setError] = useState('Connecting...')

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL + '/renogy_data')
      if (response.data.error) {
        throw new Error(response.data.error)
      }
      setData(response.data)

      setError('')
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }
  useEffect(() => {
    fetchData()
    const interval = setInterval(() => {
      fetchData()
    }, 5000) // Fetches every 3 seconds

    return () => clearInterval(interval) // Cleanup interval on component unmount
  }, [])

  const handleErrorClick = () => {
    if (error) {
      toast.error(error)
    } else {
      toast.success('Connected')
    }
  }

  return (
    <div className="fade-in-fast">
      <div className={`home-panels ${error ? 'disconnected' : ''}`} onClick={handleErrorClick}>
        <LeisurePanel data={data} error={error} />
        <div className="grid gutter-1">
          <div className="cell">
            <SolarPanel data={data} />
          </div>
          <div className="cell">
            <OutputPanel data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
