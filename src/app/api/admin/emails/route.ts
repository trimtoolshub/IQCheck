import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

// GET - List all emails
export async function GET(req: NextRequest) {
	try {
		let session = null;
		if (typeof auth === 'function') {
			try {
				// Add timeout to auth call
				const authPromise = auth();
				const timeoutPromise = new Promise((_, reject) => 
					setTimeout(() => reject(new Error("Auth timeout")), 5000)
				);
				session = await Promise.race([authPromise, timeoutPromise]) as any;
			} catch (authError: any) {
				console.error("Auth error:", authError);
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}
		}
		
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const user = await prisma.user.findUnique({ where: { id: session.user.id } });
		if (!user || user.role !== "ADMIN") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { searchParams } = new URL(req.url);
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "50");
		const skip = (page - 1) * limit;

		const emails = await prisma.email.findMany({
			skip,
			take: limit,
			orderBy: { createdAt: "desc" },
			include: {
				session: {
					select: {
						id: true,
						email: true,
						status: true,
						paid: true,
						unlocked: true,
						completedAt: true,
					},
				},
			},
		});

		const total = await prisma.email.count();

		return NextResponse.json({
			emails: emails.map(e => ({
				id: e.id,
				email: e.email,
				source: e.source,
				subscribed: e.subscribed,
				createdAt: e.createdAt,
				testSession: e.session,
			})),
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		});
	} catch (error) {
		console.error("Error fetching emails:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 }
		);
	}
}

// POST - Send email to all subscribers
export async function POST(req: NextRequest) {
	try {
		let session = null;
		if (typeof auth === 'function') {
			try {
				session = await auth();
			} catch (authError) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}
		}
		
		if (!session?.user) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const user = await prisma.user.findUnique({ where: { id: session.user.id } });
		if (!user || user.role !== "ADMIN") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const { subject, body, testEmail } = await req.json();

		if (!subject || !body) {
			return NextResponse.json({ error: "Subject and body required" }, { status: 400 });
		}

		// Get all subscribed emails
		const subscribedEmails = await prisma.email.findMany({
			where: { subscribed: true },
			select: { email: true },
		});

		const emailList = subscribedEmails.map(e => e.email);

		// In production, integrate with email service (SendGrid, Mailgun, etc.)
		// For now, return the email list and content
		return NextResponse.json({
			success: true,
			message: testEmail 
				? "Test email would be sent (in production, this would send to actual email service)"
				: `Email prepared for ${emailList.length} subscribers`,
			recipients: testEmail ? [testEmail] : emailList.length,
			subject,
			body,
			// In production, actually send emails here
			sent: false, // Placeholder
		});
	} catch (error) {
		console.error("Error sending emails:", error);
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Internal server error" },
			{ status: 500 }
		);
	}
}

