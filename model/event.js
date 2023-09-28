module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            image: {
                type: String,
                default: null,
            },
            title: {
                type: String,
                default: null,
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
                default: null,
            },
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'categories',
            },
            subcategories: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subcategories',
            }],
            genres: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'genres',
            }],
            sponsors: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sponsors',
            }],
            sessions: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sessions',
            }],
        },
        { timestamps: true },
    );

    const Events = mongoose.model("events", schema)
    return Events;
}; 