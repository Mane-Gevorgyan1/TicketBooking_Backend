const db = require('../model/model')
const Ad = db.ad

class AdController {

    static async createMainAd(req, res) {
        const ad = new Ad({ ...req.body, image: req.file.filename })
        await ad.save()
            .then(() => {
                res.send({ success: true, message: 'Main ad created' })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async getAllAds(req, res) {
        await Ad.find()
            .then(ads => {
                res.send({ success: true, ads })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async getSingleAd(req, res) {
        await Ad.find({ _id: req.params.id })
            .then(ad => {
                res.send({ success: true, ad: ad[0] })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async editAd(req, res) {
        let body = {}
        if (req.file) {
            body = {
                image: req.file.filename,
                text: req.body.text,
                text_en: req.body.text_en,
                text_ru: req.body.text_ru,
                url: req.body.url,
            }
        } else {
            body = {
                text: req.body.text,
                text_en: req.body.text_en,
                text_ru: req.body.text_ru,
                url: req.body.url,
            }
        }

        await Ad.findByIdAndUpdate(req.params.id, body, { new: true })
            .then(ad => {
                res.send({ success: true, ad })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async deleteAd(req, res) {
        await Ad.findOneAndDelete({ _id: req.params.id })
            .then(() => {
                res.send({ success: true })
            })
            .catch(error => {
                res.send({ error })
            })
    }

}

module.exports = AdController