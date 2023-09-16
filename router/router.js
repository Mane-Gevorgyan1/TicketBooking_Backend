const express = require("express")
const router = express.Router()
const TicketController = require("../controller/ticketController")
const { body, query, param } = require('express-validator')
const EventController = require("../controller/eventController")

/** Multer */
const multer = require('multer')
const CategoryController = require("../controller/categoryController")
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

/* Ticket Controller */
router.post('/setPrice', body(['row', 'seat', 'price', 'amphitheater']).notEmpty().escape(), TicketController.setPrice)
router.get('/getSeats', TicketController.getSeatDetails)
router.patch('/changePrice', body(['row', 'seat', 'price', 'amphitheater']).notEmpty().escape(), TicketController.changePrice)
router.patch('/changeAvailability', body(['row', 'seat', 'availability', 'amphitheater']).notEmpty().escape(), TicketController.changeAvailability)
// router.post('/create-checkout-session', TicketController.checkout)

/* Event Controller */
router.post('/createEvent', upload.single('image'), body([
    'title', 'location', 'date', 'priceStart', 'priceEnd', 'topEvent',
    'generalEvent', 'category', 'subcategory', 'place', 'hall', 'genre', 'description'
]).notEmpty().escape(), EventController.createEvent)
router.get('/getGeneralEvents', EventController.getGeneralEvents)
router.get('/getTopEvents', EventController.getTopEvents)
router.get('/randomEvents', EventController.randomEvents)
router.post('/getAllEvents', EventController.getAllEvents)
router.get('/singleEvent/:id', EventController.singleEvent)
router.post('/search', EventController.search)

/* Category Controller */
router.post('/createCategory', body('name').notEmpty().escape(), CategoryController.createCategory)
router.post('/createSubcategory', body(['name', 'categoryId']).notEmpty().escape(), CategoryController.createSubcategory)
router.get('/getCategories', CategoryController.getCategories)

module.exports = router