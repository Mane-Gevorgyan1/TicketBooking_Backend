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

    static async editCategory(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            await Category.findByIdAndUpdate(req.body.id, { name: req.body.name }, { new: true })
                .then(category => {
                    res.send({ success: true, message: 'Category updated', category })
                })
                .catch(error => {
                    res.send({ success: false, error })
                })
        } else {
            res.send({ errors: result.array() })
        }
    }

    static async deleteCategory(req, res) {
        await Category.findOneAndDelete({ _id: req.body.id })
            .then(() => {
                res.send({ success: true, message: 'Category Deleted' })
            })
            .catch(error => {
                res.send({ success: false, error })
            })
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

    static async getSubcategories(req, res) {
        const result = validationResult(req)
        if (result.isEmpty()) {
            await Category.find({ _id: req.body.id }).populate('subcategories')
                .then(category => {
                    res.send({ category: category[0] })
                })
        } else {
            res.send({ errors: result.array() })
        }
    }

}

module.exports = CategoryController