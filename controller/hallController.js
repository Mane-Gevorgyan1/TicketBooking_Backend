const db = require('../model/model')
const Hall = db.hall
const { validationResult } = require('express-validator')

// const result = validationResult(req)
// if (result.isEmpty()) {
// } else {
//     res.send({ errors: result.array() })
// }

class HallController {

    static async createHall(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            // if (req.file) {
                const hall = await new Hall({
                    ...req.body,
                    // image: req.file?.filename,
                    "price": [
                        {
                            "section": 1,
                            "price": [
                                {
                                    "row": 1,
                                    "type": "Fan zone",
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "type": "VIP zone",
                                    "price": ""
                                },
                            ],
                            "ticketQuantity": 100
                        },
                    ]
                })
                hall.save()
                    .then(() => {
                        res.send({ success: true, hall })
                    })
                    .catch((err) => {
                        res.send({ success: false, err })
                    })
            // } else {
                // res.send({ success: false, message: 'image field is required' })
            // }
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async getAllHalls(req, res) {
        await Hall.find()
            .then(halls => {
                res.send({ success: true, halls })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async singleHall(req, res) {
        await Hall.find({ _id: req.params.id })
            .then(hall => {
                res.send({ success: true, hall: hall[0] })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async editHall(req, res) {
        let body = {}
        if (req.file) {
            body = { ...req.body, image: req.file.filename }
        } else {
            body = {
                country: req.body.country,
                country_en: req.body.country_en,
                country_ru: req.body.country_ru,
                location: req.body.location,
                location_en: req.body.location_en,
                location_ru: req.body.location_ru,
                place: req.body.place,
                place_en: req.body.place_en,
                place_ru: req.body.place_ru,
                hall: req.body.hall,
                hall_en: req.body.hall_en,
                hall_ru: req.body.hall_ru,
            }
        }
        await Hall.findByIdAndUpdate(req.params.id, body, { new: true })
            .then(hall => {
                res.send({ success: true, hall })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

}

module.exports = HallController