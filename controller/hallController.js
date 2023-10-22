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
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                },
                                {
                                    "row": 6,
                                    "price": ""
                                },
                                {
                                    "row": 7,
                                    "price": ""
                                },
                            ]
                        },
                        {
                            "section": 2,
                            "price": [
                                {
                                    "row": 1,
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                },
                                {
                                    "row": 6,
                                    "price": ""
                                },
                                {
                                    "row": 7,
                                    "price": ""
                                },
                                {
                                    "row": 8,
                                    "price": ""
                                },
                                {
                                    "row": 9,
                                    "price": ""
                                },
                                {
                                    "row": 10,
                                    "price": ""
                                },
                                {
                                    "row": 11,
                                    "price": ""
                                },
                                {
                                    "row": 12,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 3,
                            "price": [
                                {
                                    "row": 1,
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                },
                                {
                                    "row": 6,
                                    "price": ""
                                },
                                {
                                    "row": 7,
                                    "price": ""
                                },
                                {
                                    "row": 8,
                                    "price": ""
                                },
                                {
                                    "row": 9,
                                    "price": ""
                                },
                                {
                                    "row": 10,
                                    "price": ""
                                },
                                {
                                    "row": 11,
                                    "price": ""
                                },
                                {
                                    "row": 12,
                                    "price": ""
                                },
                                {
                                    "row": 13,
                                    "price": ""
                                },
                                {
                                    "row": 14,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 4,
                            "price": [
                                {
                                    "row": 1,
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                },
                                {
                                    "row": 6,
                                    "price": ""
                                },
                                {
                                    "row": 7,
                                    "price": ""
                                },
                                {
                                    "row": 8,
                                    "price": ""
                                },
                                {
                                    "row": 9,
                                    "price": ""
                                },
                                {
                                    "row": 10,
                                    "price": ""
                                },
                                {
                                    "row": 11,
                                    "price": ""
                                },
                                {
                                    "row": 12,
                                    "price": ""
                                },
                                {
                                    "row": 13,
                                    "price": ""
                                },
                                {
                                    "row": 14,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 5,
                            "price": [
                                {
                                    "row": 1,
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                },
                                {
                                    "row": 6,
                                    "price": ""
                                },
                                {
                                    "row": 7,
                                    "price": ""
                                },
                                {
                                    "row": 8,
                                    "price": ""
                                },
                                {
                                    "row": 9,
                                    "price": ""
                                },
                                {
                                    "row": 10,
                                    "price": ""
                                },
                                {
                                    "row": 11,
                                    "price": ""
                                },
                                {
                                    "row": 12,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 6,
                            "price": [
                                {
                                    "row": 1,
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                },
                                {
                                    "row": 6,
                                    "price": ""
                                },
                                {
                                    "row": 7,
                                    "price": ""
                                },
                                {
                                    "row": 8,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 7,
                            "price": [
                                {
                                    "row": 1,
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 8,
                            "price": [
                                {
                                    "row": 1,
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                },
                                {
                                    "row": 6,
                                    "price": ""
                                },
                                {
                                    "row": 7,
                                    "price": ""
                                },
                                {
                                    "row": 8,
                                    "price": ""
                                },
                                {
                                    "row": 9,
                                    "price": ""
                                },
                                {
                                    "row": 10,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 9,
                            "price": [
                                {
                                    "row": 1,
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                },
                                {
                                    "row": 6,
                                    "price": ""
                                },
                                {
                                    "row": 7,
                                    "price": ""
                                },
                                {
                                    "row": 8,
                                    "price": ""
                                },
                                {
                                    "row": 9,
                                    "price": ""
                                },
                                {
                                    "row": 10,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 10,
                            "price": [
                                {
                                    "row": 1,
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 11,
                            "price": [
                                {
                                    "row": 1,
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 12,
                            "price": [
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 13,
                            "price": [
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 14,
                            "price": [
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 15,
                            "price": [
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 16,
                            "price": [
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 17,
                            "price": [
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                }
                            ]
                        },
                        {
                            "section": 18,
                            "price": [
                                {
                                    "row": 1,
                                    "price": ""
                                },
                                {
                                    "row": 2,
                                    "price": ""
                                },
                                {
                                    "row": 3,
                                    "price": ""
                                },
                                {
                                    "row": 4,
                                    "price": ""
                                },
                                {
                                    "row": 5,
                                    "price": ""
                                }
                            ]
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