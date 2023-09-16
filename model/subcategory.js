module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            name: {
                type: String,
                default: null,
            },
            categoryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'categories'
            },
        },
        { timestamps: true },
    );

    const Subcategories = mongoose.model("subcategories", schema)
    return Subcategories
}