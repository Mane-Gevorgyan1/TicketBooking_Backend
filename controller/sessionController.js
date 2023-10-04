const db = require('../model/model')
const Session = db.session
const Hall = db.hall
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
            const halls = await Hall.find({ _id: req.body.hallId })
            let seats = halls[0].seats

            req.body.sections.forEach(section => {
                seats.forEach(seat => {
                    if (seat.section == section.section) {
                        seat.value = section.value
                    }
                })
            })

            const session = await Session.find({ eventId: req.body.eventId, hallId: req.body.hallId })
            if (session) {
                console.log('session ------->>>>>>>', session);
                session.seats = seats
                session.save()
            } else {
                const newSession = await new Session({ ...req.body, seats })
                newSession.save()
            }



            const event = await Event.findByIdAndUpdate(req.body.eventId, { sessions: session }).populate('sessions')
            // console.log('event', event);
            // // , { $push: { sessions: session } });
            // req.body.sections.forEach(section => {
            //     event.sessions.forEach(event => {
            //         if (section.section === event.section) {
            //             event.value = section.value
            //         }
            //     })
            // })

            console.log('session --->>>', session);

            // event.sessions = seats

            event.save()
                .then(() => {
                    res.send({ success: true, event })
                })
                .catch(error => {
                    res.send({ success: false, message: 'something went wrong while trying to update', error })
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

}

module.exports = SessionController