module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            sessionId: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sessions',
            }],
            price: [{
                type: Object,
                default: null,
            }],
        },
        { timestamps: true },
    );

    const Price = mongoose.model("price", schema)
    return Price
}