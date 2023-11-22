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
                type: String,
                autoIncrement: true,
            },
            seatId: {
                type: Number,
                default: null,
            },
            parterre: {
                type: Boolean,
                default: false,
            },
            amphitheater: {
                type: Boolean,
                default: false,
            },
            lodge: {
                type: Boolean,
                default: false,
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
            paymentVerified: {
                type: String,
                default: false,
            },
            delivery: {
                type: Boolean,
                default: false,
            },
            deliveryLocation: {
                type: String,
                default: null,
            },
            sessionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sessions'
            },
            orderId: {
                type: String,
                default: null,
            },
        },
        { timestamps: true },
    );

    const Tickets = mongoose.model("tickets", schema)
    return Tickets;
}; 