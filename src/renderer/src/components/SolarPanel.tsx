import Battery20Icon from '@mui/icons-material/Battery20'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BoltIcon from '@mui/icons-material/Bolt'
import WbSunnyIcon from '@mui/icons-material/WbSunny'

function SolarPanel({ data }) {
  return (
    <div className="panel mb-1">
      <p className="grid">
        <WbSunnyIcon fontSize="small" />
        Solar
      </p>
      <h2>{data['pv_power'] || 0}w</h2>
    </div>
  )
}

export default SolarPanel
