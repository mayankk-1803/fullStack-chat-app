import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        profilePic: {
            type: String,
            required: false,
            default:"",
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema);

export default User;

