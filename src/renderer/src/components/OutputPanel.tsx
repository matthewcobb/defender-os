import ElectricCarIcon from '@mui/icons-material/ElectricCar'

function OutputPanel({ data }) {
  return (
    <div className="panel">
      <p className="grid">
        <ElectricCarIcon fontSize="small" />
        Output
      </p>
      <h2>{data['load_output'] || 0}w</h2>
    </div>
  )
}

export default OutputPanel
