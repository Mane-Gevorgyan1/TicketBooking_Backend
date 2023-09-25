const express = require("express")
const router = express.Router()
const { body } = require('express-validator')
const EventController = require("../controller/eventController")
const TicketController = require("../controller/ticketController")
const CategoryController = require("../controller/categoryController")

/** Multer */
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


// Ticket Controller
router.post('/setSeat', body(['row', 'seat', 'price', 'amphitheater', 'lodge', 'seatColor']).notEmpty().escape(), TicketController.setSeat)
router.post('/singleTicket', body('ticketNumber').notEmpty().escape(), TicketController.singleTicket)
router.patch('/changePrice', body(['row', 'seat', 'price', 'amphitheater']).notEmpty().escape(), TicketController.changePrice)
router.patch('/returnTicket', body('ticketNumber').notEmpty().escape(), TicketController.returnTicket)
router.get('/getSeats', TicketController.getSeatDetails)
router.patch('/changeAvailability', body(['row', 'seat', 'availability', 'amphitheater']).notEmpty().escape(), TicketController.changeAvailability)
// router.patch('/buyTicket', body([
//     // ticketDetails = [{'row', 'seat', 'amphitheater', 'lodge'}],
//     'ticketDetails', 'name', 'email', 'phone',
//     'notes', 'delivery', 'paymentMethod'
// ]).notEmpty().escape(), TicketController.buyTicket)


// Event Controller
router.post('/createEvent', upload.single('image'), body([
    'title', 'date', 'priceStart', 'priceEnd', 'topEvent',
    'generalEvent', 'category', 'genres', 'description',
    'halls', 'sessions',
    // 'subcategory',
]).notEmpty().escape(), EventController.createEvent)
router.patch('/editEvent', upload.single('image'), body([
    // 'id', 'title', 'location', 'date', 'priceStart', 'priceEnd', 'topEvent',
    // 'generalEvent', 'category', 'subcategory', 'place', 'hall', 'genre', 'description'
]).notEmpty().escape(), EventController.editEvent)
router.get('/getGeneralEvents', EventController.getGeneralEvents)
router.get('/getTopEvents', EventController.getTopEvents)
router.get('/randomEvents', EventController.randomEvents)
router.post('/getAllEvents', EventController.getAllEvents)
router.get('/singleEvent/:id', EventController.singleEvent)
router.post('/search', EventController.search)

// router.get('/asd', EventController.asd)
router.post('/createGenre', body(['name']).notEmpty().escape(), EventController.createGenre)
router.post('/createSponsor', upload.single('image'), body(['name']).notEmpty().escape(), EventController.createSponsor)
router.post('/createHall', upload.single('image'), body(['location', 'place', 'hall']).notEmpty().escape(), EventController.createHall)

// Category Controller
router.post('/createCategory', body('name').notEmpty().escape(), CategoryController.createCategory)
router.post('/createSubcategory', body(['name', 'categoryId']).notEmpty().escape(), CategoryController.createSubcategory)
router.get('/getCategories', CategoryController.getCategories)

module.exports = router