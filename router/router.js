const express = require("express")
const router = express.Router()
const { body } = require('express-validator')
const EventController = require("../controller/eventController")
const TicketController = require("../controller/ticketController")
const CategoryController = require("../controller/categoryController")
const SponsorController = require("../controller/sponsorController")
const HallController = require("../controller/hallController")
const SessionController = require("../controller/sessionController")
const AdController = require("../controller/adController")
const FeedbackController = require("../controller/feedbackController")
const UserController = require("../controller/userController")
const { authenticateToken } = require("../middleware/auth")

/* Multer */
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        let name = Date.now() + file.originalname
        cb(null, name)
    }
})
const upload = multer({ storage })


router.post('/login', UserController.login)

router.use(authenticateToken)

// Ticket Controller
router.post('/setSeat', body(['row', 'seat', 'price', 'amphitheater', 'lodge', 'seatColor']).notEmpty().escape(), TicketController.setSeat)
router.post('/singleTicket', body('ticketNumber').notEmpty().escape(), TicketController.singleTicket)
router.patch('/changePrice', body(['row', 'seat', 'price', 'amphitheater']).notEmpty().escape(), TicketController.changePrice)
router.get('/getSeats', TicketController.getSeatDetails)
router.post('/buyTicket', TicketController.buyTicket)
router.post('/registerPayment', TicketController.registerPayment)
router.get('/getAllTickets', TicketController.getAllTickets)
router.post('/searchTicket', TicketController.searchTicket)
router.get('/getReturnedTickets', TicketController.getReturnedTickets)
router.delete('/deleteReturnTicket', TicketController.deleteReturnTicket)
router.post('/createCurrentTicket', TicketController.createCurrentTicket)
router.post('/getCurrentTicket', TicketController.getCurrentTicket)
router.post('/telcellData', TicketController.telcellData)
router.post('/getTicketStatus', TicketController.getTicketStatus)

router.patch('/returnTicket', body('ticketNumber').notEmpty().escape(), TicketController.returnTicket)
router.patch('/changeAvailability', body(['row', 'seat', 'availability', 'amphitheater']).notEmpty().escape(), TicketController.changeAvailability)


// Event Controller
router.post('/createEvent', upload.single('image'), body([
    'title', 'topEvent', 'generalEvent', 'category', 'subcategories'
]).notEmpty().escape(), EventController.createEvent)
router.patch('/editEvent', upload.single('image'), body([
    'id', 'title', 'topEvent', 'generalEvent', 'category', 'subcategories'
]).notEmpty().escape(), EventController.editEvent)
router.delete('/deleteEvent', body(['id']).notEmpty().escape(), EventController.deleteEvent)
router.get('/getGeneralEvents', EventController.getGeneralEvents)
router.get('/getTopEvents', EventController.getTopEvents)
router.get('/eventValidity', EventController.eventValidity)
router.get('/randomEvents', EventController.randomEvents)
router.post('/getAllEvents', EventController.getAllEvents)
router.get('/getAllSessionEvents', EventController.getAllSessionEvents)
router.post('/getCategoryEvents', body(['categoryId']).notEmpty().escape(), EventController.getCategoryEvents)
router.get('/singleEvent/:id', EventController.singleEvent)
router.post('/search', EventController.search)
router.post('/filterEvents', EventController.filterEvents)

// Sponsor Controller
router.post('/createSponsor', upload.single('image'), body(['name']).notEmpty().escape(), SponsorController.createSponsor)
router.get('/getAllSponsors', SponsorController.getAllSponsors)
router.delete('/deleteSponsor', body(['id']).notEmpty().escape(), SponsorController.deleteSponsor)


// Hall Controller
router.post('/createHall', upload.single('image'), body(['country', 'location', 'place', 'hall']).notEmpty().escape(), HallController.createHall)
router.get('/getAllHalls', HallController.getAllHalls)
router.get('/singleHall/:id', HallController.singleHall)
router.patch('/editHall/:id', upload.single('image'), HallController.editHall)


// Category Controller
router.post('/createCategory', body('name').notEmpty().escape(), CategoryController.createCategory)
router.get('/getCategories', CategoryController.getCategories)
router.patch('/editCategory', body(['id', 'name']).notEmpty().escape(), CategoryController.editCategory)
router.delete('/deleteCategory', body(['id']).notEmpty().escape(), CategoryController.deleteCategory)
router.post('/createSubcategory', body(['name', 'categoryId']).notEmpty().escape(), CategoryController.createSubcategory)
router.post('/getSubcategories', body('id').notEmpty().escape(), CategoryController.getSubcategories)
router.patch('/editSubcategory', body(['id', 'name']).notEmpty().escape(), CategoryController.editSubcategory)
router.delete('/deleteSubcategory', body(['id']).notEmpty().escape(), CategoryController.deleteSubcategory)


// Sessions
router.post('/createSession', body(['hallId', 'eventId', 'priceStart', 'priceEnd', 'date', 'time', 'price']), SessionController.createSession)
router.get('/getAllSessions', SessionController.getAllSessions)
router.get('/singleSession/:id', SessionController.singleSession)
router.delete('/deleteSession', body(['id']).notEmpty().escape(), SessionController.deleteSession)
router.post('/editSession', SessionController.editSession)


// Ads
router.post('/createMainAd', upload.single('image'), AdController.createMainAd)
router.get('/getAllAds', AdController.getAllAds)
router.get('/getSingleAd/:id', AdController.getSingleAd)
router.patch('/editAd/:id', upload.single('image'), AdController.editAd)
router.delete('/deleteAd/:id', AdController.deleteAd)


// Feedback
router.post('/createFeedback', FeedbackController.createFeedback)
router.get('/getFeedback', FeedbackController.getFeedback)
router.patch('/editFeedback/:id', FeedbackController.editFeedback)


// User
router.post('/createUser', UserController.createUser)
router.get('/getSingleUser', UserController.getSingleUser)
router.get('/getAllUsers', UserController.getAllUsers)
router.post('/logout', UserController.logout)
router.patch('/changeUserSettings', UserController.changeUserSettings)
router.delete('/deleteUser', UserController.deleteUser)


module.exports = router