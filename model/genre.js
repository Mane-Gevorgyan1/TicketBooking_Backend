module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            name: {
                type: String,
                default: null,
            },
        },
        { timestamps: true },
    );

    const Genres = mongoose.model("genres", schema)
    return Genres
}