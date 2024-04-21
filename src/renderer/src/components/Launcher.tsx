import SPOTIFY from '../assets/spotify.svg'

function Launcher() {
  return (
    <div className="launcher fade-in-fast">
      <div className="app">
        <img src={SPOTIFY} className="icon" />
      </div>
      <div className="app">
        <div className="icon"></div>
      </div>
      <div className="app">
        <div className="icon"></div>
      </div>
      <div className="app">
        <div className="icon"></div>
      </div>
    </div>
  )
}

export default Launcher
