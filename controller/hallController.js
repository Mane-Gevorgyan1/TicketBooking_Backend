const db = require('../model/model')
const Hall = db.hall
const { validationResult } = require('express-validator')

class HallController {

    static async createHall(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            if (req.file) {
                const hall = await new Hall({ ...req.body, image: req.file.filename })
                hall.save(hall)
                    .then(() => {
                        res.send({ sucess: true, hall })
                    })
                    .catch((err) => {
                        res.send({ success: false, err })
                    })
            } else {
                res.send({ success: false, message: 'image field is required' })
            }
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

}

module.exports = HallController