module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            name: {
                type: String,
                default: null,
            },
            name_en: {
                type: String,
                default: null,
            },
            name_ru: {
                type: String,
                default: null,
            },
            subcategories: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subcategories'
            }],
        },
        { timestamps: true },
    );

    const Categories = mongoose.model("categories", schema)
    return Categories
}