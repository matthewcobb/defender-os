import { CircularProgressBar } from '@tomickigrzegorz/react-circular-progress-bar'
import { ThreeDots } from 'react-loader-spinner'

function LeisurePanel({ data, error }) {
  const is_charging = data['load_output'] > 0

  return (
    <div className="grid grid-col-span-2">
      <div className={`panel ${is_charging ? 'charging' : ''}`}>
        <div className="grid grid-middle gutter-1">
          <div className="cell-shrink">
            <div className="p-relative">
              <CircularProgressBar
                percent={Math.ceil(data['remaining_charge']) || 0}
                linearGradient={['#94EB9D', '#6EF3EE']}
                size={130}
                colorCircle="#1A1D1B"
                fontWeight={500}
                fontColor="#ffffff"
                fill="#2D4240"
              />
            </div>
          </div>
          <div className="cell">
            {error ? (
              <div>
                <h3 className="">Connecting</h3>
                <p className="mt-05">
                  Please wait...
                </p>
              </div>
            ) : is_charging ? (
              <div>
                <p>Fully charged in</p>
                <div className="grid grid-middle mb-05">
                  <h2>{data['time_remaining_to_charge'] || '...'}</h2>
                </div>
              </div>
            ) : (
              <div>
                <p>Time remaining</p>
                <div className="grid grid-middle mb-05">
                  <h2>{data['time_remaining_to_empty'] || '...'}</h2>
                </div>

                <p>Battery</p>
                <div className="grid grid-middle">
                  <h2>{data['battery_voltage'] || 0}v</h2>
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
