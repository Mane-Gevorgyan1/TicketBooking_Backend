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
            sponsors: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sponsors',
            }],
            halls: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'halls',
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