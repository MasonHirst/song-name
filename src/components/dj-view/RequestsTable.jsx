import React, { useContext, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material'
import TableRowActions from './TableRowActions'
import { DjContext } from '../../context/DjContext'

const RequestsTable = () => {
  const {
    songRequests,
    rowsPerPage,
    setRowsPerPage,
    page,
    setPage,
    songFetchLoading,
    timeRange,
  }  = useContext(DjContext)
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Get the data for the current page
  const paginatedData = songRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  function formatTime(date) {
    const now = new Date()
    const givenDate = new Date(date)
    const isToday = now.toDateString() === givenDate.toDateString()
    if (isToday) {
      return givenDate.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })
    }
    return (
      <>
        {givenDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
        <br />
        {givenDate.toLocaleDateString([], {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })}
      </>
    )
  }

  return (
    <Paper>
      <TableContainer
        sx={{
          display: 'inline-block', // Ensures the table only grows as wide as its content
          maxWidth: '100%', // Prevents the table from exceeding the viewport width
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className='table-header-cell'>Actions</TableCell>
              <TableCell className='table-header-cell'>Song Name</TableCell>
              <TableCell className='table-header-cell'>Artist</TableCell>
              <TableCell className='table-header-cell'>Reason</TableCell>
              <TableCell className='table-header-cell'>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <TableRowActions request={request} />
                  </TableCell>
                  <TableCell>{request.song_name}</TableCell>
                  <TableCell>{request.artist_name}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem' }}>
                    {request.request_reason}
                  </TableCell>
                  <TableCell>{formatTime(request.createdAt)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  {songFetchLoading
                    ? 'Loading song requests...'
                    : timeRange === 'all'
                    ? 'No song requests!'
                    : `No requests in the last ${timeRange} hour(s)`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <TablePagination
        component='div'
        count={songRequests.length} // Total number of rows
        page={page} // Current page
        onPageChange={handleChangePage} // When page changes
        rowsPerPage={rowsPerPage} // Number of rows per page
        onRowsPerPageChange={handleChangeRowsPerPage} // Change rows per page
        rowsPerPageOptions={[5, 25, 50, 100, 200]}
        labelRowsPerPage='Rows per page'
      />
    </Paper>
  )
}

export default RequestsTable
