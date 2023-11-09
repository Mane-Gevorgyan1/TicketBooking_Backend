module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            name: {
                type: String,
                default: null,
            },
            username: {
                type: String,
                default: null,
            },
            password: {
                type: String,
                default: null,
            },
            roleId: {
                type: Number,    // 1: admin, 2: moderator
                default: 2,
            },
            accessToken: {
                type: String,
                default: null,
            },
            accessToEvents: {
                type: Boolean,
                default: false,
            },
            accessToCategories: {
                type: Boolean,
                default: false,
            },
            accessToSponsors: {
                type: Boolean,
                default: false,
            },
            accessToHalls: {
                type: Boolean,
                default: false,
            },
            accessToSessions: {
                type: Boolean,
                default: false,
            },
            accessToAds: {
                type: Boolean,
                default: false,
            },
            accessToFeedback: {
                type: Boolean,
                default: false,
            },
            accessToModerators: {
                type: Boolean,
                default: false,
            },
        },
        { timestamps: true },
    );

    const Users = mongoose.model("users", schema)
    return Users
}