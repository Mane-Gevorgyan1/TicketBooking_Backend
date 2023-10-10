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

            req.body.eventId?.forEach(async sessionEventId => {
                await Event.findByIdAndUpdate(sessionEventId, { $push: { sessions: session._id } })
            })

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

}

module.exports = SessionController