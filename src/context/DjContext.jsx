import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

export const DjContext = createContext()

export function DjContextWrapper({ children }) {
  const [songRequests, setSongRequests] = useState([])
  const [timeRange, setTimeRange] = useState(4)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [songFetchLoading, setSongFetchLoading] = useState(false)

  useEffect(() => {
    handleGetRequests()
  }, [timeRange])

  function handleGetRequests() {
    setSongFetchLoading(true)
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : window.location.origin

    const reqBody = {
      getStartTime: getMillisecondsForPastHours(timeRange),
    }

    // I am using a post method here instead of get because I want more options for filtering results
    axios
      .post(baseUrl + '/api/requests', reqBody)
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setSongRequests(data)
        }
      })
      .catch((error) => {
        console.log('! Error in handleGetRequests: ', error)
      })
      .finally(() => setSongFetchLoading(false))
  }

  function getMillisecondsForPastHours(hoursAgo) {
    return Date.now() - hoursAgo * 60 * 60 * 1000 // Subtract the given number of hours
  }

  return (
    <DjContext.Provider
      value={{
        songRequests,
        timeRange,
        setTimeRange,
        songFetchLoading,
        page,
        setPage,
        rowsPerPage,
        setRowsPerPage
      }}
    >
      {children}
    </DjContext.Provider>
  )
}
