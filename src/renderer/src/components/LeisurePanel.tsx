import Battery20Icon from '@mui/icons-material/Battery20'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BoltIcon from '@mui/icons-material/Bolt'
import BeachAccessIcon from '@mui/icons-material/BeachAccess'
import { CircularProgressBar } from '@tomickigrzegorz/react-circular-progress-bar'

function LeisurePanel() {
  return (
    <div className="grid mb-05">
      <div className="panel">
        <div className="grid gutter-1">
          <div className="cell-shrink">
            <div className="p-relative">
              <CircularProgressBar
                percent={60}
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
              <h2>120w</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeisurePanel
