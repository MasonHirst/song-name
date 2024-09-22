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
  Link,
} from '@mui/material'
import TableRowActions from './TableRowActions'
import { DjContext } from '../../context/DjContext'
import { useEffect } from 'react'

const RequestsTable = () => {
  const {
    songRequests,
    rowsPerPage,
    setRowsPerPage,
    page,
    setPage,
    songFetchLoading,
    timeRange,
  } = useContext(DjContext)
  const [requestCountById, setRequestCountById] = useState({})
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    setRequestCountById(
      songRequests.reduce((acc, request) => {
        acc[request.requester_client_id] =
          (acc[request.requester_client_id] || 0) + 1
        return acc
      }, {})
    )
  }, [songRequests])

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

  function handleClientIdClick(clientId) {
    console.log(clientId)
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
              <TableCell className='table-header-cell'>Client</TableCell>
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
                  <TableCell>
                    <Link
                      onClick={() =>
                        handleClientIdClick(request.requester_client_id)
                      }
                    >
                      {request.requester_client_id}
                    </Link>
                    ({requestCountById[request.requester_client_id]})
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align='center'>
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
