const db = require('../model/model')
const Ticket = db.ticket
const nodemailer = require('nodemailer')
const { validationResult } = require('express-validator')


// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD
//     }
// })

// const message = {
//     from: process.env.EMAIL,
//     to: req.body.email,
//     subject: 'Hi dear ' + req.body.name + '. Sending Email using Node.js',
//     html: `<h1>Dear ${req.body.name}</h1>
//             <a href = "http://localhost:8080/verifyEmail?email=${req.body.email}&token=${token}">Click on this link to verify your email</a>`
// }
// transporter.sendMail(message, async (err, info) => {
//     if (err) {
//         res.send("email is invalid");
//     } else {
//         await User.create({ ...req.body });
//         delete req.session.sxal;
//         res.redirect('/');
//     }
// })

class TicketController {

    // const result = validationResult(req)
    // if (result.isEmpty()) {
    // } else {
    //     res.send({ errors: result.array() })
    // }

    static async setSeat(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            let seatNumber
            async function generateTicketNumber() {
                seatNumber = Math.floor(1000 + Math.random() * 9000)
                await Ticket.find({ ticketNumber: seatNumber })
                    .then(async ticket => {
                        if (ticket.length) {
                            generateTicketNumber()
                        } else {
                            const seat = await new Ticket({ ...req.body, ticketNumber: seatNumber })
                            seat.save(seat)
                                .then(() => {
                                    res.send({ sucess: true, seat })
                                })
                                .catch((err) => {
                                    res.send({ success: false, err })
                                })
                        }
                    })
            }
            generateTicketNumber()
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async singleTicket(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            await Ticket.find({ ticketNumber: req.body.ticketNumber })
                .then(ticket => {
                    res.send({ success: true, ticket })
                })
                .catch(error => {
                    res.send({ success: false, error })
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

    static async returnTicket(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            await Ticket.findOneAndUpdate({ ticketNumber: req.body.ticketNumber }, {
                availability: 'available',
                buyerName: null,
                buyerEmail: null,
                buyerPhone: null,
                buyerNotes: null,
                paymentMethod: null,
                delivery: false,
            })
                .then(ticket => {
                    res.send({ success: true, message: 'Ticket is returned', ticket })
                })
                .catch(error => {
                    res.send({ success: false, error })
                })
        } else {
            res.send({ errors: result.array() })
        }
    }

    // static async buyTicket(req, res) {
    //     const result = validationResult(req)
    //     if (result.isEmpty()) {
    //         let allowToBuyTickets
    //         req.body.ticketDetails.forEach(async element => {
    //             await Ticket.find({ row: element.row, seat: element.seat, amphitheater: element.amphitheater, lodge: element.lodge })
    //                 .then(ticket => {
    //                     // console.log(ticket);
    //                     if (ticket.availability === 'sold') {
    //                         allowToBuyTickets = false
    //                         return
    //                     } else {
    //                         allowToBuyTickets = true
    //                     }
    //                 })
    //                 .catch(error => {
    //                     res.send({ success: false, message: 'Failed to find ticket', error })
    //                 })
    //         })

    //         // console.log(allowToBuyTickets);

    //         if (allowToBuyTickets) {
    //             req.body.ticketDetails.forEach(async element => {
    //                 await Ticket.findOneAndUpdate({
    //                     row: element.row,
    //                     seat: element.seat,
    //                     amphitheater: element.amphitheater,
    //                     lodge: element.lodge
    //                 }, {
    //                     availability: 'sold',
    //                     buyerName: req.body.name,
    //                     buyerEmail: req.body.email,
    //                     buyerPhone: req.body.phone,
    //                     buyerNotes: req.body.notes,
    //                     paymentMethod: req.body.paymentMethod,
    //                     delivery: req.body.delivery,
    //                 })
    //                     .then(ticket => {
    //                         res.send({ success: true, ticket })
    //                     })
    //                     .catch(error => {
    //                         res.send({ success: false, error })
    //                     })
    //             })
    //         }

    //     } else {
    //         res.send({ errors: result.array() })
    //     }
    // }

}

module.exports = TicketController