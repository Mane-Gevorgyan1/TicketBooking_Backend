module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            tickets: [{
                type: Object,
                default: null,
            }],
            buyerName: {
                type: String,
                default: null
            },
            buyerEmail: {
                type: String,
                default: null
            },
            buyerPhone: {
                type: String,
                default: null
            },
            buyerNotes: {
                type: String,
                default: null
            },
            deliveryLocation: {
                type: String,
                default: null
            },
            sessionId: {
                type: String,
                default: null
            },
            paymentMethod: {
                type: String,
                default: null
            },
            orderId: {
                type: String,
                default: null
            }
        },
        { timestamps: true },
    );

    const CurrentTicket = mongoose.model("CurrentTicket", schema)
    return CurrentTicket;
}; 