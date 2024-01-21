import LeisurePanel from './LeisurePanel'
import SolarPanel from './SolarPanel'
import StarterPanel from './StarterPanel'

function Home() {
  return (
    <div className="fade-in-fast">
      <LeisurePanel />
      <div className="grid">
        <div className="cell">
          <SolarPanel />
        </div>
        <div className="cell">
          <StarterPanel />
        </div>
      </div>
    </div>
  )
}

export default Home
