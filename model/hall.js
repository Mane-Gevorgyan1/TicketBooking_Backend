module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            image: {
                type: String,
                default: null,
            },
            country: {
                type: String,
                default: null,
            },
            city: {
                type: String,
                default: null,
            },
            eventId: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'event',
            }],
            location: {
                type: String,
                default: null,
            },
            hall: {
                type: String,
                default: null,
            },
            session: {
                type: Object,
                default: null,
            },
        },
        { timestamps: true },
    );

    const Halls = mongoose.model("halls", schema)
    return Halls
}