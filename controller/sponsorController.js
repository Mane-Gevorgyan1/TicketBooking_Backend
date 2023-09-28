const db = require('../model/model')
const Sponsor = db.sponsor
const { validationResult } = require('express-validator')

class SponsorController {

    static async createSponsor(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            if (req.file) {
                const sponsor = await new Sponsor({ name: req.body.name, image: req.file.filename })
                sponsor.save()
                    .then(() => {
                        res.send({ success: true, sponsor })
                    })
                    .catch(err => {
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

    static async deleteSponsor(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            await Sponsor.findOneAndDelete({ _id: req.body.id })
                .then(() => {
                    res.send({ success: true, message: 'Sponsor Deleted' })
                })
                .catch(error => {
                    res.send({ success: false, error })
                })
        } else {
            res.send({ errors: result.array() })
        }
    }

}

module.exports = SponsorController