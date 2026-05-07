import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface TokenPayload {
    _id: string;
    email: string;
    role: string;
}

// Verify token from HTTP-only cookie
export async function verifyAuth(): Promise<{ user: TokenPayload | null; error: string | null }> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return { user: null, error: "No token found" };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
        return { user: decoded, error: null };
    } catch (error) {
        console.log("Auth verification error:", error);
        return { user: null, error: "Invalid token" };
    }
}

// Server-side authentication check for API routes
export async function requireAuth(): Promise<{ user: TokenPayload; error: null } | { user: null; error: string }> {
    const result = await verifyAuth();

    if (!result.user) {
        return { user: null, error: result.error || "Unauthorized" };
    }

    return { user: result.user, error: null };
}
