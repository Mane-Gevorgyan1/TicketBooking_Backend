const db = require('../model/model')
const Category = db.category
const Subcategory = db.subcategory
const { validationResult } = require('express-validator')

class CategoryController {

    // const result = validationResult(req)
    // if (result.isEmpty()) {
    // } else {
    //     res.send({ errors: result.array() })
    // }

    static async createCategory(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            const category = await new Category({ name: req.body.name });
            await category.save()
            res.send({ success: true, category })
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async createSubcategory(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            const subCategory = await new Subcategory({ name: req.body.name, categoryId: req.body.categoryId });
            subCategory.save()
            const category = await Category.findByIdAndUpdate(req.body.categoryId, { $push: { subcategories: subCategory._id } });
            category.save()
                .then(category => {
                    res.send({ success: true, category })
                })
                .catch(error => {
                    res.send({ success: false, error })
                })
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async getCategories(req, res) {
        const categories = await Category.find().populate('subcategories')
        res.send({ success: true, categories })
    }

}

module.exports = CategoryController