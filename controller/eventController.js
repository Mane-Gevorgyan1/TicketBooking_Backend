const db = require('../model/model')
const Event = db.event
const Genre = db.genre
const Sponsor = db.sponsor
const Hall = db.hall
const Session = db.session
const { validationResult } = require('express-validator')

// const result = validationResult(req)
// if (result.isEmpty()) {
// } else {
//     res.send({ errors: result.array() })
// }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        [array[i], array[j]] = [array[j], array[i]] // Swap elements
    }
    return array
}

class EventController {

    static async createEvent(req, res) {
        const result = validationResult(req);
        if (result.isEmpty()) {
            if (req.file) {
                const event = await new Event({ ...req.body, image: req.file.filename })
                event.save(event)
                    .then(() => {
                        res.send({ sucess: true, event })
                    })
                    .catch((err) => {
                        res.send({ success: false, err })
                    })
            } else {
                res.send({ success: false, message: 'image field is required' })
            }
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async getGeneralEvents(req, res) {
        const result = validationResult(req)
        await Event.find({ generalEvent: true })
            .then(events => {
                res.send({ success: true, events })
            })
            .catch(err => {
                res.send({ success: false, err })
            })
    }

    static async getTopEvents(req, res) {
        const result = validationResult(req)
        await Event.find({ topEvent: true })
            .then(events => {
                res.send({ success: true, events })
            })
            .catch(err => {
                res.send({ success: false, err })
            })
    }

    static async randomEvents(req, res) {
        const allEvents = await Event.find()
        const shuffledEvents = shuffleArray(allEvents)
        const randomEvents = shuffledEvents.slice(0, 12)
        res.send({ success: true, randomEvents })
    }

    static async getAllEvents(req, res) {
        let filter = {}
        if (req.body.place && req.body.startDate && req.body.endDate && req.body.category) {
            filter = {
                place: req.body.place,
                date: {
                    $gte: req.body.startDate,
                    $lte: req.body.endDate,
                },
                category: req.body.category,
            }
        } else if (req.body.place) {
            filter = {
                place: req.body.place,
            }
        } else if (req.body.startDate && req.body.endDate) {
            filter = {
                date: {
                    $gte: req.body.startDate,
                    $lte: req.body.endDate,
                },
            }
        } else if (req.body.category) {
            filter = { category: req.body.category }
        }

        const itemsPerPage = 21
        const totalEvents = await Event.countDocuments(filter)
        const currentPage = parseInt(req.query.currentPage) || 1
        const totalPages = Math.ceil(totalEvents / itemsPerPage)
        const hasNextPage = currentPage < totalPages

        await Event.find(filter)
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .then(events => {
                res.send({ success: true, events, totalPages, hasNextPage })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async singleEvent(req, res) {
        await Event.find({ _id: req.params.id })
            .then(async event => {
                const recomended = await Event.find({ category: { $in: event[0].category } }).limit(10)
                res.send({ success: true, event: event[0], recomended })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async search(req, res) {
        const query = {
            title: { $regex: `^${req.body.search}`, $options: 'i' }
        }

        await Event.find(query)
            .then(events => {
                res.send({ success: true, events })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async editEvent(req, res) {
        //     let body = {}
        //     if (req.file) {
        //         body = { ...req.body, image: req.file?.filename }
        //     } else {
        //         body = { ...req.body }
        //     }
        //     await Event.findOneAndUpdate({ _id: req.body.id }, body)
        //         .then(() => {
        //             res.send({ success: true, message: 'Update Successful' })
        //         })
        //         .catch(err => {
        //             res.send({ success: false, err })
        //         })
    }

    static async createGenre(req, res) {
        const genre = await new Genre({ name: req.body.name })
        genre.save(genre)
            .then(() => {
                res.send({ sucess: true, genre })
            })
            .catch((err) => {
                res.send({ success: false, err })
            })
    }

    static async createSponsor(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            if (req.file) {
                const sponsor = await new Sponsor({ ...req.body, image: req.file.filename })
                sponsor.save(sponsor)
                    .then(() => {
                        res.send({ sucess: true, sponsor })
                    })
                    .catch((err) => {
                        res.send({ success: false, err })
                    })
            } else {
                res.send({ success: false, message: 'image field is required' })
            }
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async createHall(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            if (req.file) {
                const hall = await new Hall({ ...req.body, image: req.file.filename })
                hall.save(hall)
                    .then(() => {
                        res.send({ sucess: true, hall })
                    })
                    .catch((err) => {
                        res.send({ success: false, err })
                    })
            } else {
                res.send({ success: false, message: 'image field is required' })
            }
        } else {
            res.send({ errors: result.array() })
        }
    }

    // EXAMPLE OF GETING AN EVENT WITH EVERYTHING
    // static async GetAllEvetsWithEverything(req, res) {
    //     await Event.find()
    //         .populate('genres')
    //         .populate('sponsors')
    //         .populate({
    //             path: 'category',
    //             populate: { path: 'subcategories' }
    //         })
    //         .then(event => {
    //             res.send({ event })
    //         })
    //         .catch(error => {
    //             res.send({ error })
    //         })
    // }

}

module.exports = EventController