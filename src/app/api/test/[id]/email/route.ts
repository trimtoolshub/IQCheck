import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const { email } = await req.json();

		if (!email || !email.includes("@")) {
			return NextResponse.json({ error: "Valid email required" }, { status: 400 });
		}

		const test = await prisma.testSession.findUnique({ where: { id } });
		if (!test) {
			return NextResponse.json({ error: "Test session not found" }, { status: 404 });
		}

		try {
			// Update test session with email
			await prisma.testSession.update({
				where: { id },
				data: { email },
			});
		} catch (updateError: any) {
			// If email field doesn't exist yet, that's okay - we'll still save to Email table
			console.warn("Could not update test session email field:", updateError?.message);
		}

		try {
			// Save or update email in Email table
			await prisma.email.upsert({
				where: { email },
				update: {
					testSessionId: id,
					source: "report_unlock",
				},
				create: {
					email,
					testSessionId: id,
					source: "report_unlock",
					subscribed: true,
				},
			});
		} catch (emailError: any) {
			console.error("Error saving email to Email table:", emailError);
			// If Email table doesn't exist yet, still return success for now
			if (emailError?.message?.includes("Unknown table") || emailError?.message?.includes("does not exist")) {
				console.warn("Email table not migrated yet, but continuing...");
				return NextResponse.json({ success: true, warning: "Email table not available yet" });
			}
			throw emailError;
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error saving email:", error);
		const errorMessage = error instanceof Error ? error.message : "Internal server error";
		console.error("Full error details:", error);
		return NextResponse.json(
			{ error: errorMessage },
			{ status: 500 }
		);
	}
}

