const mysql = require('mysql')
const {db:dbConfig} = require('../config')

const connection = mysql.createConnection(dbConfig)
module.exports = connection