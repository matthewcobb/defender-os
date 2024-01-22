// import Battery20Icon from '@mui/icons-material/Battery20'
// import AccessTimeIcon from '@mui/icons-material/AccessTime'
// import BoltIcon from '@mui/icons-material/Bolt'
// import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import { CircularProgressBar } from '@tomickigrzegorz/react-circular-progress-bar'

function LeisurePanel({ data }) {
  const is_charging = false
  return (
    <div className="grid mb-05">
      <div className="panel">
        <div className="grid gutter-1">
          <div className="cell-shrink">
            <div className="p-relative">
              <CircularProgressBar
                percent={Math.ceil(data['remaining_charge']) || 0}
                linearGradient={['#94EB9D', '#6EF3EE']}
                size={104}
                colorCircle="#1A1D1B"
                fontWeight={500}
                fontColor="#ffffff"
                fill="#2D4240"
              />
            </div>
          </div>
          <div className="cell">
            {is_charging ? (
              <div>
                <p className="text-secondary">Fully charged in</p>
                <div className="grid grid-middle mb-05">
                  <h2>{data['time_remaining_to_charge']}</h2>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-secondary">Time remaining</p>
                <div className="grid grid-middle mb-05">
                  <h2>{data['time_remaining_to_empty']}</h2>
                </div>

                <p className="text-secondary">Output</p>
                <div className="grid grid-middle mb-05">
                  <h2>{data['load_power']}w</h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeisurePanel
