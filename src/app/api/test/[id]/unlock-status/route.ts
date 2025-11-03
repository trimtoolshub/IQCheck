import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const test = await prisma.testSession.findUnique({ where: { id } });

		if (!test) {
			return NextResponse.json({ error: "Test session not found" }, { status: 404 });
		}

		return NextResponse.json({
			unlocked: test.unlocked,
			paid: test.paid,
			shareCount: test.shareCount,
			adViews: test.adViews,
			email: test.email || null,
			sharesRemaining: Math.max(0, 5 - test.shareCount),
			countryCode: test.countryCode || null,
		});
	} catch (error) {
		console.error("Error getting unlock status:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 }
		);
	}
}

