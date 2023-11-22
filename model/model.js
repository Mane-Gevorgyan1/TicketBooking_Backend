const dbConfig = require('../config/dbConfig.js')

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url
db.ticket = require('./ticket.js')(mongoose)
db.event = require('./event.js')(mongoose)
db.category = require('./category.js')(mongoose)
db.subcategory = require('./subcategory.js')(mongoose)
db.sponsor = require('./sponsor.js')(mongoose)
db.hall = require('./hall.js')(mongoose)
db.session = require('./session.js')(mongoose)
db.ad = require('./ad.js')(mongoose)
db.feedback = require('./feedback.js')(mongoose)
db.user = require('./user.js')(mongoose)
db.returnedTickets = require('./returnedTickets.js')(mongoose)
db.currentTicket = require('./currentTicket.js')(mongoose)
db.telcellData = require('./telcellLog.js')(mongoose)

module.exports = db