module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
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
            refreshToken: {
                type: String,
                default: null,
            }
        },
        { timestamps: true },
    );

    const Users = mongoose.model("users", schema)
    return Users
}