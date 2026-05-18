/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const UserSchema = new mongoose.Schema(
    {
        isFirstLogin: { type: Boolean, default: true },
        mustChangePassword: { type: Boolean, default: false },
        name: { type: String, required: true },

        email: { type: String, required: true, unique: true },

        password: { type: String, required: true },

        otp: { type: String }, // optional
        otpExpiresAt: { type: Date }, // optional

        isVerified: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },

        role: { type: String, enum: ["admin", "employee"], default: "employee" },

        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // Link to Employee model
    },
    {
        timestamps: true, // auto createdAt & updatedAt
    }
);

//pre hook that run before save the user in db to hash the password no need to use next here as it is async
UserSchema.pre("save", async function () {
    const user = this;

    console.log("🔐 Pre-save hook triggered");
    console.log("🔐 Password modified?:", user.isModified("password"));

    if (!user.isModified("password")) {
        console.log("🔐 Password not modified, skipping hash");
        return;
    }

    console.log("🔐 Hashing password...");
    console.log("🔐 Password before hash:", user.password);

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        console.log("🔐 Password after hash:", user.password);
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
});

UserSchema.methods.comparePassword = async function (password: string) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        console.log('Password compare error', error)
        return false
    }
}

UserSchema.methods.generateAuthToken = async function () {
    try {
        return jwt.sign({ _id: this._id.toString(), email: this.email, role: this.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" })
    } catch (error) {
        console.log('Token error', error)
    }
}

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;