const { Request } = require('./database/models')
const { Op } = require('sequelize')
const moment = require("moment");

module.exports = {
  handleNewSongRequest: async (req, res) => {
    try {
      const { songName, artistName, requestReason, requesterClientId } = req.body
      const fiveMinutesAgo = moment().subtract(5, 'minutes').toDate();
      if (!requesterClientId) {
        throw clientIdRequiredMsg
      }
      if (!songName || !artistName || !requestReason) {
        throw allFieldsRequiredMsg
      }

      const clientRequestCount = await Request.count({
        where: {
          requester_client_id: requesterClientId,
          createdAt: {
            [Op.gte]: fiveMinutesAgo, // Greater than or equal to the timestamp of 5 minutes ago
          },
        },
      });
      if (clientRequestCount > 2) {
        throw tooManyRequestsMsg
      }
      
      // Call the database for creation
      const newRequest = await Request.create({
        requester_client_id: requesterClientId,
        song_name: songName,
        artist_name: artistName,
        request_reason: requestReason,
        is_bookmarked: false,
        is_played: false,
        is_disliked: false,
        is_soft_deleted: false
      })
      if (!newRequest) {
        throw failedToCreateMsg
      }
      res.status(200).send(newRequest)
    } catch (error) {
      const errCode = error?.code || 500
      const errBody = error?.message ? error : 'Server-side error'
      console.error(error)
      return res.status(errCode).send(errBody)
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
      const errBody = error?.message ? error : 'Server-side error'
      return res.status(errCode).send(errBody)
    }
  },
}

const allFieldsRequiredMsg = {
  message: 'all-fields-are-required',
  code: 400,
}

const clientIdRequiredMsg = {
  message: 'client-id-is-required',
  code: 400,
}

const failedToCreateMsg = {
  message: 'all-fields-are-required',
  code: 500,
}

const getRequestsFailedMsg = {
  message: 'failed-to-get-all-requests',
  code: 500,
}

const tooManyRequestsMsg = {
  message: 'too-many-requests-please-wait',
  code: 200
}
