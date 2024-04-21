import { useRef, useEffect } from 'react'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

interface ToggleProps {
  drawerOpen: boolean
  setDrawerOpen: (drawerState: boolean) => void
}

function Toggle({ drawerState, setDrawerState }: ToggleProps) {
  const drawerToggle = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function toggleDrawer() {
      setDrawerState((prevDrawerOpen) => {
        const newVal = !prevDrawerOpen
        console.log(newVal)
        return newVal
      })
    }

    const drawerToggleElement = drawerToggle.current
    if (drawerToggleElement) {
      drawerToggleElement.addEventListener('click', toggleDrawer)
      return () => {
        drawerToggleElement.removeEventListener('click', toggleDrawer)
      }
    }
  }, [drawerState])

  return (
    <div ref={drawerToggle} className={`toggle ${drawerState ? 'drawer-open' : ''}`}>
      <div className="icon">
        <ArrowForwardIosRoundedIcon />
      </div>
    </div>
  )
}

export default Toggle
