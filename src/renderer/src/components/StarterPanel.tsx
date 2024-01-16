import ElectricCarIcon from '@mui/icons-material/ElectricCar'

function StarterPanel() {
  return (
    <div className="panel mb-1">
      <p className="grid">
        <ElectricCarIcon fontSize="small" />
        Starter
      </p>
      <h2>14.5v</h2>
    </div>
  )
}

export default StarterPanel
