const { Request } = require('./database/models')
const { Op } = require('sequelize')
const moment = require('moment')
const validator = require('validator')
const rollbar = require('./rollbar-config')

module.exports = {
  handleNewSongRequest: async (req, res) => {
    try {
      const { requesterClientId, songName, artistName, requestReason } = req.body
      if (!validator.isUUID(requesterClientId)) {
        throw {
          message: 'invalid UUID token from client',
          token: requesterClientId
        }
      }
      if (!requesterClientId) {
        throw clientIdRequiredMsg
      }
      if (!songName || !artistName || !requestReason) {
        throw { ...allFieldsRequiredMsg, body: req.body }
      }
      
      const fiveMinutesAgo = moment().subtract(5, 'minutes').toDate()
      const clientRequestCount = await Request.count({
        where: {
          requester_client_id: requesterClientId.trim(),
          createdAt: {
            [Op.gte]: fiveMinutesAgo, // Greater than or equal to the timestamp of 5 minutes ago
          },
        },
      })
      if (clientRequestCount > 2) {
        rollbar
          .warning(
            `Client ${requesterClientId} was stopped from requesting, their request limit was reached`
          )
          .catch((rollbarError) => {
            console.error('Rollbar failed to report the error:', rollbarError)
          })
        return res
          .status(200)
          .send({ message: 'please-wait-before-requesting' })
      }

      // Call the database for creation
      const newRequest = await Request.create({
        requester_client_id: requesterClientId.trim(),
        song_name: songName.trim(),
        artist_name: artistName.trim(),
        request_reason: requestReason.trim(),
        is_bookmarked: false,
        is_played: false,
        is_disliked: false,
        is_soft_deleted: false,
      })
      if (!newRequest) {
        throw failedToCreateMsg
      }
      res.status(200).send(newRequest)
    } catch (error) {
      const errCode = error?.code || 500
      console.error(error)
      rollbar
        .error('Error in handleNewSongRequest function: ', error)
        .catch((rollbarError) => {
          console.error('Rollbar failed to report the error:', rollbarError)
        })
      return res.status(errCode).send('something-went-wrong')
    }
  },

  handleGetRequests: async (req, res) => {
    try {
      const { getStartTime } = req.body
      let where = {}
      // If "getStart" parameter is provided
      if (getStartTime && !isNaN(getStartTime)) {
        console.log('in')
        const startDate = new Date(parseInt(getStartTime, 10)) // Convert milliseconds to Date object
        if (!isNaN(startDate.getTime())) {
          where = {
            createdAt: {
              [Op.gte]: startDate, // Greater than or equal to the startDate
            },
          }
        }
      }

      const allRequests = await Request.findAll({
        where,
        order: [['createdAt', 'DESC']],
      })

      if (!allRequests) {
        throw getRequestsFailedMsg
      }
      res.status(200).send(allRequests)
    } catch (error) {
      const errCode = error?.code || 500
      console.error(error)
      rollbar.error('Error in handleGetRequests function: ', error)
      return res.status(errCode).send('something-went-wrong')
    }
  },
}

const allFieldsRequiredMsg = {
  message: 'all form fields are required, some were missing',
  code: 400,
}

const clientIdRequiredMsg = {
  message: 'client uuid is required, was not provided',
  code: 400,
}

const failedToCreateMsg = {
  message: 'failed to create request',
  code: 500,
}

const getRequestsFailedMsg = {
  message: 'failed to get all requests',
  code: 500,
}
