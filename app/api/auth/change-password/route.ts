import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { currentPassword, newPassword } = await req.json();

        // Get token from cookies
        const cookieHeader = req.headers.get("cookie");
        if (!cookieHeader) {
            return Response.json({ message: "Not authenticated" }, { status: 401 });
        }

        const token = cookieHeader
            .split(";")
            .find((c: string) => c.trim().startsWith("auth_token="))
            ?.split("=")[1];

        if (!token) {
            return Response.json({ message: "Not authenticated" }, { status: 401 });
        }

        // Verify token and get user
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string; email: string; role: string };
        const user = await User.findById(decoded._id);

        if (!user) {
            return Response.json({ message: "User not found" }, { status: 404 });
        }

        // Verify current password
        const isValidPassword = await user.comparePassword(currentPassword);
        if (!isValidPassword) {
            return Response.json({ message: "Current password is incorrect" }, { status: 400 });
        }

        // Update new password (pre-save hook will hash it automatically)
        user.password = newPassword; // Plain password - pre-save hook will hash it
        user.isFirstLogin = false;
        user.mustChangePassword = false;
        await user.save();

        console.log("✅ Password changed successfully for user:", user.email);

        return Response.json({
            message: "Password changed successfully",
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                isFirstLogin: user.isFirstLogin,
                mustChangePassword: user.mustChangePassword
            }
        }, { status: 200 });

    } catch (error) {
        console.log("CHANGE PASSWORD ERROR 👉", error);
        if (error instanceof Error && "name" in error && error.name === "JsonWebTokenError") {
            return Response.json({ message: "Invalid token" }, { status: 401 });
        }
        if (error.name === "JsonWebTokenError") {
            return Response.json({ message: "Invalid token" }, { status: 401 });
        }
        return Response.json({ message: "Internal server error" }, { status: 500 });
    }
}
