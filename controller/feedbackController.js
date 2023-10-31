const db = require('../model/model')
const Feedback = db.feedback

class FeedbackController {

    static async createFeedback(req, res) {
        const feedback = new Feedback({ ...req.body })
        feedback.save()
            .then(feedback => {
                res.send({ success: true, feedback })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async getFeedback(req, res) {
        await Feedback.find()
            .then(feedback => {
                res.send({ success: true, feedback: feedback[0] })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async editFeedback(req, res) {
        await Feedback.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
            .then(feedback => {
                res.send({ success: true, feedback })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

}

module.exports = FeedbackController