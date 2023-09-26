const db = require('../model/model')
const Sponsor = db.sponsor
const { validationResult } = require('express-validator')

class SponsorController {

    static async createSponsor(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            if (req.file) {
                const sponsor = await new Sponsor({ ...req.body, image: req.file.filename })
                sponsor.save(sponsor)
                    .then(() => {
                        res.send({ sucess: true, sponsor })
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

    static async getAllSponsors(req, res) {
        await Sponsor.find()
            .then(sponsors => {
                res.send({ success: true, sponsors })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

}

module.exports = SponsorController