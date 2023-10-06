const db = require('../model/model')
const Event = db.event
const Session = db.session
const Hall = db.hall
const { validationResult } = require('express-validator')

// const result = validationResult(req)
// if (result.isEmpty()) {
// } else {
//     res.send({ errors: result.array() })
// }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i]  // Store the value at array[i]
        array[i] = array[j]    // Swap elements
        array[j] = temp        // Restore the value at array[j]
    }
    return array
}

class EventController {

    static async createEvent(req, res) {
        const result = validationResult(req);
        if (result.isEmpty()) {
            if (req.file) {
                const event = await new Event({ ...req.body, image: req.file.filename })
                event.save()
                res.send({ sucess: true, event })
            } else {
                res.send({ success: false, message: 'image field is required' })
            }
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async getGeneralEvents(req, res) {
        await Event.find({ generalEvent: true })
            .populate('sponsors')
            .populate('subcategories')
            .populate({
                path: 'sessions',
                populate: { path: 'hallId' }
            })
            .populate({
                path: 'category',
                // populate: { path: 'subcategories' }
            })
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
            .populate('subcategories')
            .populate('sponsors')
            .populate('sessions')
            .populate({
                path: 'category',
                populate: { path: 'subcategories' }
            })
            .then(events => {
                res.send({ success: true, events })
            })
            .catch(err => {
                res.send({ success: false, err })
            })
    }

    static async randomEvents(req, res) {
        const allEvents = await Event.find()
            .populate('sponsors')
            .populate('subcategories')
            .populate('sessions')
            .populate({
                path: 'category',
                // populate: { path: 'subcategories' }
            })
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
            .populate('sponsors')
            .populate('subcategories')
            .populate('sessions')
            // .populate('halls')
            .populate({
                path: 'category',
                // populate: { path: 'subcategories' }
            })
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .then(events => {
                res.send({ success: true, events, totalPages, hasNextPage })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async getCategoryEvents(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            const itemsPerPage = 21
            const totalEvents = await Event.countDocuments()
            const currentPage = parseInt(req.query.currentPage) || 1
            const totalPages = Math.ceil(totalEvents / itemsPerPage)
            const hasNextPage = currentPage < totalPages

            const allEvents = await Event.find()
                .populate('sponsors')
                .populate('subcategories')
                .populate('sessions')
                .populate({
                    path: 'category',
                    // populate: { path: 'subcategories' }
                })
                .skip((currentPage - 1) * itemsPerPage)
                .limit(itemsPerPage)

            let eventsToShow = []
            let categoriedEvents = []
            let sessionHall = {}
            let mySessions = []
            allEvents?.forEach(event => {
                if (event.category?._id == req.body.categoryId) {
                    // categoriedEvents.push(event)
                    categoriedEvents.push({
                        validity: event?.validity,
                        _id: event?._id,
                        image: event?.image,
                        title: event?.title,
                        topEvent: event?.topEvent,
                        generalEvent: event?.generalEvent,
                        description: event?.description,
                        category: event?.category,
                        subcategories: event?.subcategories,
                        sponsors: event?.sponsors,
                        sessions: mySessions,
                    })
                }
                event?.sessions.forEach(async session => {
                    const newSession = await Session.findById(session.id)
                    if (newSession) {
                        const hall = await Hall.findById(newSession?.hallId)
                        if (hall) {
                            // sessionHall = hall
                            sessionHall = {
                                _id: hall?._id,
                                image: hall?.image,
                                country: hall?.country,
                                location: hall?.location,
                                place: hall?.place,
                                hall: hall?.hall,
                                eventId: hall?.eventId
                            }
                        } else {
                            // no hall 
                            sessionHall = {}
                        }
                        mySessions.push({
                            _id: newSession?._id,
                            eventId: newSession?.eventId,
                            hallId: newSession?.hallId,
                            priceStart: newSession?.priceStart,
                            priceEnd: newSession?.priceEnd,
                            date: newSession?.date,
                            time: newSession?.time,
                        })
                    } else {
                        // no sessions ?
                    }
                })
            })

            let subEvents = []
            categoriedEvents?.forEach(event => {
                if (event?.subcategories.includes(req.body.subcategoryId)) {
                    // subEvents.push(event)
                    subEvents.push({
                        validity: event?.validity,
                        _id: event?._id,
                        image: event?.image,
                        title: event?.title,
                        topEvent: event?.topEvent,
                        generalEvent: event?.generalEvent,
                        description: event?.description,
                        category: event?.category,
                        subcategories: event?.subcategories,
                        sponsors: event?.sponsors,
                        halls: sessionHall,
                        sessions: mySessions,
                    })
                }
            })

            if (req.body.subcategoryId) {
                eventsToShow = subEvents
            } else {
                eventsToShow = categoriedEvents
            }

            res.send({ success: true, events: eventsToShow, sessionHall, totalPages, hasNextPage })

        } else {
            res.send({ errors: result.array() })
        }
    }

    static async singleEvent(req, res) {
        await Event.find({ _id: req.params.id })
            .populate('sponsors')
            .populate('subcategories')
            .populate({ path: 'sessions', populate: { path: 'hallId' } })
            .populate({
                path: 'category',
                // populate: { path: 'subcategories' }
            })
            .then(async event => {
                const recomended = await Event.find({ category: { $in: event[0].category } })
                    .populate('sponsors')
                    .populate('subcategories')
                    .populate('sessions')
                    .populate({
                        path: 'category',
                        // populate: { path: 'subcategories' }
                    })
                    .limit(10)
                let sessions = []
                event[0]?.sessions?.forEach(async session => {
                    const newSession = await Session.findById(session._id)
                    sessions.push({
                        _id: newSession?._id,
                        eventId: newSession?.eventId,
                        hallId: newSession?.hallId,
                        priceStart: newSession?.priceStart,
                        priceEnd: newSession?.priceEnd,
                        date: newSession?.date,
                        time: newSession?.time,
                    })
                })
                res.send({ success: true, event: event[0], recomended, sessions })
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
            .populate('sponsors')
            .populate('subcategories')
            .populate({
                path: 'category',
                populate: { path: 'subcategories' }
            })
            .then(events => {
                res.send({ success: true, events })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async editEvent(req, res) {
        try {
            const event = await Event.findById(req.body.id)
            if (!event) {
                return res.send({ success: false, message: 'Event not found' });
            }
            if (req.file) {
                event.image = req.file.filename
            }

            if (req.body.title) event.title = req.body.title
            if (req.body.topEvent) event.topEvent = req.body.topEvent
            if (req.body.generalEvent) event.generalEvent = req.body.generalEvent
            if (req.body.description) event.description = req.body.description
            if (req.body.category) event.category = req.body.category
            if (req.body.subcategories) event.subcategories = req.body.subcategories

            if (req.body.sponsors) {
                event.sponsors = []
                req.body.sponsors.forEach(sponsorId => {
                    event.sponsors.push(sponsorId)
                })
            }

            await event.save()
                .then(() => {
                    res.send({ success: true, message: 'Updated' });
                })
                .catch(error => {
                    res.send({ success: false, error })
                })
        } catch (error) {
            res.status(500).send({ success: false, message: 'Error while updating', error });
        }
    }

    static async eventValidity(req, res) {
        const valid = await Event.findById('6515818a973806513560ccab')
        res.send({ valid })
    }

    static async deleteEvent(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            await Event.findOneAndDelete({ _id: req.body.id })
                .then(() => {
                    res.send({ success: true, message: 'Event Deleted' })
                })
                .catch(error => {
                    res.send({ success: false, error })
                })
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async filterEvents(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            let filter = {}
            if (req.body.startDate && req.body.endDate) {
                const startDate = new Date(req.body.startDate)
                const endDate = new Date(req.body.endDate)
                if (startDate.toDateString() === endDate.toDateString()) {
                    // When startDate and endDate are the same, create a range for the entire day
                    endDate.setDate(endDate.getDate() + 1) // Increment the endDate to the next day
                }
                filter = {
                    date: {
                        $gte: startDate,
                        $lt: endDate,
                    }
                }
            }

            const itemsPerPage = 21
            const totalEvents = await Event.countDocuments(filter)
            const currentPage = parseInt(req.query.currentPage) || 1
            const totalPages = Math.ceil(totalEvents / itemsPerPage)
            const hasNextPage = currentPage < totalPages

            const sessions = await Session.find(filter).populate({
                path: 'eventId',
            })
                .populate('hallId')

            let eventsToShow = []
            sessions?.forEach(session => {
                session?.eventId?.forEach(event => {
                    if (event.category == req.body.category && event.subcategories == req.body.subcategory) {
                        eventsToShow.push(session)
                    }
                })
            })
            if (req.body.hall) {
                eventsToShow = eventsToShow?.filter(session => session?.hallId?._id == req.body.hall)
            }

            res.send({ success: true, sessions: eventsToShow, totalPages, hasNextPage })
        } else {
            res.send({ errors: result.array() })
        }
    }

}

module.exports = EventController