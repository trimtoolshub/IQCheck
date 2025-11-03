"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StartTestPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const startTest = async () => {
		setLoading(true);
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
			
			const res = await fetch("/api/test/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ domain: "IQ" }),
				signal: controller.signal,
			});
			clearTimeout(timeoutId);
			
			if (!res.ok) {
				const text = await res.text();
				alert(`Failed to start test: ${res.status} ${text}`);
				setLoading(false);
				return;
			}
			const data = await res.json();
			router.push(`/test/${data.id}`);
		} catch (error: any) {
			console.error("Error starting test:", error);
			if (error.name === 'AbortError') {
				alert("Request timed out. Please check if the server is running and try again.");
			} else {
				alert("Something went wrong. Please try again.");
			}
			setLoading(false);
		}
	};

	return (
		<div className="min-h-dvh bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center p-6">
			<div className="w-full max-w-lg space-y-8 text-center">
				<div className="space-y-4">
					<h1 className="text-4xl md:text-5xl font-bold text-gray-900">
						Ready to Discover Your Intelligence?
					</h1>
					<p className="text-xl text-gray-600">
						This test will assess your cognitive abilities and provide insights into your intellectual strengths.
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
					<div className="space-y-4 text-left">
						<div className="flex items-start gap-3">
							<div className="text-2xl">⏱️</div>
							<div>
								<h3 className="font-semibold text-gray-900 mb-1">Time Required</h3>
								<p className="text-gray-600 text-sm">Approximately 5-10 minutes</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="text-2xl">📝</div>
							<div>
								<h3 className="font-semibold text-gray-900 mb-1">What to Expect</h3>
								<p className="text-gray-600 text-sm">Multiple choice questions covering various cognitive skills</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="text-2xl">🎯</div>
							<div>
								<h3 className="font-semibold text-gray-900 mb-1">Adaptive Testing</h3>
								<p className="text-gray-600 text-sm">Questions adjust to your skill level for accurate results</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="text-2xl">📊</div>
							<div>
								<h3 className="font-semibold text-gray-900 mb-1">Instant Results</h3>
								<p className="text-gray-600 text-sm">Get your IQ score and cognitive profile immediately</p>
							</div>
						</div>
					</div>

					<button
						onClick={startTest}
						disabled={loading}
						className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 text-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
					>
						{loading ? "Starting Test..." : "Begin IQ Test"}
					</button>

					<p className="text-sm text-gray-500">
						No sign-up required • Free to take • Your results are private
					</p>
				</div>
			</div>
		</div>
	);
}


