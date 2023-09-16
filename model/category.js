module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            name: {
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