module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            image: {
                type: String,
                default: null,
            },
            text: {
                type: String,
                default: '',
            },
            text_en: {
                type: String,
                default: '',
            },
            text_ru: {
                type: String,
                default: '',
            },
        },
        { timestamps: true },
    );

    const Ads = mongoose.model("ads", schema)
    return Ads
}