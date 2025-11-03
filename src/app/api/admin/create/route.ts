import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Helper route to create an admin user (for development)
// In production, use a secure method to create admin users
export async function POST(req: NextRequest) {
	try {
		const { email, password } = await req.json();
		
		if (!email) {
			return NextResponse.json({ error: "Email required" }, { status: 400 });
		}

		// Check if user exists
		let user = await prisma.user.findUnique({ where: { email } });
		
		if (user) {
			// Update existing user to admin
			user = await prisma.user.update({
				where: { id: user.id },
				data: { role: "ADMIN" },
			});
			return NextResponse.json({ 
				message: "User updated to admin",
				email: user.email,
				role: user.role,
			});
		} else {
			// Create new admin user
			user = await prisma.user.create({
				data: {
					email,
					role: "ADMIN",
					name: "Admin User",
				},
			});
			return NextResponse.json({ 
				message: "Admin user created",
				email: user.email,
				role: user.role,
				note: "You need to sign in with this email using your authentication provider",
			});
		}
	} catch (error) {
		console.error("Error creating admin:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 }
		);
	}
}

