import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { requireAuth } from "@/lib/auth";

export async function GET() {
    try {
        await dbConnect();

        // Verify authentication
        const authResult = await requireAuth();

        if (!authResult.user) {
            return NextResponse.json(
                { message: authResult.error },
                { status: 401 }
            );
        }

        // Get full user details from database
        const user = await User.findById(authResult.user._id).select("-password");

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                isVerified: user.isVerified,
                isBlocked: user.isBlocked
            }
        });
    } catch (error) {
        console.log("GET USER ERROR 👉", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
