import React, { useContext } from 'react'
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material'
import { DjContext } from '../../context/DjContext'

const RequestHourFilter = () => {
  const {timeRange, setTimeRange} = useContext(DjContext)

  function handleOnChange(e) {
    setTimeRange(e.target.value)
  }
  
  return (
    <div>
      <FormControl fullWidth className='hour-filter-form'>
        <InputLabel id="time-range-select-label">Time Range</InputLabel>
        <Select
          labelId="time-range-select-label"
          id="time-range-select"
          value={timeRange}
          label="Time Range"
          onChange={handleOnChange}
          size='small'
        >
          <MenuItem value={0.5}>Last 30 minutes</MenuItem>
          <MenuItem value={1}>Last 1 hour</MenuItem>
          <MenuItem value={4}>Last 4 hours</MenuItem>
          <MenuItem value={12}>Last 12 hours</MenuItem>
          <MenuItem value={24}>Last 24 hours</MenuItem>
          <MenuItem value={48}>Last 48 hours</MenuItem>
          <MenuItem value={168}>Last 7 days</MenuItem>
          <MenuItem value={'all'}>All Time</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

export default RequestHourFilter