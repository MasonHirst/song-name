import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import RequestHourFilter from './RequestHourFilter'
import RequestsTable from './RequestsTable'

const DjPage = () => {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <h2>Song Requests</h2>
        <RequestHourFilter />
      </Box>
      <RequestsTable />
    </div>
  )
}

export default DjPage
