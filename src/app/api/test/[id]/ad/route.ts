import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Ad revenue per view (in cents) - can be configured
const AD_REVENUE_CENTS = 2; // $0.02 per ad view

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		const { adProvider = "google" } = await req.json();

		const test = await prisma.testSession.findUnique({ where: { id } });
		if (!test) {
			return NextResponse.json({ error: "Test session not found" }, { status: 404 });
		}

		// Record ad view
		await prisma.adView.create({
			data: {
				testSessionId: id,
				adProvider,
				revenueCents: AD_REVENUE_CENTS,
			},
		});

		// Update ad views count and unlock after 5 ads (5 shares = 5 ads)
		const newAdViews = test.adViews + 1;
		const requiredAds = 5; // Must watch 5 ads (one after each share)
		const unlocked = (newAdViews >= requiredAds && test.shareCount >= 5) || test.paid || test.unlocked;

		await prisma.testSession.update({
			where: { id },
			data: {
				adViews: newAdViews,
				unlocked: unlocked,
			},
		});

		return NextResponse.json({ 
			success: true, 
			adViews: newAdViews,
			unlocked: unlocked,
		});
	} catch (error) {
		console.error("Error recording ad view:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 }
		);
	}
}

