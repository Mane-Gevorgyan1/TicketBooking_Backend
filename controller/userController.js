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
                // const refreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

                user.accessToken = accessToken
                // user.refreshToken = refreshToken
                user.save()

                res.send({ success: true, accessToken })
            } else {
                res.send({ success: false, message: 'Wrong password' })
            }
        } else {
            res.send({ success: false, message: 'User not found' })
        }

    }

    static async getSingleUser(req, res) {
        const token = req.headers.authorization.split(' ')[1]
        await User.find({ accessToken: token })
            .then(user => {
                res.send({ success: true, user: user[0] })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async getAllUsers(req, res) {
        const token = req.headers.authorization.split(' ')[1]
        await User.find()
            .then(users => {
                if (users.length) {
                    const moderators = users.filter(user => user.accessToken != token)
                    res.send({ success: true, moderators })
                }
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async changeUserSettings(req, res) {
        const user = await User.findById(req.body.id)
        if (user) {
            if (req.body.hasOwnProperty('accessToEvents')) {
                user.accessToEvents = req.body.accessToEvents
            }
            if (req.body.hasOwnProperty('accessToCategories')) {
                user.accessToCategories = req.body.accessToCategories
            }
            if (req.body.hasOwnProperty('accessToSponsors')) {
                user.accessToSponsors = req.body.accessToSponsors
            }
            if (req.body.hasOwnProperty('accessToHalls')) {
                user.accessToHalls = req.body.accessToHalls
            }
            if (req.body.hasOwnProperty('accessToSessions')) {
                user.accessToSessions = req.body.accessToSessions
            }
            if (req.body.hasOwnProperty('accessToAds')) {
                user.accessToAds = req.body.accessToAds
            }
            if (req.body.hasOwnProperty('accessToFeedback')) {
                user.accessToFeedback = req.body.accessToFeedback
            }
            if (req.body.hasOwnProperty('accessToModerators')) {
                user.accessToModerators = req.body.accessToModerators
            }
            if (req.body.hasOwnProperty('name')) {
                user.name = req.body.name
            }
            await user.save()
            res.send({ success: true })
        } else {
            res.send({ success: false, message: 'user not found' })
        }
    }

    static async deleteUser(req, res) {
        await User.findOneAndDelete({ _id: req.body.id })
            .then(() => {
                res.send({ success: true })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    // static async refreshToken(req, res) {
    //     if (req.body.refreshToken == null) res.send({ success: false, message: 'No token' })
    //     const user = await User.find({ refreshToken: req.body.refreshToken })
    //     if (user?.length) {
    //         jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    //             if (err) res.send({ success: false, message: "No Auth" })
    //             const accessToken = generateAccessToken({ username: user.username })
    //             res.send({ accessToken, message: 'Refreshed Access Token' })
    //         })
    //     } else {
    //         res.send({ success: false, message: 'No access' })
    //     }
    // }

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