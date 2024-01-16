import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CarIcon from '@mui/icons-material/DirectionsCar'
import SettingsIcon from '@mui/icons-material/Settings'
import InfoIcon from '@mui/icons-material/Info'
import CameraIcon from '@mui/icons-material/Camera'
import { Link } from 'react-router-dom'

export default function Nav({ receivingVideo, settings }) {
  const [value, setValue] = React.useState(0)
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <nav>
      <div className="nav-container">
        <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example" centered>
          <Tab
            className={receivingVideo === true ? 'active' : ''}
            icon={<CarIcon />}
            to={'/'}
            component={Link}
          />
          <Tab icon={<InfoIcon />} to={'/info'} component={Link} />
          {settings?.camera !== '' ? (
            <Tab icon={<CameraIcon />} to={'/camera'} component={Link} />
          ) : null}
          <Tab icon={<SettingsIcon />} to={'/settings'} component={Link} />
        </Tabs>
      </div>
    </nav>
  )
}
