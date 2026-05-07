import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: "Logout successful" },
            { status: 200 }
        );

        // Clear the HTTP-only cookie
        response.cookies.set("auth_token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 0, // Expire immediately
        });

        return response;
    } catch (error) {
        console.log("LOGOUT ERROR 👉", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
