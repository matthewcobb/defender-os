import WbSunnyIcon from '@mui/icons-material/WbSunny'

function SolarPanel({ data }) {
  return (
    <div className="panel">
      <p className="grid">
        <WbSunnyIcon fontSize="small" />
        Solar
      </p>
      <h2>{data['pv_power'] || 0}w</h2>
    </div>
  )
}

export default SolarPanel
