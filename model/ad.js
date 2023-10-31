module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            image: {
                type: String,
                default: null,
            },
            text: {
                type: String,
                default: null,
            },
            text_en: {
                type: String,
                default: null,
            },
            text_ru: {
                type: String,
                default: null,
            },
        },
        { timestamps: true },
    );

    const Ads = mongoose.model("ads", schema)
    return Ads
}