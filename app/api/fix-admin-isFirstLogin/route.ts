import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Update all admin users to have isFirstLogin: false
    const result = await User.updateMany(
      { role: "admin" },
      { $set: { isFirstLogin: false, mustChangePassword: false } }
    );

    // Verify the changes
    const admins = await User.find({ role: "admin" });

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} admin user(s)`,
      admins: admins.map((admin) => ({
        email: admin.email,
        isFirstLogin: admin.isFirstLogin,
        mustChangePassword: admin.mustChangePassword,
      })),
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
