const express = require("express")
const router = express.Router()
const { body } = require('express-validator')
const EventController = require("../controller/eventController")
const TicketController = require("../controller/ticketController")
const CategoryController = require("../controller/categoryController")

/** Multer */
const multer = require('multer')
const GenreController = require("../controller/genreController")
const SponsorController = require("../controller/sponsorController")
const HallController = require("../controller/hallController")
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
    'title', 'topEvent', 'generalEvent', 'description',
    'category', 'sponsors',
    // 'sessions', 'subcategory', 'genres'
]).notEmpty().escape(), EventController.createEvent)
router.patch('/editEvent', upload.single('image'), body([
    'id', 'title', 'topEvent', 'generalEvent', 'description',
    'category', 'genres', 'sponsors',
    // 'sessions', 'subcategory'
]).notEmpty().escape(), EventController.editEvent)
router.get('/getGeneralEvents', EventController.getGeneralEvents)
router.get('/getTopEvents', EventController.getTopEvents)
router.get('/randomEvents', EventController.randomEvents)
router.post('/getAllEvents', EventController.getAllEvents)
router.post('/getCategoryEvents', body(['categoryId']).notEmpty().escape(), EventController.getCategoryEvents)
router.get('/singleEvent/:id', EventController.singleEvent)
router.post('/search', EventController.search)

// Genre Controller
router.post('/createGenre', body(['name']).notEmpty().escape(), GenreController.createGenre)
router.get('/getAllGenres', GenreController.getAllGenres)
router.post('/filterByGenre', body(['genreId']).notEmpty().escape(), GenreController.filterByGenre)

// Sponsor Controller
router.post('/createSponsor', upload.single('image'), body(['name']).notEmpty().escape(), SponsorController.createSponsor)
router.get('/getAllSponsors', SponsorController.getAllSponsors)

// Hall Controller
router.post('/createHall', upload.single('image'), body(['location', 'place', 'hall']).notEmpty().escape(), HallController.createHall)
router.get('/getAllHalls', HallController.getAllHalls)

// Category Controller
router.post('/createCategory', body('name').notEmpty().escape(), CategoryController.createCategory)
router.patch('/editCategory', body(['id', 'name']).notEmpty().escape(), CategoryController.editCategory)
router.delete('/deleteCategory', body(['id']).notEmpty().escape(), CategoryController.deleteCategory)
router.post('/createSubcategory', body(['name', 'categoryId']).notEmpty().escape(), CategoryController.createSubcategory)
router.get('/getCategories', CategoryController.getCategories)
router.post('/getSubcategories', body('id').notEmpty().escape(), CategoryController.getSubcategories)

module.exports = router