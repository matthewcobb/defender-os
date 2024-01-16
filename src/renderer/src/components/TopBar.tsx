import { useState, useEffect } from 'react'

function TopBar() {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="top-bar">
      <p>
        DEFENDER<span className="text-secondary">OS</span>
      </p>
      <p className="clock">{date.toLocaleTimeString()}</p>
    </div>
  )
}

export default TopBar
