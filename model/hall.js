module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            image: {
                type: String,
                default: null,
            },
            location: {
                type: String,
                default: null,
            },
            place: {
                type: String,
                default: null,
            },
            hall: {
                type: String,
                default: null,
            },
        },
        { timestamps: true },
    );

    const Halls = mongoose.model("halls", schema)
    return Halls
}