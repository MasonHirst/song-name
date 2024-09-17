import React, { useState, useEffect } from 'react'
import { Button, TextField, Typography } from '@mui/material'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import Swal from 'sweetalert2'

const RequestPage = () => {
  const [clientId, setClientId] = useState(
    localStorage.getItem('song_request_client_id')
  )
  const errorMsg = '*Required field'
  const submitErrorMsg =
    'Something went wrong when submitting your request. Please refresh and try again.'
  const [songName, setSongName] = useState('')
  const [songNameError, setSongNameError] = useState('')
  const [artistName, setArtistName] = useState('')
  const [artistNameError, setArtistNameError] = useState('')
  const [requestReason, setRequestReason] = useState('')
  const [requestReasonError, setRequestReasonError] = useState('')
  const [requestLoading, setRequestLoading] = useState(false)
  const [requestLimitReached, setRequestLimitReached] = useState(false)
  // const [requestBanWarning, setRequestBanWarning] = useState(false)
  // const [bannedFromRequesting, setBannedFromRequesting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    console.log('getting client id')
    console.log({ clientId })
    if (!localStorage.getItem('song_request_client_id')) {
      console.log('creating client id')
      localStorage.setItem('song_request_client_id', uuidv4())
      setClientId(localStorage.getItem('song_request_client_id'))
    }
  }, [])

  function _resetFields() {
    setSongName('')
    setSongNameError('')
    setArtistName('')
    setArtistNameError('')
    setRequestReason('')
    setRequestReasonError('')
    setSubmitError('')
  }

  function handleSubmitRequestForm() {
    setSongNameError('')
    setArtistNameError('')
    setRequestReasonError('')

    if (requestLimitReached) {
      console.log('Request limit has been reached!')
      activatePleaseWaitModal()
      return
    }
    if (requestLoading) {
      return
    }
    if (!songName) {
      setSongNameError(errorMsg)
      return
    }
    if (!artistName) {
      setArtistNameError(errorMsg)
      return
    }
    if (!requestReason) {
      setRequestReasonError(errorMsg)
      return
    }
    submitSongRequest()
  }

  function submitSongRequest() {
    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : window.location.origin
    const reqBody = {
      songName,
      artistName,
      requestReason,
      requesterClientId: clientId,
    }
    setRequestLoading(true)
    setTimeout(() => {
      axios
        .post(`${baseUrl}/api/request-song`, reqBody)
        .then(({ data }) => {
          if (data.message === 'too-many-requests-please-wait') {
            handleTooManyRequestsResponse()
          } else {
            _resetFields()
            activateConfirmationModal(data)
          }
        })
        .catch((error) => {
          setSubmitError(submitErrorMsg)
          console.log('! Error in submitSongRequest: ', error)
        })
        .finally(() => {
          setRequestLoading(false)
        })
    }, 1000)
  }

  function handleTooManyRequestsResponse() {
    setRequestLimitReached(true)
    activatePleaseWaitModal()
    setTimeout(() => {
      setRequestLimitReached(false)
    }, 120000);
  }

  function handleSongNameChange(e) {
    const val = e.target.value
    setSongNameError('')
    setSongName(val)
  }

  function activateConfirmationModal() {
    Swal.fire({
      title: 'Success!',
      text: 'Your request has been submitted',
      icon: 'success',
      confirmButtonText: 'Great!',
    })
  }

  function activatePleaseWaitModal() {
    Swal.fire({
      title: 'Please wait!',
      text: 'You\'ve submitted too many requests recently. Please try again later.',
      icon: 'warning',
      confirmButtonText: 'Ok',
    })
  }

  return (
    // HTML stuff goes here
    <div>
      <Typography variant='h4'>Request a song!</Typography>
      <form
        style={{
          marginTop: '40px',
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextField
          label='Song name'
          variant='outlined'
          fullWidth
          size='small'
          margin='normal'
          value={songName}
          onChange={handleSongNameChange}
          error={!!songNameError}
          inputProps={{ maxLength: 60 }}
          disabled={requestLoading}
        />
        <Typography variant='subtitle2' className='error' color='error'>
          {songNameError}
        </Typography>

        <TextField
          label='Artist name'
          variant='outlined'
          fullWidth
          size='small'
          margin='normal'
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          error={!!artistNameError}
          inputProps={{ maxLength: 60 }}
          disabled={requestLoading}
        />
        <Typography variant='subtitle2' className='error' color='error'>
          {artistNameError}
        </Typography>

        <TextField
          label='Why are you requesting this song?'
          variant='outlined'
          fullWidth
          size='small'
          margin='normal'
          value={requestReason}
          onChange={(e) => setRequestReason(e.target.value)}
          error={!!requestReasonError}
          inputProps={{ maxLength: 400 }}
          multiline
          minRows={2}
          maxRows={5}
          disabled={requestLoading}
        />

        <Typography variant='subtitle2' className='error' color='error'>
          {requestReasonError}
        </Typography>

        <Typography
          variant='subtitle2'
          className='error'
          color='error'
          sx={{
            marginTop: '15px',
            marginBottom: '-10px',
            textAlign: 'center',
          }}
        >
          {submitError}
        </Typography>

        <Button
          variant='contained'
          onClick={handleSubmitRequestForm}
          sx={{
            marginTop: '30px',
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '18px'
          }}
          disabled={requestLoading}
        >
          Submit request
        </Button>
      </form>
    </div>
  )
}

export default RequestPage
