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
            sold: {
                type: Boolean,
                default: false,
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
                type: Boolean,
                default: false,
            },
            delivery: {
                type: Boolean,
                default: false,
            },
            sessionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sessions'
            },
        },
        { timestamps: true },
    );

    const Tickets = mongoose.model("tickets", schema)
    return Tickets;
}; 