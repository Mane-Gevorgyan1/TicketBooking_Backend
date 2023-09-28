const express = require("express")
const router = express.Router()
const { body } = require('express-validator')
const EventController = require("../controller/eventController")
const TicketController = require("../controller/ticketController")
const CategoryController = require("../controller/categoryController")

/** Multer */
const multer = require('multer')
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
    'title', 'topEvent', 'generalEvent', 'description', 'category', 'subcategories', 'sponsors',
    // 'sessions', 'subcategory',
]).notEmpty().escape(), EventController.createEvent)
router.patch('/editEvent', upload.single('image'), body([
    'id', 'title', 'topEvent', 'generalEvent', 'description', 'category', 'subcategories', 'sponsors',
    // 'sessions', 'subcategory'
]).notEmpty().escape(), EventController.editEvent)
router.delete('/deleteEvent', body(['id']).notEmpty().escape(), EventController.deleteEvent)
router.get('/getGeneralEvents', EventController.getGeneralEvents)
router.get('/getTopEvents', EventController.getTopEvents)
router.get('/randomEvents', EventController.randomEvents)
router.post('/getAllEvents', EventController.getAllEvents)
router.post('/getCategoryEvents', body(['categoryId']).notEmpty().escape(), EventController.getCategoryEvents)
router.get('/singleEvent/:id', EventController.singleEvent)
router.post('/search', EventController.search)

// Sponsor Controller
router.post('/createSponsor', upload.single('image'), body(['name']).notEmpty().escape(), SponsorController.createSponsor)
router.get('/getAllSponsors', SponsorController.getAllSponsors)
router.delete('/deleteSponsor', body(['id']).notEmpty().escape(), SponsorController.deleteSponsor)

// Hall Controller
router.post('/createHall', upload.single('image'), body(['location', 'place', 'hall']).notEmpty().escape(), HallController.createHall)
router.get('/getAllHalls', HallController.getAllHalls)

// Category Controller
router.post('/createCategory', body('name').notEmpty().escape(), CategoryController.createCategory)
router.get('/getCategories', CategoryController.getCategories)
router.patch('/editCategory', body(['id', 'name']).notEmpty().escape(), CategoryController.editCategory)
router.delete('/deleteCategory', body(['id']).notEmpty().escape(), CategoryController.deleteCategory)

router.post('/createSubcategory', body(['name', 'categoryId']).notEmpty().escape(), CategoryController.createSubcategory)
router.post('/getSubcategories', body('id').notEmpty().escape(), CategoryController.getSubcategories)
router.patch('/editSubcategory', body(['id', 'name']).notEmpty().escape(), CategoryController.editSubcategory)
router.delete('/deleteSubcategory', body(['id']).notEmpty().escape(), CategoryController.deleteSubcategory)

module.exports = router