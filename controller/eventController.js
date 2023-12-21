const { ObjectId } = require('mongodb')
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
            if (req.files) {
                if (req.body.fileLength == 2) {
                    const event = await new Event({ ...req.body, image: req.files[0].filename, largeImage: req.files[1].filename })
                    event.save()
                    res.send({ success: true, event })
                } else if (req.body.fileLength == 1) {
                    const event = await new Event({ ...req.body, image: req.files[0].filename })
                    event.save()
                    res.send({ success: true, event })
                }
            } else {
                res.send({ success: false, message: 'image field is required' })
            }
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async getGeneralEvents(req, res) {
        await Session.find()
            .populate('eventId')
            .then(events => {
                if (events?.length) {
                    const generalEvents = events?.filter(e => e.eventId?.generalEvent)
                    res.send({ success: true, events: generalEvents })
                } else {
                    res.send({ success: true, events })
                }
            })
            .catch(err => {
                res.send({ success: false, err })
            })
    }

    static async getTopEvents(req, res) {
        await Event.find({ topEvent: true })
            .populate('sponsors')
            .populate({
                path: 'category',
                populate: { path: 'subcategories' }
            })
            .populate('subcategories')
            .populate({
                path: 'sessions',
                populate: { path: 'hallId' }
            })
            .then(events => {
                res.send({ success: true, events })
            })
            .catch(err => {
                res.send({ success: false, err })
            })
    }

    static async randomEvents(req, res) {
        const itemsPerPage = 12
        const totalEvents = await Event.countDocuments()
        const currentPage = parseInt(req.query.currentPage) || 1
        const totalPages = Math.ceil(totalEvents / itemsPerPage)
        const hasNextPage = currentPage < totalPages

        const allEvents = await Event.find()
            .populate('sponsors')
            .populate('subcategories')
            .populate({ path: 'sessions', populate: { path: 'hallId' } })
            .populate({
                path: 'category',
                // populate: { path: 'subcategories' }
            })
        // const shuffledEvents = shuffleArray(allEvents)
        // const randomEvents = shuffledEvents.slice(0, 12)
        res.send({ success: true, allEvents, currentPage, totalPages, hasNextPage })
    }

    static async getAllEvents(req, res) {
        let filter = {}
        if (req?.body?.date?.startDate && req?.body?.date?.endDate) {
            const startDate = new Date(req.body.date.startDate)
            const endDate = new Date(req.body.date.endDate)
            if (startDate.toDateString() === endDate.toDateString()) {
                // When startDate and endDate are the same, create a range for the entire day
                endDate.setDate(endDate.getDate() + 1) // Increment the endDate to the next day
            }
            filter = {
                date: {
                    $gte: startDate,
                    $lte: endDate,
                }
            }
        } else if (req?.body?.date?.startDate) {
            const startDate = new Date(req.body.date.startDate)
            filter = {
                date: {
                    $gte: startDate,
                }
            }
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
                res.send({ success: true, events, currentPage, totalPages, hasNextPage })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async getAllSessionEvents(req, res) {
        await Event.find()
            .then(events => {
                res.send({ success: true, events })
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
            .populate('category')
            .then(async event => {
                const recomended = await Event.find({ category: { $in: event[0].category } })
                    .populate('sponsors')
                    .populate('subcategories')
                    .populate('sessions')
                    .populate('category')
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
                const filteredRecomended = recomended.filter(e => !e._id?.toString().includes(req.params.id))
                res.send({ success: true, event: event[0], recomended: filteredRecomended, sessions })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async search(req, res) {
        const query = {
            $or: [
                { title: { $regex: `^${req.body.search}`, $options: 'i' } },
                { title_en: { $regex: `^${req.body.search}`, $options: 'i' } },
                { title_ru: { $regex: `^${req.body.search}`, $options: 'i' } },
            ]
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
            if (req.body.fileLength == 3) {
                event.image = req.files[0]?.filename
                event.largeImage = req.files[1]?.filename
            } else if (req.body.fileLength == 2) {
                event.largeImage = req.files[0]?.filename
            } else if (req.body.fileLength == 1) {
                event.image = req.files[0]?.filename
            }

            if (req.body.title) event.title = req.body.title
            if (req.body.title_en) event.title_en = req.body.title_en
            if (req.body.title_ru) event.title_ru = req.body.title_ru
            if (req.body.topEvent) event.topEvent = req.body.topEvent
            if (req.body.generalEvent) event.generalEvent = req.body.generalEvent
            event.description = req.body.description
            event.description_en = req.body.description_en
            event.description_ru = req.body.description_ru
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
        const valid = await Event.find()
        res.send({ valid: valid[0] })
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
            await Session.findOneAndDelete({ eventId: req.body.id })
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async filterEvents(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            let filter = {}
            if (req.body.date.startDate && req.body.date.endDate) {
                const startDate = new Date(req.body.date.startDate)
                const endDate = new Date(req.body.date.endDate)
                if (startDate.toDateString() === endDate.toDateString()) {
                    // When startDate and endDate are the same, create a range for the entire day
                    endDate.setDate(endDate.getDate() + 1) // Increment the endDate to the next day
                }
                filter = {
                    date: {
                        $gte: startDate,
                        $lte: endDate,
                    }
                }
            } else if (req.body.date.startDate) {
                const startDate = new Date(req.body.date.startDate)
                filter = {
                    date: {
                        $gte: startDate,
                    }
                }
            }

            const itemsPerPage = 21
            const totalEvents = await Event.countDocuments(filter)
            const currentPage = parseInt(req.query.currentPage) || 1
            const totalPages = Math.ceil(totalEvents / itemsPerPage)
            const hasNextPage = currentPage < totalPages

            const sessions = await Session.find(filter)
                .populate({
                    path: 'eventId',
                    populate: { path: 'sponsors' },
                })
                .populate({
                    path: 'eventId',
                    populate: { path: 'category' },
                })
                .populate({
                    path: 'eventId',
                    populate: { path: 'subcategories' },
                })
                .populate('hallId')

            let eventsToShow = []
            sessions?.forEach(session => {
                if (req.body.subcategory.includes('all')) {
                    eventsToShow.push(session)
                } else {
                    if (req.body.subcategory && session?.eventId?.subcategories?._id?.toHexString() == req.body.subcategory) {
                        eventsToShow.push(session)
                    } else if (!req.body.subcategory && session?.eventId?.category?._id?.toHexString() == req.body.category) {
                        eventsToShow.push(session)
                    }
                }
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