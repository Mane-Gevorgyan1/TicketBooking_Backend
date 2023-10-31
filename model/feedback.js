module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            facebook: {
                type: String,
                default: null,
            },
            instagram: {
                type: String,
                default: null,
            },
            twitter: {
                type: String,
                default: null,
            },
            phone: {
                type: String,
                default: null,
            },
        },
        { timestamps: true },
    );

    const Feedback = mongoose.model("feedback", schema)
    return Feedback
}