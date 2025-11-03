"use client";
import { useEffect, useState } from "react";

type AdminStats = {
	revenue: {
		total: number;
		fromPayments: number;
		fromAds: number;
		paymentCount: number;
		adViewCount: number;
	};
	emails: {
		total: number;
		subscribed: number;
	};
	tests: {
		total: number;
		completed: number;
		unlocked: number;
		paid: number;
	};
	shares: {
		total: number;
		byPlatform: { platform: string; count: number }[];
	};
	ads: {
		byProvider: { provider: string; revenue: number; count: number }[];
	};
	recentPayments: {
		id: string;
		amount: number;
		currency: string;
		email: string | null;
		createdAt: string;
	}[];
};

type Email = {
	id: string;
	email: string;
	source: string;
	subscribed: boolean;
	createdAt: string;
	testSession: any;
};

export default function AdminPage() {
	const [stats, setStats] = useState<AdminStats | null>(null);
	const [emails, setEmails] = useState<Email[]>([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<"dashboard" | "emails">("dashboard");
	const [emailSubject, setEmailSubject] = useState("");
	const [emailBody, setEmailBody] = useState("");
	const [testEmail, setTestEmail] = useState("");
	const [sendingEmail, setSendingEmail] = useState(false);

	useEffect(() => {
		loadStats();
		loadEmails();
	}, []);

	async function loadStats() {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
			
			const res = await fetch("/api/admin/stats", {
				signal: controller.signal,
			});
			clearTimeout(timeoutId);
			
			if (res.ok) {
				const data = await res.json();
				setStats(data);
			} else {
				const errorData = await res.json().catch(() => ({}));
				
				// Show zero stats if unauthorized (will show empty state message)
				if (res.status === 401 || res.status === 403) {
					// Set empty stats so UI can show helpful message
					// Don't log as error - this is expected when not signed in
					setStats({
						revenue: { total: 0, fromPayments: 0, fromAds: 0, paymentCount: 0, adViewCount: 0 },
						emails: { total: 0, subscribed: 0 },
						tests: { total: 0, completed: 0, unlocked: 0, paid: 0 },
						shares: { total: 0, byPlatform: [] },
						ads: { byProvider: [] },
						recentPayments: [],
						authError: true,
						errorMessage: errorData.error || "Unauthorized - Please sign in with an admin account",
					} as any);
				} else {
					// For other errors, log and show error
					console.error("Failed to load stats:", res.status, errorData);
					setStats({
						revenue: { total: 0, fromPayments: 0, fromAds: 0, paymentCount: 0, adViewCount: 0 },
						emails: { total: 0, subscribed: 0 },
						tests: { total: 0, completed: 0, unlocked: 0, paid: 0 },
						shares: { total: 0, byPlatform: [] },
						ads: { byProvider: [] },
						recentPayments: [],
						error: true,
						errorMessage: errorData.error || "Failed to load stats",
					} as any);
				}
			}
		} catch (e: any) {
			console.error("Failed to load stats:", e);
			// Set empty stats on error so page can render
			if (e.name === 'AbortError') {
				setStats({
					revenue: { total: 0, fromPayments: 0, fromAds: 0, paymentCount: 0, adViewCount: 0 },
					emails: { total: 0, subscribed: 0 },
					tests: { total: 0, completed: 0, unlocked: 0, paid: 0 },
					shares: { total: 0, byPlatform: [] },
					ads: { byProvider: [] },
					recentPayments: [],
					error: true,
					errorMessage: "Request timed out. Is the server running?",
				} as any);
			} else {
				setStats({
					revenue: { total: 0, fromPayments: 0, fromAds: 0, paymentCount: 0, adViewCount: 0 },
					emails: { total: 0, subscribed: 0 },
					tests: { total: 0, completed: 0, unlocked: 0, paid: 0 },
					shares: { total: 0, byPlatform: [] },
					ads: { byProvider: [] },
					recentPayments: [],
					error: true,
					errorMessage: e.message || "Failed to load stats",
				} as any);
			}
		} finally {
			setLoading(false);
		}
	}

	async function loadEmails() {
		try {
			const res = await fetch("/api/admin/emails");
			if (res.ok) {
				const data = await res.json();
				setEmails(data.emails || []);
			}
		} catch (e) {
			console.error("Failed to load emails:", e);
		}
	}

	async function sendEmail(testOnly = false) {
		if (!emailSubject || !emailBody) {
			alert("Please fill in subject and body");
			return;
		}

		if (testOnly && !testEmail) {
			alert("Please enter a test email address");
			return;
		}

		setSendingEmail(true);
		try {
			const res = await fetch("/api/admin/emails", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					subject: emailSubject,
					body: emailBody,
					testEmail: testOnly ? testEmail : null,
				}),
			});

			const data = await res.json();
			if (res.ok) {
				alert(testOnly 
					? `Test email prepared for ${testEmail}`
					: `Email prepared for ${data.recipients} subscribers`
				);
				if (!testOnly) {
					setEmailSubject("");
					setEmailBody("");
				}
			} else {
				alert(`Error: ${data.error}`);
			}
		} catch (e) {
			alert("Failed to send email");
		} finally {
			setSendingEmail(false);
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading admin panel...</p>
				</div>
			</div>
		);
	}

	if (!stats) {
		return (
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="max-w-7xl mx-auto">
					<div className="mb-6">
						<h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
						<p className="text-gray-600">Manage your IQ test platform</p>
					</div>
					<div className="bg-white rounded-xl shadow-lg p-8 text-center">
						<div className="text-5xl mb-4">⚠️</div>
						<h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
						<p className="text-gray-700 mb-4">
							You need to be signed in with an admin account to access this panel.
						</p>
						<div className="space-y-2 text-left bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
							<p className="font-semibold">To fix this:</p>
							<ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
								<li>Make sure you're signed in with your admin email</li>
								<li>If you created an admin user via API, sign in with Google/Facebook using that email</li>
								<li>Or update your user role in the database: <code className="bg-gray-200 px-1 rounded">UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';</code></li>
							</ol>
						</div>
						<div className="mt-6">
							<a href="/" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700">
								Go to Homepage
							</a>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
					<p className="text-gray-600">Manage your IQ test platform</p>
				</div>

				{/* Tabs */}
				<div className="border-b border-gray-200 mb-6">
					<nav className="-mb-px flex space-x-8">
						<button
							onClick={() => setActiveTab("dashboard")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "dashboard"
									? "border-purple-500 text-purple-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							Dashboard
						</button>
						<button
							onClick={() => setActiveTab("emails")}
							className={`py-4 px-1 border-b-2 font-medium text-sm ${
								activeTab === "emails"
									? "border-purple-500 text-purple-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							Email Management
						</button>
					</nav>
				</div>

				{activeTab === "dashboard" && stats && (
					<div className="space-y-6">
						{/* General Error State */}
						{(stats as any).error && !(stats as any).authError ? (
							<div className="bg-white rounded-xl shadow-lg p-12 text-center">
								<div className="text-5xl mb-4">⚠️</div>
								<h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
								<p className="text-gray-700 mb-6">
									{(stats as any).errorMessage || "Failed to load dashboard data"}
								</p>
								<button
									onClick={() => {
										setLoading(true);
										loadStats();
									}}
									className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
								>
									Retry
								</button>
							</div>
						) : (stats as any).authError ? (
							/* Auth Error State */
							<div className="bg-white rounded-xl shadow-lg p-12 text-center">
								<div className="text-5xl mb-4">🔒</div>
								<h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
								<p className="text-gray-700 mb-6">
									{(stats as any).errorMessage || "You need to be signed in with an admin account."}
								</p>
								<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto text-left">
									<h3 className="font-semibold text-yellow-900 mb-3">How to Fix:</h3>
									<ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800">
										<li>Make sure you're signed in with your admin email: <strong>maniz783@gmail.com</strong></li>
										<li>If you just created the admin user, sign out and sign back in</li>
										<li>Or check the browser console (F12) for more error details</li>
									</ol>
								</div>
								<div className="mt-6">
									<a 
										href="/" 
										className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 mr-3"
									>
										Go to Homepage
									</a>
									<button
										onClick={() => loadStats()}
										className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
									>
										Retry Loading
									</button>
								</div>
							</div>
						) : stats.revenue.total === 0 && stats.tests.total === 0 && stats.emails.total === 0 ? (
							/* Empty State - No Data Yet */
							<div className="bg-white rounded-xl shadow-lg p-12 text-center">
								<div className="text-6xl mb-4">📊</div>
								<h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h2>
								<p className="text-gray-600 mb-6">
									Your dashboard will populate with data as users complete tests, make payments, watch ads, and submit their emails.
								</p>
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto text-left">
									<h3 className="font-semibold text-blue-900 mb-3">Current Stats:</h3>
									<ul className="space-y-2 text-sm text-blue-800">
										<li>💰 Revenue: $0.00 (no payments or ads yet)</li>
										<li>📧 Total Emails: {stats.emails.total}</li>
										<li>📝 Total Tests: {stats.tests.total}</li>
										<li>📤 Total Shares: {stats.shares.total}</li>
									</ul>
								</div>
							</div>
						) : (
							<div>
								{/* Revenue Cards */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="bg-white rounded-xl shadow-lg p-6">
										<div className="text-2xl font-bold text-green-600">${stats.revenue.total.toFixed(2)}</div>
										<div className="text-gray-600 mt-1">Total Revenue</div>
										<div className="text-sm text-gray-500 mt-2">
											${stats.revenue.fromPayments.toFixed(2)} from payments<br />
											${stats.revenue.fromAds.toFixed(2)} from ads
										</div>
									</div>
							<div className="bg-white rounded-xl shadow-lg p-6">
								<div className="text-2xl font-bold text-blue-600">{stats.revenue.paymentCount}</div>
								<div className="text-gray-600 mt-1">Successful Payments</div>
								<div className="text-sm text-gray-500 mt-2">
									{stats.tests.paid} tests paid
								</div>
							</div>
							<div className="bg-white rounded-xl shadow-lg p-6">
								<div className="text-2xl font-bold text-orange-600">{stats.revenue.adViewCount}</div>
								<div className="text-gray-600 mt-1">Ad Views</div>
								<div className="text-sm text-gray-500 mt-2">
									${stats.revenue.fromAds.toFixed(2)} earned
								</div>
							</div>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="bg-white rounded-xl shadow-lg p-6">
								<div className="text-2xl font-bold text-purple-600">{stats.emails.total}</div>
								<div className="text-gray-600">Total Emails</div>
								<div className="text-sm text-gray-500 mt-1">{stats.emails.subscribed} subscribed</div>
							</div>
							<div className="bg-white rounded-xl shadow-lg p-6">
								<div className="text-2xl font-bold text-indigo-600">{stats.tests.total}</div>
								<div className="text-gray-600">Total Tests</div>
								<div className="text-sm text-gray-500 mt-1">{stats.tests.completed} completed</div>
							</div>
							<div className="bg-white rounded-xl shadow-lg p-6">
								<div className="text-2xl font-bold text-pink-600">{stats.tests.unlocked}</div>
								<div className="text-gray-600">Unlocked Tests</div>
								<div className="text-sm text-gray-500 mt-1">{stats.tests.paid} paid</div>
							</div>
							<div className="bg-white rounded-xl shadow-lg p-6">
								<div className="text-2xl font-bold text-teal-600">{stats.shares.total}</div>
								<div className="text-gray-600">Total Shares</div>
								<div className="text-sm text-gray-500 mt-1">
									{stats.shares.byPlatform.map(s => `${s.platform}: ${s.count}`).join(", ")}
								</div>
							</div>
						</div>

						{/* Ad Providers */}
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h2 className="text-xl font-semibold mb-4">Ad Revenue by Provider</h2>
							{stats.ads.byProvider.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									<p>No ad views yet</p>
								</div>
							) : (
								<div className="space-y-2">
									{stats.ads.byProvider.map((provider) => (
										<div key={provider.provider} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
											<span className="font-medium">{provider.provider}</span>
											<span className="text-gray-600">
												${provider.revenue.toFixed(2)} ({provider.count} views)
											</span>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Recent Payments */}
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="border-b">
											<th className="text-left p-2">Email</th>
											<th className="text-left p-2">Amount</th>
											<th className="text-left p-2">Date</th>
										</tr>
									</thead>
									<tbody>
										{stats.recentPayments.map((payment) => (
											<tr key={payment.id} className="border-b">
												<td className="p-2">{payment.email || "N/A"}</td>
												<td className="p-2">${payment.amount.toFixed(2)} {payment.currency}</td>
												<td className="p-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
							</div>
						)}
					</div>
				)}

				{activeTab === "emails" && (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Send Email Form */}
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h2 className="text-xl font-semibold mb-4">Send Email to Subscribers</h2>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
									<input
										type="text"
										value={emailSubject}
										onChange={(e) => setEmailSubject(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										placeholder="Email subject"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
									<textarea
										value={emailBody}
										onChange={(e) => setEmailBody(e.target.value)}
										rows={8}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										placeholder="Email body"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">Test Email (optional)</label>
									<input
										type="email"
										value={testEmail}
										onChange={(e) => setTestEmail(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
										placeholder="test@example.com"
									/>
								</div>
								<div className="flex gap-3">
									<button
										onClick={() => sendEmail(true)}
										disabled={sendingEmail}
										className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50"
									>
										{sendingEmail ? "Sending..." : "Send Test"}
									</button>
									<button
										onClick={() => sendEmail(false)}
										disabled={sendingEmail}
										className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
									>
										{sendingEmail ? "Sending..." : "Send to All"}
									</button>
								</div>
							</div>
						</div>

						{/* Email List */}
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h2 className="text-xl font-semibold mb-4">Email List ({emails.length})</h2>
							<div className="space-y-2 max-h-[600px] overflow-y-auto">
								{emails.map((email) => (
									<div key={email.id} className="p-3 bg-gray-50 rounded-lg">
										<div className="flex justify-between items-start">
											<div className="flex-1">
												<div className="font-medium">{email.email}</div>
												<div className="text-sm text-gray-500">
													Source: {email.source} • {email.subscribed ? "Subscribed" : "Unsubscribed"}
												</div>
												<div className="text-xs text-gray-400 mt-1">
													{new Date(email.createdAt).toLocaleDateString()}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
