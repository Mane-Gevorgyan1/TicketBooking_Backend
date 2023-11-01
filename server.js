const express = require('express')
const router = require('./router/router')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const db = require('./model/model')
const session = require('express-session')
const app = express()

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'TicketsBooking'
  })
  .then(() => {
    console.log('--->>> Database Connected <<<---')
  })
  .catch((err) => {
    console.log('--->>> Database Disconnected <<<---')
    console.log(err)
    process.exit()
  })

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
}

app.use(cookieParser('secretcode'))
app.use(cors(corsOptions))
app.use(session({
  secret: 'aksfskldgfjskfkjhb',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 99999999999999 }
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*') // Allow requests from any origin (for development)
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//   next()
// })

app.use('/', router)

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`))