import { useRef, useLayoutEffect, useEffect, useState } from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import Settings from './components/Settings'
import './App.scss'
import Launcher from './components/Launcher'
import Home from './components/Home'
import TopBar from './components/TopBar'
import Nav from './components/Nav'
import Carplay from './components/Carplay'
import Camera from './components/Camera'
import { useCarplayStore } from './store/store'
import { Toaster } from 'react-hot-toast'

function App() {
  const carPlayRef = useRef<HTMLDivElement>(null)
  const [drawerState, setDrawerState] = useState(false)
  const [receivingVideo, setReceivingVideo] = useState(false)
  const [commandCounter, setCommandCounter] = useState(0)

  // Dimensions
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const closeDrawer = () => {
    setDrawerState(false)
  }

  useLayoutEffect(() => {
    if (carPlayRef.current) {
      setDimensions({
        width: carPlayRef.current.offsetWidth,
        height: carPlayRef.current.offsetHeight
      })
    }
  }, [])

  const [keyCommand, setKeyCommand] = useState('')
  const settings = useCarplayStore((state) => state.settings)

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [settings])

  const onKeyDown = (event: KeyboardEvent) => {
    console.log(event.code)
    if (Object.values(settings!.bindings).includes(event.code)) {
      const action = Object.keys(settings!.bindings).find(
        (key) => settings!.bindings[key] === event.code
      )
      if (action !== undefined) {
        setKeyCommand(action)
        setCommandCounter((prev) => prev + 1)
        if (action === 'selectDown') {
          console.log('select down')
          setTimeout(() => {
            setKeyCommand('selectUp')
            setCommandCounter((prev) => prev + 1)
          }, 200)
        }
      }
    }
  }

  return (
    <Router>
      <div id={'app'} className={`App ${drawerState ? 'drawer-open' : ''}`}>
        <main>
          <Toaster position="top-right" />
          <TopBar />
          <div className="page-container">
            <div className="page">
              <Routes>
                <Route path={'/'} element={<Home />} />
                <Route path={'/settings'} element={<Settings settings={settings!} />} />
                <Route path={'/launcher'} element={<Launcher />} />
                <Route path={'/camera'} element={<Camera settings={settings!} />} />
              </Routes>
            </div>
          </div>
          <Nav receivingVideo={receivingVideo} settings={settings} drawerState={drawerState} setDrawerState={setDrawerState} />
        </main>
        <aside ref={carPlayRef} onClick={closeDrawer}>
          {settings ? (
            <Carplay
              width={dimensions.width}
              height={dimensions.height}
              receivingVideo={receivingVideo}
              setReceivingVideo={setReceivingVideo}
              settings={settings}
              command={keyCommand}
              commandCounter={commandCounter}
            />
          ) : null}
        </aside>
      </div>
    </Router>
  )
}

export default App
