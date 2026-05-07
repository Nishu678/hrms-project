import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, password } = await req.json();
        const userExist = await User.findOne({ email })
        if (!userExist) {
            // res.status(400).json({ message: "User does not exist" })
            return Response.json({ message: "User does not exist" }, { status: 400 })
        }

        if (userExist.isBlocked) {
            return Response.json(
                { message: "User is blocked" },
                { status: 403 }
            );
        }

        const user = userExist as any;

        console.log("🔍 Login attempt for:", email);
        console.log("📧 User found:", !!userExist);
        console.log("🔐 User verified:", userExist.isVerified);
        console.log("🔑 Attempting to compare password...");
        console.log("🔑 Stored password length:", userExist.password.length);
        console.log("🔑 Provided password:", password);

        const isValidPassword = await user.comparePassword(password);

        console.log("🔑 Password valid:", isValidPassword);

        if (!isValidPassword) {
            return Response.json({ message: "Invalid password" }, { status: 400 })
        }

        const token = await user.generateAuthToken();

        // Set HTTP-only cookie for security
        const response = Response.json({
            message: "Login successful",
            user: {
                id: userExist._id.toString(),
                email: userExist.email,
                name: userExist.name,
                role: userExist.role
            }
        }, { status: 200 });

        // Set HTTP-only cookie store auto in the response header and get auto by browser.
        response.headers.set(
            "Set-Cookie",
            `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}` // 7 days
        );

        return response;


    } catch (error) {
        console.log("LOGIN ERROR 👉", error);
        return Response.json({ message: "Internal server error" }, { status: 500 })
    }
}