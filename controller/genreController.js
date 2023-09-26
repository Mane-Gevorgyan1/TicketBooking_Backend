const db = require('../model/model')
const Genre = db.genre
const { validationResult } = require('express-validator')

class GenreController {

    static async createGenre(req, res) {
        const genre = await new Genre({ name: req.body.name })
        genre.save(genre)
            .then(() => {
                res.send({ success: true, genre })
            })
            .catch((err) => {
                res.send({ success: false, err })
            })
    }

    static async getAllGenres(req, res) {
        await Genre.find()
            .then(genres => {
                res.send({ success: true, genres })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
    }

    static async filterByGenre(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            await Event.find()
                .populate('genres')
                .populate('sponsors')
                .populate({
                    path: 'category',
                    populate: { path: 'subcategories' }
                })
                .then(events => {
                    let filteredGenres = []
                    req.body.genreId.forEach(eachGenreId => {
                        events?.forEach(eachEvent => {
                            eachEvent?.genres?.forEach(eachGenre => {
                                if (eachGenre._id == eachGenreId) {
                                    if (!filteredGenres.includes(eachEvent)) {
                                        filteredGenres.push(eachEvent)
                                    }
                                }
                            })
                        })
                    })
                    res.send({ success: true, filteredGenres })
                })
                .catch(error => {
                    res.send({ success: false, error })
                })
        } else {
            res.send({ errors: result.array() })
        }
    }

}

module.exports = GenreController