module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            location: {
                type: String,
                default: null,
            },
            place: {
                type: String,
                default: null,
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
            time: [{
                type: String,
                default: null
            }],
            duration: {
                type: Number,
                default: null,
            },
        },
        { timestamps: true },
    );

    const Sessions = mongoose.model("sessions", schema)
    return Sessions
}