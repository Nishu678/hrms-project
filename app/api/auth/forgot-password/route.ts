import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { sendEmail } from "@/utils/sendEmail";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return Response.json({ message: "If email exists, OTP sent" }, { status: 400 })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashOtp = await bcrypt.hash(otp, 10);
        userExist.otp = hashOtp;
        userExist.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await userExist.save();
        await sendEmail({
            to: email,
            subject: "OTP for password reset",
            text: `Your OTP for password reset is ${otp}`,
        })
        console.log("OTP sent successfully", otp)
        return Response.json({ message: "OTP sent successfully" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({ message: "Internal server error" }, { status: 500 })
    }
}