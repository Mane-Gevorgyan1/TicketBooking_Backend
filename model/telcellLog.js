module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            text: {
                type: Object,
                default: null,
            },
        },
        { timestamps: true },
    );

    const TelcellData = mongoose.model("telcellData", schema)
    return TelcellData
}