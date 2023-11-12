const db = require('../model/model')
const Ticket = db.ticket
const Session = db.session
const ReturnedTickets = db.returnedTickets
const nodemailer = require('nodemailer')
const { validationResult } = require('express-validator')
const QRCode = require('qrcode')
const { PDFDocument, rgb } = require('pdf-lib')
const fs = require('fs').promises
const axios = require('axios')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

const generateTableRows = (data) => {
    let tableRows = '';
    let tex = ''
    let total = 0
    data.forEach((item) => {
        if (item.parterre) {
            tex = 'Партер'
        } else if (item.amphitheater) {
            tex = 'Амфитеатр'
        } else if (item?.lodge) {
            tex = 'Лодж'
        }
        total += item?.total
        tableRows += `
          <tr>
             <td style="border-bottom:1px solid #DDD; text-align: left; padding: 8px">${tex}</td>
             <td style="border-bottom:1px solid #DDD; text-align: left; padding: 8px">${item?.ticketCount}</td>
             <td style="border-bottom:1px solid #DDD; text-align: left; padding: 8px">${item.row}</td>
             <td style="border-bottom:1px solid #DDD; text-align: left; padding: 8px">${item.seat}</td>
             <td style="border-bottom:1px solid #DDD; text-align: left; padding: 8px">${item.price} AMD</td>
          </tr>
       `;
    });
    return tableRows;
}

const emailTemplate = (data) => {
    let total = 0
    data.forEach(element => {
        total += element.total
    })
    return `
   <html>
   <body>
   <h1>Здравствуйте, ${data[0]?.buyerName}!</h1>
   <p>Ваш заказ для мероприятия "${data[0]?.title}" на сумму ${total} AMD оплачен !</p>
   <p>Список билетов: </p>
   <table style="border-collapse:collapse; width:100%;">
        <thead>
            <tr>
            <th style="border-bottom:1px solid #DDD; text-align: left; padding: 8px">Партер/Амфитеатр/Лодж</th>
               <th style="border-bottom:1px solid #DDD; text-align: left; padding: 8px">Номер билета</th>
               <th style="border-bottom:1px solid #DDD; text-align: left; padding: 8px">Ряд</th>
               <th style="border-bottom:1px solid #DDD; text-align: left; padding: 8px">Место</th>
               <th style="border-bottom:1px solid #DDD; text-align: left; padding: 8px">Цена</th>
            </tr>
         </thead>
         <tbody>
            ${generateTableRows(data)}
         </tbody>
    </table>
    <p>Желаем сполна насладиться мероприятием!</p>
    <p>По вопросам звоните по телефону 090 00 00 00</p>
   </body>
   </html>
`}

// Function to create a QR code as a Data URI
async function createQRCode(data) {
    try {
        const qrCode = await QRCode.toDataURL(data);
        return qrCode;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
}

// Function to create a new PDF with a QR code
async function createPDFWithQRCode(outputFilePath, qrCodeData) {
    try {
        const details = JSON.parse(qrCodeData)
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([300, 200]);

        const qrCode = await createQRCode(qrCodeData);
        const qrCodeImage = await pdfDoc.embedPng(qrCode);

        page.drawImage(qrCodeImage, {
            x: 10, // Adjust the position where you want to place the QR code
            y: 140,
            width: 50,
            height: 50,
        });
        let tex = ''
        if (details.parterre) {
            tex = 'Parterre'
        } else if (details.amphitheater) {
            tex = 'Amphitheater'
        } else if (details?.lodge) {
            tex = 'Lodge'
        }
        page.drawText(`Event: ${details?.title}`, { x: 10, y: 120, size: 6 })
        page.drawText(`Location: ${details?.country}, ${details?.location}, Karen Demirjyan`, { x: 10, y: 110, size: 6 })
        page.drawText(`Date: ${details?.date.split('T')[0]}`, { x: 10, y: 100, size: 6 })
        page.drawText(`Time: ${details?.time}`, { x: 10, y: 90, size: 6 })
        page.drawText(`Ticket Number: ${details?.ticketNumber}`, { x: 10, y: 80, size: 6 })
        page.drawText(`${tex}, row: ${details?.row}, seat: ${details?.seat}`, { x: 10, y: 70, size: 6 })
        page.drawText(`price: ${details?.price} AMD`, { x: 10, y: 60, size: 6 })
        const pdfBytes = await pdfDoc.save();
        await fs.writeFile(outputFilePath, pdfBytes);

        return outputFilePath
    } catch (error) {
        console.error('Error creating PDF with QR code:', error);
        throw error;
    }
}

const generateOrderNumber = () => {
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000)
    return `ORD-${timestamp}-${randomNum}`
}

async function buyTicket(req) {
    const session = await Session.findById(req.sessionId)
        .populate('eventId')
        .populate('hallId')
    let PDFs = []
    let tickets = []
    let total = 0
    if (session) {
        req.tickets?.forEach(async (element, index) => {
            session?.soldTickets.push({
                id: element?.seatId
            })

            let ticketCount = ''
            ticketCount = await Ticket.countDocuments() + index + 1
            if (ticketCount <= 9) {
                ticketCount = '000' + ticketCount
            } else if (ticketCount <= 99) {
                ticketCount = '00' + ticketCount
            } else if (ticketCount <= 999) {
                ticketCount = '0' + ticketCount
            }
            total = + element?.price
            tickets.push({
                parterre: element?.parterre,
                amphitheater: element?.amphitheater,
                lodge: element?.lodge,
                row: element?.row,
                seat: element?.seat,
                price: element?.price,
                buyerName: req?.buyerName,
                ticketCount,
                total,
                title: session?.eventId?.title
            })
            const ticket = await new Ticket({
                ...element,
                buyerName: req.buyerName,
                buyerEmail: req.buyerEmail,
                buyerPhone: req.buyerPhone,
                buyerNotes: req.buyerNotes,
                paymentMethod: req.paymentMethod,
                delivery: req.delivery,
                deliveryLocation: req.deliveryLocation,
                sessionId: req.sessionId,
                ticketNumber: ticketCount,
                orderId: req.orderId
            })
            ticket.save()

            const outputFilePath = `public/pdf/${ticket._id}.pdf`
            const qrCodeData = JSON.stringify({
                title: session?.eventId?.title_en,
                country: session?.hallId?.country_en,
                location: session?.hallId?.location_en,
                place: session?.hallId?.place_en,
                date: session?.date,
                time: session?.time,
                ticketNumber: ticketCount,
                parterre: element?.parterre,
                amphitheater: element?.amphitheater,
                lodge: element?.lodge,
                row: element?.row,
                seat: element?.seat,
                price: element?.price,
            })
            const pdf = await createPDFWithQRCode(outputFilePath, qrCodeData)
            PDFs.push({ filename: pdf.split('public/pdf/')[1], path: pdf })
        })
        session.save()

        setTimeout(() => {
            const message = {
                from: process.env.EMAIL,
                to: req.buyerEmail,
                subject: 'Shine tickets',
                attachments: PDFs,
                html: emailTemplate(tickets),
            }
            transporter.sendMail(message, async (err, info) => {
                if (err) {
                    // res.send("email is invalid");
                } else {
                    // res.send({ success: true, message: 'Ticket is sent to your email' })
                }
            })
        }, 2000)
    }
}

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
                                    res.send({ success: true, seat })
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
                .populate({
                    path: 'sessionId',
                    populate: { path: 'eventId' }
                })
                .populate({
                    path: 'sessionId',
                    populate: { path: 'hallId' }
                })
                .then(ticket => {
                    res.send({ success: true, ticket: ticket[0] })
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
            const session = await Session.findById(req.body.sessionId)
            session.soldTickets = session?.soldTickets?.filter(e => e.id != req.body.seatId)
            session.save()

            const newReturn = await new ReturnedTickets({ orderId: req.body.orderId })
            newReturn.save()

            await Ticket.findOneAndDelete({ ticketNumber: req.body.ticketNumber })
                .then((ticket) => {
                    res.send({ success: true })
                })
                .catch(() => {
                    res.send({ success: false })
                })
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async getReturnedTickets(req, res) {
        await ReturnedTickets.find()
            .then(tickets => {
                res.send({ success: true, tickets })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async registerPayment(req, res) {
        const myHeaders = new Headers()
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded")

        const urlencoded = new URLSearchParams()
        urlencoded.append("userName", process.env.PAYMENT_USERNAME)
        urlencoded.append("password", process.env.PAYMENT_PASSWORD)
        urlencoded.append("orderNumber", generateOrderNumber())
        urlencoded.append("returnUrl", "https://shinetickets.com/StatusPage")
        urlencoded.append("amount", req.body.amount)

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        }

        fetch("https://ipay.arca.am/payment/rest/register.do", requestOptions)
            .then(response => response.text())
            .then(result => {
                const ress = JSON.parse(result)
                if (ress.error) {
                    res.send({ success: false, error: ress?.errorMessage })
                } else {
                    let frontData = req.body.data
                    frontData.orderId = ress?.orderId

                    buyTicket(frontData)

                    res.send({ success: true, orderId: ress?.orderId, formUrl: ress?.formUrl, data: req.body.data })
                }
            })
            .catch(error => console.log('error', error))
    }

    static async getAllTickets(req, res) {
        const itemsPerPage = 20
        const totalTicketCount = await Ticket.countDocuments()
        const currentPage = parseInt(req.query.currentPage) || 1
        const totalPages = Math.ceil(totalTicketCount / itemsPerPage)
        const hasNextPage = currentPage < totalPages

        await Ticket.find()
            .skip((currentPage - 1) * itemsPerPage)
            .limit(itemsPerPage)
            .then(tickets => {
                res.send({ success: true, tickets, totalTicketCount, currentPage, totalPages, hasNextPage })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async searchTicket(req, res) {
        await Ticket.find({ ticketNumber: { $regex: new RegExp('^' + req.body.search, 'i') } })
            .then(ticket => {
                res.send({ success: true, ticket })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async deleteReturnTicket(req, res) {
        await ReturnedTickets.findOneAndDelete({ _id: req.body.id })
            .then(() => {
                res.send({ success: true })
            })
            .catch(() => {
                res.send({ success: false })
            })
    }

}

module.exports = TicketController