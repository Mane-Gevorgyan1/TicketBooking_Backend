module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            row: {
                type: Number,
                default: null,
            },
            seat: {
                type: Number,
                default: null,
            },
            price: {
                type: Number,
                default: null,
            },
            availability: {
                type: String,
                default: 'available', // available, saved, sold
            },
            amphitheater: {
                type: Boolean,
                default: false,
            }
        },
        { timestamps: true },
    );

    const Tickets = mongoose.model("tickets", schema);
    return Tickets;
}; 