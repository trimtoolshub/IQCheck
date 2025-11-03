import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(_: NextRequest) {
	try {
		// Check if user is admin with timeout - fail fast if auth hangs
		let session = null;
		let authError = false;
		
		if (typeof auth === 'function') {
			try {
				// Add timeout to auth call - fail after 3 seconds
				const authPromise = auth();
				const timeoutPromise = new Promise<never>((_, reject) => 
					setTimeout(() => reject(new Error("Auth timeout")), 3000)
				);
				session = await Promise.race([authPromise, timeoutPromise]) as any;
			} catch (error: any) {
				console.error("Auth error:", error);
				authError = true;
			}
		}
		
		// If auth timed out or failed, return unauthorized immediately
		if (authError || !session?.user) {
			return NextResponse.json({ 
				error: "Unauthorized - Please sign in",
				authTimeout: authError 
			}, { status: 401 });
		}

		const user = await prisma.user.findUnique({ where: { id: session.user.id } });
		if (!user || user.role !== "ADMIN") {
			return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
		}

		// Get revenue stats
		const totalPayments = await prisma.payment.aggregate({
			where: { status: "SUCCEEDED" },
			_sum: { amountCents: true },
			_count: true,
		});

		const totalAdRevenue = await prisma.adView.aggregate({
			_sum: { revenueCents: true },
			_count: true,
		});

		const totalRevenueCents = (totalPayments._sum.amountCents || 0) + (totalAdRevenue._sum.revenueCents || 0);

		// Get email stats
		const totalEmails = await prisma.email.count();
		const subscribedEmails = await prisma.email.count({ where: { subscribed: true } });

		// Get test stats
		const totalTests = await prisma.testSession.count();
		const completedTests = await prisma.testSession.count({ where: { status: "COMPLETED" } });
		const unlockedTests = await prisma.testSession.count({ where: { unlocked: true } });
		const paidTests = await prisma.testSession.count({ where: { paid: true } });

		// Get share stats
		const totalShares = await prisma.share.count();
		const sharesByPlatform = await prisma.share.groupBy({
			by: ["platform"],
			_count: true,
		});

		// Get ad stats by provider
		const adsByProvider = await prisma.adView.groupBy({
			by: ["adProvider"],
			_sum: { revenueCents: true },
			_count: true,
		});

		// Recent activity
		const recentPayments = await prisma.payment.findMany({
			where: { status: "SUCCEEDED" },
			orderBy: { createdAt: "desc" },
			take: 10,
			include: { session: { select: { email: true } } },
		});

		return NextResponse.json({
			revenue: {
				total: totalRevenueCents / 100, // Convert to dollars
				fromPayments: (totalPayments._sum.amountCents || 0) / 100,
				fromAds: (totalAdRevenue._sum.revenueCents || 0) / 100,
				paymentCount: totalPayments._count,
				adViewCount: totalAdRevenue._count,
			},
			emails: {
				total: totalEmails,
				subscribed: subscribedEmails,
			},
			tests: {
				total: totalTests,
				completed: completedTests,
				unlocked: unlockedTests,
				paid: paidTests,
			},
			shares: {
				total: totalShares,
				byPlatform: sharesByPlatform.map(s => ({ platform: s.platform, count: s._count })),
			},
			ads: {
				byProvider: adsByProvider.map(a => ({
					provider: a.adProvider,
					revenue: (a._sum.revenueCents || 0) / 100,
					count: a._count,
				})),
			},
			recentPayments: recentPayments.map(p => ({
				id: p.id,
				amount: p.amountCents / 100,
				currency: p.currency,
				email: p.session?.email,
				createdAt: p.createdAt,
			})),
		});
	} catch (error) {
		console.error("Error fetching admin stats:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 }
		);
	}
}

