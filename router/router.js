const express = require("express");
const router = express.Router();
const TicketController = require("../controller/ticketController");
const { body, query } = require('express-validator');

router.post('/setPrice', body(['row', 'seat', 'price']).notEmpty().escape(), TicketController.setPrice)
router.get('/getSeats', TicketController.getSeatDetails)
router.patch('/changePrice', body(['row', 'seat', 'price']).notEmpty().escape(), TicketController.changePrice)
router.patch('/changeAvailability', body(['row', 'seat', 'availability']).notEmpty().escape(), TicketController.changeAvailability)
router.post('/create-checkout-session', TicketController.checkout)

module.exports = router;