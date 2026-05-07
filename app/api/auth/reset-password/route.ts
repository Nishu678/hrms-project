import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, otp, newPassword } = await req.json();
        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({ message: "User does not exist" }, { status: 400 })
        }

        if (!user.otp) {
            return Response.json({ message: "No OTP found" }, { status: 400 });
        }
        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return Response.json({ message: "OTP expired" }, { status: 400 })
        }


        const isValidOtp = await bcrypt.compare(otp, user.otp);
        if (!isValidOtp) {
            return Response.json({ message: "Invalid OTP" }, { status: 400 })
        }

        console.log("🔵 Before password update:", user.password ? "exists" : "empty");

        // Set the plain password - the pre-save hook will hash it automatically
        user.password = newPassword;

        console.log("🟡 After setting password:", user.password);
        console.log("🟡 Is password modified?", user.isModified("password"));

        // null because cant use again
        user.otp = null;
        user.otpExpiresAt = null;

        const savedUser = await user.save();

        console.log("🟢 After save - password hashed?:", savedUser.password !== newPassword);
        console.log("🟢 Saved password length:", savedUser.password.length);

        // console.log("Password reset successfully", )
        return Response.json({ message: "Password reset successfully" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({ message: "Internal server error" }, { status: 500 })
    }
}