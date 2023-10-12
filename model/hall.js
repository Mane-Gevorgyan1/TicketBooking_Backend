module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            image: {
                type: String,
                default: null,
            },
            country: {
                type: String,
                default: null,
            },
            country_en: {
                type: String,
                default: null,
            },
            country_ru: {
                type: String,
                default: null,
            },
            location: {
                type: String,
                default: null,
            },
            location_en: {
                type: String,
                default: null,
            },
            location_ru: {
                type: String,
                default: null,
            },
            place: {
                type: String,
                default: null,
            },
            place_en: {
                type: String,
                default: null,
            },
            place_ru: {
                type: String,
                default: null,
            },
            hall: {
                type: String,
                default: null,
            },
            hall_en: {
                type: String,
                default: null,
            },
            hall_ru: {
                type: String,
                default: null,
            },
        },
        { timestamps: true },
    );

    const Halls = mongoose.model("halls", schema)
    return Halls
}