import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const { platform, sharedWith } = await req.json();

		const test = await prisma.testSession.findUnique({ where: { id } });
		if (!test) {
			return NextResponse.json({ error: "Test session not found" }, { status: 404 });
		}

		// Record share
		await prisma.share.create({
			data: {
				testSessionId: id,
				platform: platform || "link",
				sharedWith: sharedWith || null,
			},
		});

		// Update share count
		const newShareCount = test.shareCount + 1;
		const unlocked = newShareCount >= 5; // Unlock after 5 shares

		await prisma.testSession.update({
			where: { id },
			data: {
				shareCount: newShareCount,
				unlocked: unlocked || test.unlocked,
			},
		});

		return NextResponse.json({ 
			success: true, 
			shareCount: newShareCount,
			unlocked: unlocked || test.unlocked,
			sharesRemaining: Math.max(0, 5 - newShareCount),
		});
	} catch (error) {
		console.error("Error recording share:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 }
		);
	}
}

