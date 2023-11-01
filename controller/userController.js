const db = require('../model/model')
const User = db.user
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function generateAccessToken(user) {
    return jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

class UserController {

    static async createUser(req, res) {
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = await new User({ ...req.body, password: hash })
        user.save()
            .then(() => {
                res.send({ success: true, user })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async login(req, res) {
        const users = await User.find({ username: req.body.username })
        if (users?.length > 0) {
            const user = users[0]
            if (bcrypt.compareSync(req.body.password, user.password)) {
                const accessToken = generateAccessToken(user)
                const refreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

                user.accessToken = accessToken
                user.refreshToken = refreshToken
                user.save()

                res.send({ success: true, user, accessToken, refreshToken })
            } else {
                res.send({ success: false, message: 'Wrong password' })
            }
        } else {
            res.send({ success: false, message: 'User not found' })
        }

    }

    static async getUsers(req, res) {
        console.log(req.user);
        await User.find({ username: req.body.username })
            .then(user => {
                res.send({ success: true, user })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async refreshToken(req, res) {
        if (req.body.refreshToken == null) res.send({ success: false, message: 'No token' })
        const user = await User.find({ refreshToken: req.body.refreshToken })
        if (user?.length) {
            jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) res.send({ success: false, message: "No Auth" })
                const accessToken = generateAccessToken({ username: user.username })
                res.send({ accessToken, message: 'Refreshed Access Token' })
            })
        } else {
            res.send({ success: false, message: 'No access' })
        }
    }

    static async logout(req, res) {
        const users = await User.find({ refreshToken: req.body.refreshToken })
        if (users.length > 0) {
            const user = users[0]
            user.accessToken = null
            user.refreshToken = null
            user.save()
                .then(user => {
                    res.send({ success: true, user: user, message: 'User logged out' })
                })
                .catch(error => {
                    res.send({ success: false, error })
                })
        } else {
            res.send({ success: false, message: 'User not found' })
        }
    }
}

module.exports = UserController



// henc usery login a linum, stanum a accessToken yev refreshToken, voronq pahvum en browserum  (localStorage, session, cookie)
// amen harcman jamanak header-ov uxarkvum a Bearer token (accessToken)
// app.jsx-i mej useEffect-i mej stugum em accessToken-y valid a te che
// ete valid chi, refreshToken api-in em dimum, uxarkum em browserum pahac refreshTokes vor nor accessToken stanam u noric pahem frontum
// ete refreshToken dimeluc chem stanum nor accessToken, petqa logout linel