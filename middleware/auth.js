const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) return res.send({ success: false, message: 'no token' })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, ((err, user) => {
        if (err) return res.send({ success: false, message: 'Token is not valid', err })

        req.user = user
        next()
    }))
}

module.exports = { authenticateToken }