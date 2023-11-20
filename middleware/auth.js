const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    if (req?.headers?.origin?.includes('https://arsen.shinetickets.com/')) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token === null || token === undefined) return res.send({ success: false, message: 'no token' })

        // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, ((err, user) => {
        jwt.verify(token, '825656ca2c2a02b581028dbe47797afb08e181630d35875fb998b4e757efb7395af3b00426d81a97e27d5d710051526af64447fb09eca3bc239e9a787f4946ad', ((err, user) => {
            if (err) return res.send({ success: false, message: 'Token is not valid', err })

            req.user = user
            next()
        }))
    }
    next()
}

module.exports = { authenticateToken }