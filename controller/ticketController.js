const db = require('../model/model')
const Ticket = db.ticket
const { validationResult } = require('express-validator');

class TicketController {

    static async setPrice(req, res) {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const seat = await new Ticket({ ...req.body })
            seat.save(seat)
                .then(() => {
                    res.send({ sucess: true, seat })
                })
                .catch((err) => {
                    res.send({ success: false, err })
                })
        } else {
            res.send({ errors: result.array() });
        }
    }

    static async getSeatDetails(req, res) {
        const result = validationResult(req);
        if (result.isEmpty()) {
            await Ticket.find({ row: req.query.row, seat: req.query.seat })
                .then(seat => {
                    res.send({ success: true, seat: seat[0] })
                })
                .catch(err => {
                    res.send({ success: false, err })
                })
        } else {
            res.send({ errors: result.array() });
        }
    }

    static async changePrice(req, res) {
        const result = validationResult(req);
        if (result.isEmpty()) {
            await Ticket.findOneAndUpdate({ row: req.body.row, seat: req.body.seat }, { price: req.body.price })
                .then(() => {
                    res.send({ success: true, message: 'Update Successful' })
                })
                .catch(err => {
                    res.send({ success: false, err })
                })
        } else {
            res.send({ errors: result.array() });
        }
    }

    static async changeAvailability(req, res) {
        const result = validationResult(req);
        if (result.isEmpty()) {
            if (req.body.availability === 'available' || req.body.availability === 'saved' || req.body.availability === 'sold') {
                await Ticket.findOneAndUpdate({ row: req.body.row, seat: req.body.seat }, { availability: req.body.availability })
                    .then(() => {
                        res.send({ success: true, message: 'Update Successful' })
                    })
                    .catch(err => {
                        res.send({ success: false, err })
                    })
            } else {
                res.send({ success: false, error: 'Wrong availability value' })
            }
        } else {
            res.send({ errors: result.array() });
        }
    }
}

module.exports = TicketController