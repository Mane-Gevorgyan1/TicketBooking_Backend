const db = require('../model/model')
const Session = db.session
const Event = db.event
const { validationResult } = require('express-validator')

// const result = validationResult(req)
// if (result.isEmpty()) { } else {
//     res.send({ errors: result.array() })
// }

class SessionController {

    static async createSession(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            const session = await new Session({ ...req.body })
            await Event.findByIdAndUpdate(req.body.eventId, { $push: { sessions: session._id } })
            session.save()
                .then(session => {
                    res.send({ success: true, session })
                })
                .catch(error => {
                    res.send({ success: false, error })
                })

        } else {
            res.send({ errors: result.array() })
        }
    }

    static async getAllSessions(req, res) {
        await Session.find()
            .populate('eventId')
            .populate('hallId')
            .then(sessions => {
                res.send({ success: true, sessions })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async singleSession(req, res) {
        await Session.findById(req.params.id)
            .populate('hallId')
            .populate('eventId')
            .then(session => {
                res.send({ success: true, session })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async deleteSession(req, res) {
        await Session.findOneAndDelete({ _id: req.body.id })
            .then(() => {
                res.send({ success: true, message: 'Session Deleted' })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

}

module.exports = SessionController