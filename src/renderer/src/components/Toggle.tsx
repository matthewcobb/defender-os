import { useRef, useEffect } from 'react'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

interface ToggleProps {
  drawerOpen: boolean
  setDrawerOpen: (drawerOpen: boolean) => void
}

function Toggle({ drawerOpen, setDrawerOpen }: ToggleProps) {
  const drawerToggle = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function toggleDrawer() {
      setDrawerOpen((prevDrawerOpen) => {
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
  }, [drawerOpen])

  return (
    <div ref={drawerToggle} className={`toggle ${drawerOpen ? 'drawer-open' : ''}`}>
      <div className="icon">
        <ArrowForwardIosRoundedIcon />
      </div>
    </div>
  )
}

export default Toggle
