const db = require('../model/model')
const Ticket = db.ticket
const { validationResult } = require('express-validator')
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc')

class TicketController {

    // const result = validationResult(req)
    // if (result.isEmpty()) {
    // } else {
    //     res.send({ errors: result.array() })
    // }

    static async setPrice(req, res) {
        const result = validationResult(req)
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
            res.send({ errors: result.array() })
        }
    }

    static async getSeatDetails(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            await Ticket.find()
                .then(seats => {
                    res.send({ success: true, seats })
                })
                .catch(err => {
                    res.send({ success: false, err })
                })
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async changePrice(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            await Ticket.findOneAndUpdate({ row: req.body.row, seat: req.body.seat, amphitheater: req.body.amphitheater }, { price: req.body.price })
                .then(() => {
                    res.send({ success: true, message: 'Update Successful' })
                })
                .catch(err => {
                    res.send({ success: false, err })
                })
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async changeAvailability(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            if (req.body.availability === 'available' || req.body.availability === 'saved' || req.body.availability === 'sold') {
                await Ticket.findOneAndUpdate({ row: req.body.row, seat: req.body.seat, amphitheater: req.body.amphitheater }, { availability: req.body.availability })
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
            res.send({ errors: result.array() })
        }
    }

    // static async checkout(req, res) {
    //     const session = await stripe.checkout.sessions.create({
    //         line_items: [
    //             {
    //                 // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
    //                 price: await stripe.prices.create({
    //                     unit_amount: 1999,
    //                     currency: 'usd',
    //                     recurring: { interval: 'month' },
    //                     product: 'prod_ObRFdzuEvEDtug',
    //                 }),
    //                 quantity: 1,
    //             },
    //         ],
    //         mode: 'payment',
    //         success_url: `http://localhost:8080/?success=true`,
    //         cancel_url: `http://localhost:8080/?canceled=true`,
    //     })

    //     res.redirect(303, session.url)
    // }

}

module.exports = TicketController