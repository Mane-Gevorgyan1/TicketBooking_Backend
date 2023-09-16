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
            location: {
                type: String,
                default: null,
            },
            date: {
                type: Date,
                default: null,
            },
            priceStart: {
                type: Number,
                default: null,
            },
            priceEnd: {
                type: Number,
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
            category: [String],
            subcategory: {
                type: String,
                default: null,
            },
            place: {
                type: String,
                default: null,
            },
            hall: {
                type: String,
                default: null,
            },
            genre: [String],
            sponsors: [String],
            description: {
                type: String,
                default: null,
            },
        },
        { timestamps: true },
    );

    const Events = mongoose.model("events", schema)
    return Events;
}; 