"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

type TestResults = {
	percentile: number;
	iqCategory: string;
	accuracy: number;
	totalQuestions: number;
	correctAnswers: number;
	personalityTraits: string[];
	strengths: {
		verbal: number;
		mathematical: number;
		logical: number;
		patternRecognition: number;
	};
};

type IncorrectAnswer = {
	questionId: string;
	questionText: string;
	selectedOption: string;
	selectedOptionText: string;
	correctOption: string;
	correctOptionText: string;
	explanation: string;
	difficulty: number;
	options?: any[];
};

type UnlockStatus = {
	unlocked: boolean;
	paid: boolean;
	shareCount: number;
	adViews: number;
	email: string | null;
	sharesRemaining: number;
};

export default function ReportPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
	const router = useRouter();
	const { id } = use(params);
	const resolvedSearchParams = use(searchParams);
	const [email, setEmail] = useState("");
	const [emailSubmitted, setEmailSubmitted] = useState(false);
	const [unlockStatus, setUnlockStatus] = useState<UnlockStatus>({
		unlocked: false,
		paid: false,
		shareCount: 0,
		adViews: 0,
		email: null,
		sharesRemaining: 5,
	});
	const [shareUrl, setShareUrl] = useState(`/test/${id}/report`);
	const [results, setResults] = useState<TestResults | null>(null);
	const [loading, setLoading] = useState(true);
	const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
	const [showIncorrect, setShowIncorrect] = useState(false);
	const [watchingAd, setWatchingAd] = useState(false);
	const [emailError, setEmailError] = useState("");
	const [submittingEmail, setSubmittingEmail] = useState(false);
	const [showAdModal, setShowAdModal] = useState(false);
	const [countryCode, setCountryCode] = useState<string | null>(null);
	
	// Determine if user is from Pakistan
	const isPakistan = countryCode?.toUpperCase() === "PK";
	const paymentAmount = isPakistan ? "PKR 99" : "$0.99 USD";
	const paymentCurrency = isPakistan ? "PKR" : "USD";
	
	useEffect(() => {
		const origin = typeof window !== 'undefined' ? window.location.origin : '';
		setShareUrl(`${origin}/test/${id}/report`);
		
		// Check if paid from query params
		const paid = resolvedSearchParams?.paid === "true";
		if (paid) {
			setUnlockStatus(prev => ({ ...prev, paid: true, unlocked: true }));
		}
	}, [id, resolvedSearchParams]);

	useEffect(() => {
		// Load unlock status
		fetch(`/api/test/${id}/unlock-status`)
			.then(async r => {
				if (r.ok) {
					const data = await r.json();
					setUnlockStatus(data);
					setEmailSubmitted(!!data.email);
					if (data.email) setEmail(data.email);
					// Set country code if available
					if (data.countryCode) {
						setCountryCode(data.countryCode);
					}
				}
			})
			.catch(e => console.error("Failed to load unlock status:", e));

		// Load results
		fetch(`/api/test/${id}/results`)
			.then(async r => {
				const data = await r.json();
				if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
				setResults(data);
			})
			.catch((e) => {
				console.error("Failed to load results:", e);
				setResults({
					percentile: 50,
					iqCategory: "Average",
					accuracy: 0,
					totalQuestions: 0,
					correctAnswers: 0,
					personalityTraits: [],
					strengths: { verbal: 0, mathematical: 0, logical: 0, patternRecognition: 0 },
					error: e instanceof Error ? e.message : "Unknown error",
				} as any);
			})
			.finally(() => setLoading(false));

		// Load incorrect answers
		fetch(`/api/test/${id}/incorrect`)
			.then(async r => {
				if (r.ok) {
					const data = await r.json();
					setIncorrectAnswers(data.incorrectAnswers || []);
				}
			})
			.catch((e) => console.error("Failed to load incorrect answers:", e));
	}, [id]);

	async function submitEmail(e: React.FormEvent) {
		e.preventDefault();
		setEmailError("");
		
		if (!email || !email.includes("@")) {
			setEmailError("Please enter a valid email address");
			return;
		}
		
		setSubmittingEmail(true);
		try {
			const res = await fetch(`/api/test/${id}/email`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			
			let data;
			try {
				data = await res.json();
			} catch (parseError) {
				// If response isn't JSON, still proceed
				console.warn("Non-JSON response:", parseError);
				if (res.ok || res.status === 200) {
					// If status is OK, proceed anyway
					setEmailSubmitted(true);
					setUnlockStatus(prev => ({ ...prev, email }));
					setSubmittingEmail(false);
					return;
				}
				throw new Error("Invalid response from server");
			}
			
			if (res.ok || data.success) {
				setEmailSubmitted(true);
				setUnlockStatus(prev => ({ ...prev, email }));
			} else {
				// Even if saving fails, allow user to proceed (graceful degradation)
				console.warn("Email save failed, but proceeding:", data.error);
				setEmailSubmitted(true);
				setUnlockStatus(prev => ({ ...prev, email }));
			}
		} catch (error) {
			console.error("Email submission error:", error);
			// Even on error, allow user to proceed (don't block them)
			setEmailSubmitted(true);
			setUnlockStatus(prev => ({ ...prev, email }));
		} finally {
			setSubmittingEmail(false);
		}
	}

	async function handleShare(platform: string) {
		try {
			// Record share first
			const res = await fetch(`/api/test/${id}/share`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ platform }),
			});
			
			if (res.ok) {
				const data = await res.json();
				setUnlockStatus(prev => ({
					...prev,
					shareCount: data.shareCount,
					unlocked: data.unlocked || prev.unlocked,
					sharesRemaining: data.sharesRemaining,
				}));
				
				// Show ad after share
				setTimeout(() => {
					watchAd();
				}, 500);
				
				// Open share window
				const shareUrls: Record<string, string> = {
					facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
					instagram: `https://www.instagram.com/`,
					link: shareUrl,
				};
				
				if (shareUrls[platform]) {
					window.open(shareUrls[platform], "_blank", "width=600,height=400");
				} else {
					// Copy link to clipboard
					navigator.clipboard.writeText(shareUrl).then(() => {
						alert("Link copied to clipboard! Share it with your friends.");
					}).catch(() => {
						// Fallback
						const textArea = document.createElement("textarea");
						textArea.value = shareUrl;
						document.body.appendChild(textArea);
						textArea.select();
						document.execCommand("copy");
						document.body.removeChild(textArea);
						alert("Link copied to clipboard!");
					});
				}
			} else {
				const errorData = await res.json().catch(() => ({}));
				console.error("Share error:", errorData);
				alert("Failed to record share. Please try again.");
			}
		} catch (error) {
			console.error("Share error:", error);
			alert("Failed to share. Please try again.");
		}
	}

	async function watchAd() {
		setShowAdModal(true);
		setWatchingAd(true);
		
		// Trigger AdSense after modal opens
		setTimeout(() => {
			if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
				try {
					((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
				} catch (e) {
					console.log("AdSense error:", e);
				}
			}
		}, 100);
	}

	async function completeAdView() {
		const res = await fetch(`/api/test/${id}/ad`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ adProvider: "google-adsense" }),
		});
		
		if (res.ok) {
			const data = await res.json();
			setUnlockStatus(prev => ({
				...prev,
				adViews: data.adViews,
				unlocked: data.unlocked || prev.unlocked,
			}));
			
			// Check if unlocked after this ad
			if (data.unlocked) {
				alert("🎉 Report unlocked! You can now view all details.");
			}
		}
		setWatchingAd(false);
		setShowAdModal(false);
	}

	async function checkout() {
		try {
			const res = await fetch("/api/checkout/session", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
					testSessionId: id,
					countryCode: countryCode || null,
				}),
			});
			
			if (!res.ok) {
				const errorText = await res.text();
				let errorMessage = `Failed to create checkout session: ${res.status}`;
				try {
					const errorData = JSON.parse(errorText);
					errorMessage = errorData.error || errorMessage;
				} catch {
					errorMessage = errorText || errorMessage;
				}
				alert(errorMessage);
				return;
			}
			
			const text = await res.text();
			if (!text) {
				alert("Empty response from server");
				return;
			}
			
			const data = JSON.parse(text);
			if (data.url) {
				window.location.href = data.url;
			} else {
				alert("No checkout URL received");
			}
		} catch (error: any) {
			console.error("Checkout error:", error);
			alert(`Error: ${error.message || "Failed to process payment"}`);
		}
	}

	if (loading) {
		return (
			<div className="min-h-dvh flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
					<p className="text-lg text-gray-700">Loading your results...</p>
				</div>
			</div>
		);
	}

	if (!results || (results as any).error) {
		return (
			<div className="min-h-dvh bg-gray-50 flex items-center justify-center p-6">
				<div className="max-w-2xl w-full text-center bg-white rounded-2xl shadow-xl p-8">
					<div className="text-5xl mb-4">⚠️</div>
					<h2 className="text-2xl font-bold text-red-600 mb-4">Failed to Load Results</h2>
					<p className="text-gray-700 mb-4">
						{(results as any)?.error || "No results available. Make sure you've completed the test."}
					</p>
					<a href="/test/start" className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 font-semibold hover:shadow-xl transition-all">
						Start New Test
					</a>
				</div>
			</div>
		);
	}

	// Email collection screen
	if (!emailSubmitted) {
		return (
			<div className="min-h-dvh bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
				<div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
					<div className="text-center mb-6">
						<div className="text-6xl mb-4">📧</div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Save Your Results</h1>
						<p className="text-gray-600">Enter your email to receive your IQ test results and keep them saved.</p>
					</div>
					<form onSubmit={submitEmail} className="space-y-4">
						<input
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
								setEmailError("");
							}}
							placeholder="your@email.com"
							className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none text-lg ${
								emailError ? "border-red-500" : "border-gray-300 focus:border-purple-500"
							}`}
							required
							disabled={submittingEmail}
						/>
						{emailError && (
							<div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
								{emailError}
							</div>
						)}
						<button
							type="submit"
							disabled={submittingEmail}
							className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submittingEmail ? "Saving..." : "Continue to Results"}
						</button>
					</form>
				</div>
			</div>
		);
	}

	const isUnlocked = unlockStatus.unlocked || unlockStatus.paid;

	return (
		<div className="min-h-dvh bg-gray-50 py-12 px-6">
			<div className="max-w-4xl mx-auto space-y-8">
				<div className="text-center space-y-2">
					<h1 className="text-4xl font-bold text-gray-900">Your IQ Test Results</h1>
					<p className="text-gray-600">Comprehensive analysis of your cognitive performance</p>
				</div>

				{/* Main Score Card */}
				<div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white text-center space-y-4">
					<div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
						{results.iqCategory}
					</div>
					<div className="space-y-2">
						<div className="text-7xl font-bold">{results.percentile}%</div>
						<div className="text-2xl">Percentile Rank</div>
						<div className="text-lg opacity-90 mt-2">
							You scored higher than <strong>{results.percentile}%</strong> of the global population
						</div>
					</div>
					<div className="text-white/90 pt-4 border-t border-white/20">
						You answered <strong>{results.correctAnswers} out of {results.totalQuestions}</strong> questions correctly ({results.accuracy}% accuracy)
					</div>
				</div>

				{/* Personality Traits */}
				<div className="bg-white rounded-xl shadow-lg p-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Cognitive Profile</h2>
					<div className="flex flex-wrap gap-3">
						{results.personalityTraits.map((trait, idx) => (
							<div key={idx} className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
								{trait}
							</div>
						))}
					</div>
				</div>

				{/* Unlock Section */}
				{!isUnlocked ? (
					<div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
						<h2 className="text-2xl font-semibold text-gray-900 text-center">Unlock Full Report</h2>
						<p className="text-center text-gray-600">Share with 5 friends and watch an ad after each share, OR pay {paymentAmount} for instant access</p>
						
						{/* Share Progress */}
						<div className="bg-gray-50 rounded-lg p-6 text-center">
							<div className="text-3xl font-bold text-purple-600 mb-2">{unlockStatus.shareCount}/5</div>
							<div className="text-gray-600 mb-4">Shares Completed</div>
							<div className="w-full bg-gray-200 rounded-full h-3 mb-2">
								<div 
									className="bg-purple-600 h-3 rounded-full transition-all" 
									style={{ width: `${(unlockStatus.shareCount / 5) * 100}%` }}
								></div>
							</div>
							<div className="text-sm text-gray-500">
								{unlockStatus.adViews}/5 ads watched
							</div>
						</div>

						{/* Share Options */}
						<div className="space-y-3">
							<h3 className="font-semibold text-gray-900">Share with Friends</h3>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								<button
									onClick={() => handleShare("facebook")}
									className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
								>
									📘 Facebook
								</button>
								<button
									onClick={() => handleShare("instagram")}
									className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
								>
									📷 Instagram
								</button>
								<button
									onClick={() => {
										navigator.clipboard.writeText(shareUrl).then(() => {
											handleShare("link");
											alert("Link copied! Share it with your friends.");
										}).catch(() => {
											const textArea = document.createElement("textarea");
											textArea.value = shareUrl;
											document.body.appendChild(textArea);
											textArea.select();
											document.execCommand("copy");
											document.body.removeChild(textArea);
											handleShare("link");
											alert("Link copied!");
										});
									}}
									className="border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
								>
									🔗 Copy Link
								</button>
							</div>
							<p className="text-xs text-gray-500 text-center mt-2">
								After each share, watch an ad to proceed. 5 shares + 5 ads = unlocked report!
							</p>
						</div>

						<div className="pt-6 border-t border-gray-200">
							<div className="text-center mb-4">
								<p className="text-gray-600 mb-2 font-medium">Or skip sharing - get instant access</p>
							</div>
							<button
								onClick={checkout}
								className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all"
							>
								💰 Pay {paymentAmount} - Instant Access
							</button>
						</div>
					</div>
				) : (
					<>
						{/* Detailed Breakdown - Only shown when unlocked */}
						<div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
							<h2 className="text-2xl font-semibold text-gray-900">Detailed Breakdown</h2>
							<div className="space-y-4">
								<div>
									<div className="flex justify-between mb-2">
										<span className="text-gray-700 font-medium">Verbal Reasoning</span>
										<span className="text-gray-900 font-semibold">{results.strengths.verbal}%</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3">
										<div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${results.strengths.verbal}%` }}></div>
									</div>
								</div>
								<div>
									<div className="flex justify-between mb-2">
										<span className="text-gray-700 font-medium">Mathematical Reasoning</span>
										<span className="text-gray-900 font-semibold">{results.strengths.mathematical}%</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3">
										<div className="bg-green-600 h-3 rounded-full transition-all" style={{ width: `${results.strengths.mathematical}%` }}></div>
									</div>
								</div>
								<div>
									<div className="flex justify-between mb-2">
										<span className="text-gray-700 font-medium">Logical Reasoning</span>
										<span className="text-gray-900 font-semibold">{results.strengths.logical}%</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3">
										<div className="bg-purple-600 h-3 rounded-full transition-all" style={{ width: `${results.strengths.logical}%` }}></div>
									</div>
								</div>
								<div>
									<div className="flex justify-between mb-2">
										<span className="text-gray-700 font-medium">Pattern Recognition</span>
										<span className="text-gray-900 font-semibold">{results.strengths.patternRecognition}%</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-3">
										<div className="bg-orange-600 h-3 rounded-full transition-all" style={{ width: `${results.strengths.patternRecognition}%` }}></div>
									</div>
								</div>
							</div>
						</div>

						{/* Incorrect Answers Review */}
						{incorrectAnswers.length > 0 && (
							<div className="bg-white rounded-xl shadow-lg p-8">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-2xl font-semibold text-gray-900">Review Incorrect Answers</h2>
									<button
										onClick={() => setShowIncorrect(!showIncorrect)}
										className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
									>
										{showIncorrect ? "Hide" : "Show"} ({incorrectAnswers.length})
									</button>
								</div>
								
								{showIncorrect && (
									<div className="space-y-6">
										{incorrectAnswers.map((item, idx) => (
											<div key={item.questionId} className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
												<div className="flex items-start justify-between mb-4">
													<h3 className="text-lg font-semibold text-gray-900">Question {idx + 1}</h3>
													<span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
														Difficulty: {item.difficulty}/5
													</span>
												</div>
												<p className="text-gray-800 font-medium mb-4">{item.questionText}</p>
												
												<div className="space-y-3">
													<div className="flex items-start gap-3">
														<span className="text-red-600 font-bold text-xl">✗</span>
														<div className="flex-1">
															<div className="text-sm font-medium text-gray-600 mb-1">Your Answer:</div>
															<div className="text-red-700 font-semibold text-lg">{item.selectedOptionText}</div>
															{item.selectedOption && <div className="text-xs text-gray-500 mt-1">Option: {item.selectedOption}</div>}
														</div>
													</div>
													<div className="flex items-start gap-3">
														<span className="text-green-600 font-bold text-xl">✓</span>
														<div className="flex-1">
															<div className="text-sm font-medium text-gray-600 mb-1">Correct Answer:</div>
															<div className="text-green-700 font-semibold text-lg">{item.correctOptionText}</div>
															<div className="text-xs text-gray-500 mt-1">Option: {item.correctOption}</div>
														</div>
													</div>
													<div className="mt-4 pt-4 border-t border-gray-300 bg-white rounded-lg p-4">
														<div className="text-sm font-semibold text-gray-700 mb-2">📝 Explanation:</div>
														<p className="text-gray-700 leading-relaxed">{item.explanation}</p>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</>
				)}

				{/* Share Section */}
				{isUnlocked && (
					<div className="bg-white rounded-xl shadow-lg p-8">
						<h2 className="text-xl font-semibold text-gray-900 mb-4">Share Your Results</h2>
						<div className="flex gap-3 flex-wrap">
							<a
								className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-6 py-3 font-medium hover:bg-blue-700 transition-colors"
								target="_blank"
								href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
								onClick={() => handleShare("facebook")}
							>
								📘 Share on Facebook
							</a>
							<button
								className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity"
								onClick={() => {
									handleShare("instagram");
									window.open(`https://www.instagram.com/`, "_blank");
								}}
							>
								📷 Share on Instagram
							</button>
						</div>
					</div>
				)}

				{/* Ad Modal */}
				{showAdModal && (
					<div 
						className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
						onClick={(e) => {
							if (e.target === e.currentTarget) {
								setShowAdModal(false);
								setWatchingAd(false);
							}
						}}
					>
						<div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-xl font-bold text-gray-900">Watch Ad to Continue</h3>
								<button
									onClick={() => {
										setShowAdModal(false);
										setWatchingAd(false);
									}}
									className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
								>
									×
								</button>
							</div>
							<div className="mb-4">
								<div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-8 text-center min-h-[300px] flex items-center justify-center">
									<div className="w-full">
										<ins
											className="adsbygoogle"
											style={{ display: 'block' }}
											data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-YOUR_PUBLISHER_ID"}
											data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || "YOUR_AD_SLOT_ID"}
											data-ad-format="auto"
											data-full-width-responsive="true"
										></ins>
										<div className="text-gray-500 text-sm mt-4">
											<p className="mb-2 font-medium">📺 Ad will appear here</p>
											<p className="text-xs">Please watch the ad for 10 seconds to continue</p>
											<p className="text-xs mt-2 text-gray-400">(Configure Google AdSense in .env.local)</p>
										</div>
									</div>
								</div>
							</div>
							<div className="flex gap-3">
								<button
									onClick={() => {
										setShowAdModal(false);
										setWatchingAd(false);
									}}
									className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
								>
									Skip Ad
								</button>
								<button
									onClick={completeAdView}
									className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
								>
									I Watched the Ad ✓
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
