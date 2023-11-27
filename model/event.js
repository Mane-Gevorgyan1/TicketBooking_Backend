module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            image: {
                type: String,
                default: null,
            },
            title: {
                type: String,
                default: ' ',
            },
            title_en: {
                type: String,
                default: ' ',
            },
            title_ru: {
                type: String,
                default: ' ',
            },
            topEvent: {
                type: Boolean,
                default: false,
            },
            generalEvent: {
                type: Boolean,
                default: false,
            },
            description: {
                type: String,
                default: ' ',
            },
            description_en: {
                type: String,
                default: ' ',
            },
            description_ru: {
                type: String,
                default: ' ',
            },
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'categories',
            },
            subcategories: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subcategories',
            },
            sponsors: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sponsors',
            }],
            sessions: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sessions',
            }],
            validity: {
                type: Boolean,
                default: null,
            },
        },
        { timestamps: true },
    );

    const Events = mongoose.model("events", schema)
    return Events;
}; 