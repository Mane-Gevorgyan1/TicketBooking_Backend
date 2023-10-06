const db = require('../model/model')
const Session = db.session
const Hall = db.hall
const Event = db.event
const Price = db.price
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

            // const price = await new Price({ price: req.body.price, sessionId: session?._id })

            req.body.eventId?.forEach(async sessionEventId => {
                await Event.findByIdAndUpdate(sessionEventId, { $push: { sessions: session._id } })
            })

            // await Session.findByIdAndUpdate(session._id, { price: price?._id })

            // price.save()
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
        // await Session.find()
        //     .then(sessions => {
        //         const events = await Event.findOneById()
        //         res.send({ success: true, sessions })
        //     })
        //     .catch(error => {
        //         res.send({ success: false, error })
        //     })
    }

    static async getPrice(req, res) {

    }   

}

module.exports = SessionController