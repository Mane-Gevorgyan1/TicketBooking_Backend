module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            orderId: {
                type: String,
                default: null,
            },
        },
        { timestamps: true },
    );

    const ReturnedTickets = mongoose.model("ReturnedTickets", schema)
    return ReturnedTickets;
}; 