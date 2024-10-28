import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CarIcon from '@mui/icons-material/DirectionsCar'
import SettingsIcon from '@mui/icons-material/Settings'
import AppsIcon from '@mui/icons-material/Apps';
import CameraIcon from '@mui/icons-material/Camera'
import Toggle from './Toggle'
import { Link } from 'react-router-dom'

export default function Nav({ receivingVideo, settings, setDrawerState, drawerState }) {
  const [value, setValue] = React.useState(0)
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <nav>
      <Tabs value={value} onChange={handleChange} aria-label="icon label tabs">
        <Tab
          className={receivingVideo === true ? 'active' : ''}
          icon={<CarIcon fontSize={"large"} />}
          to={'/'}
          component={Link}
        />
        <Tab icon={<AppsIcon fontSize={"large"} />} to={'/launcher'} component={Link} />
        {settings?.camera !== '' ? (
          <Tab icon={<CameraIcon fontSize={"large"} />} to={'/camera'} component={Link} />
        ) : null}
        <Tab icon={<SettingsIcon fontSize={"large"} />} to={'/settings'} component={Link} />
      </Tabs>
      <Toggle drawerState={drawerState} setDrawerState={setDrawerState} />
    </nav>
  )
}
