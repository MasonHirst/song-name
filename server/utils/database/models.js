const { DataTypes, Sequelize } = require('sequelize')
const db = require('./db-config')

const Request = db.define('request', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  requester_client_id: {
    type: DataTypes.STRING({ length: 40 }),
    allowNull: false
  },
  song_name: {
    type: DataTypes.STRING({ length: 60 }),
    allowNull: false,
  },
  artist_name: {
    type: DataTypes.STRING({ length: 60 }),
    allowNull: false,
  },
  request_reason: {
    type: DataTypes.STRING({ length: 400 }),
    allowNull: true,
  },
  is_bookmarked: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  is_played: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  is_disliked: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  is_soft_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
})

module.exports = {
  Request
}