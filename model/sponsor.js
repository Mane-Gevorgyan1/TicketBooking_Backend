module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            name: {
                type: String,
                default: null,
            },
            image: {
                type: String,
                default: null,
            }
        },
        { timestamps: true },
    );

    const Sponsors = mongoose.model("sponsors", schema)
    return Sponsors
}