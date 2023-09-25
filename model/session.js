module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            hallId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'halls',
            },
            date: {
                type: Date,
                default: null,
            },
            time: {
                type: String,
                default: null
            },
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