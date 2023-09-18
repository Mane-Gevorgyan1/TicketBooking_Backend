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
            ticketNumber: {
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
            },
            lodge: {
                type: Boolean,
                default: false,
            },
            seatColor: {
                type: String,
                default: null,
            },
            buyerName: {
                type: String,
                default: null,
            },
            buyerEmail: {
                type: String,
                default: null,
            },
            buyerPhone: {
                type: String,
                default: null,
            },
            buyerNotes: {
                type: String,
                default: null,
            },
            paymentMethod: {
                type: String,
                default: null,
            },
            delivery: {
                type: Boolean,
                default: false,
            },
        },
        { timestamps: true },
    );

    const Tickets = mongoose.model("tickets", schema)
    return Tickets;
}; 