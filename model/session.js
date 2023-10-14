module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'events',
            },
            hallId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'halls',
            },
            priceStart: {
                type: Number,
                default: null,
            },
            priceEnd: {
                type: Number,
                default: null,
            },
            date: {
                type: Date,
                default: null,
            },
            time: {
                type: String,
                default: null,
            },
            price: [{
                type: Object,
                default: null,
            }],
        },
        { timestamps: true },
    );

    const Sessions = mongoose.model("sessions", schema)
    return Sessions
}