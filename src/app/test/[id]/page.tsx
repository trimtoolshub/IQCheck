"use client";
import { useEffect, useState, use } from "react";

export default function TestSessionPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const [question, setQuestion] = useState<any>(null);
	const [done, setDone] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [questionNumber, setQuestionNumber] = useState(1);
	const [timeLeft, setTimeLeft] = useState<number>(60);
	const [timerActive, setTimerActive] = useState(false);

	// Get time limit based on difficulty: 1=30s, 2=45s, 3=60s, 4=75s, 5=90s
	const getTimeLimit = (difficulty: number): number => {
		return [30, 45, 60, 75, 90][difficulty - 1] || 60;
	};

	useEffect(() => {
		setLoading(true);
		setError(null);
		fetch(`/api/test/${id}/next`)
			.then(async r => {
				if (!r.ok) {
					const errorData = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
					throw new Error(errorData.error || `HTTP ${r.status}`);
				}
				const text = await r.text();
				if (!text) {
					throw new Error("Empty response from server");
				}
				try {
					const data = JSON.parse(text);
					if (data.done) {
						setDone(true);
						return;
					}
					if (data.error) {
						throw new Error(data.error);
					}
					if (data.question) {
						setQuestion(data.question);
						setSelectedOption(null);
						setIsSubmitting(false);
						const timeLimit = getTimeLimit(data.question.difficulty || 3);
						setTimeLeft(timeLimit);
						setTimerActive(true);
					}
					else throw new Error("No question in response");
				} catch (e) {
					if (e instanceof Error) throw e;
					throw new Error("Failed to parse response");
				}
			})
			.catch((e) => {
				console.error("Failed to fetch question:", e);
				setError(e instanceof Error ? e.message : "Failed to load question");
			})
			.finally(() => {
				setLoading(false);
			});
	}, [id]);

	// Timer effect
	useEffect(() => {
		if (!timerActive || timeLeft <= 0) {
			if (timeLeft <= 0 && question && !isSubmitting && !selectedOption) {
				// Auto-skip when time expires
				skipQuestion();
			}
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					setTimerActive(false);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [timerActive, timeLeft, question, isSubmitting, selectedOption]);

	async function skipQuestion() {
		if (!question || isSubmitting) return;
		setIsSubmitting(true);
		setTimerActive(false);
		
		try {
			// Submit with no answer (skipped)
			await fetch(`/api/test/${id}/answer`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
					questionId: question.id, 
					selectedOption: "", 
					responseTimeMs: getTimeLimit(question.difficulty || 3) * 1000 
				}),
			});
			
			await new Promise(resolve => setTimeout(resolve, 300));
			
			const r = await fetch(`/api/test/${id}/next`);
			if (!r.ok) {
				setIsSubmitting(false);
				return;
			}
			const text = await r.text();
			if (!text) {
				setIsSubmitting(false);
				return;
			}
			try {
				const data = JSON.parse(text);
				if (data.done) {
					setDone(true);
				} else if (data.question) {
					setQuestion(data.question);
					setQuestionNumber(prev => prev + 1);
					setSelectedOption(null);
					const timeLimit = getTimeLimit(data.question.difficulty || 3);
					setTimeLeft(timeLimit);
					setTimerActive(true);
				}
			} catch (e) {
				console.error("Failed to parse JSON:", e);
			}
		} catch (e) {
			console.error("Error skipping question:", e);
		} finally {
			setIsSubmitting(false);
		}
	}

	async function answer(optionId: string) {
		if (!question || isSubmitting) return;
		setSelectedOption(optionId);
		setIsSubmitting(true);
		
		const startTime = Date.now();
		try {
			await fetch(`/api/test/${id}/answer`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ 
					questionId: question.id, 
					selectedOption: optionId, 
					responseTimeMs: Date.now() - startTime 
				}),
			});
			
			// Small delay for better UX
			await new Promise(resolve => setTimeout(resolve, 300));
			
			const r = await fetch(`/api/test/${id}/next`);
			if (!r.ok) {
				setIsSubmitting(false);
				return;
			}
			const text = await r.text();
			if (!text) {
				setIsSubmitting(false);
				return;
			}
			try {
				const data = JSON.parse(text);
				if (data.done) {
					setDone(true);
				} else if (data.question) {
					setQuestion(data.question);
					setQuestionNumber(prev => prev + 1);
					setSelectedOption(null);
					const timeLimit = getTimeLimit(data.question.difficulty || 3);
					setTimeLeft(timeLimit);
					setTimerActive(true);
				}
			} catch (e) {
				console.error("Failed to parse JSON:", e);
			}
		} catch (e) {
			console.error("Error submitting answer:", e);
		} finally {
			setIsSubmitting(false);
		}
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center p-4">
				<div className="w-full max-w-md text-center space-y-4">
					<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
					<p className="text-lg text-gray-700 font-medium">Loading question...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center p-4">
				<div className="w-full max-w-md space-y-4 text-center bg-white rounded-2xl shadow-xl p-8">
					<div className="text-5xl mb-4">⚠️</div>
					<h2 className="text-2xl font-bold text-red-600">Error</h2>
					<p className="text-gray-700">{error}</p>
					<button
						className="inline-block w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
						onClick={() => {
							setLoading(true);
							setError(null);
							fetch(`/api/test/${id}/next`)
								.then(async r => {
									if (!r.ok) {
										const errorData = await r.json().catch(() => ({ error: `HTTP ${r.status}` }));
										throw new Error(errorData.error || `HTTP ${r.status}`);
									}
									const text = await r.text();
									if (!text) throw new Error("Empty response");
									const data = JSON.parse(text);
									if (data.done) setDone(true);
									else if (data.question) {
										setQuestion(data.question);
										setQuestionNumber(1);
									}
									else throw new Error("No question in response");
								})
								.catch((e) => setError(e instanceof Error ? e.message : "Failed to load question"))
								.finally(() => setLoading(false));
						}}
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (done) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center p-4">
				<div className="w-full max-w-md space-y-6 text-center bg-white rounded-2xl shadow-xl p-8">
					<div className="text-6xl mb-4">🎉</div>
					<h2 className="text-3xl font-bold text-gray-900">Test Complete!</h2>
					<p className="text-gray-600 text-lg">Congratulations on completing the IQ test. Your results are ready for review.</p>
					<a 
						className="inline-block w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 text-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all" 
						href={`/test/${id}/report`}
					>
						View Your Results
					</a>
				</div>
			</div>
		);
	}

	if (!question) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center p-4">
				<div className="w-full max-w-md text-center bg-white rounded-2xl shadow-lg p-8">
					<p className="text-lg text-gray-700">No question available.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
			{/* Progress Header */}
			<div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-2xl mx-auto px-4 py-3">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-600">Question {questionNumber}</span>
						<div className="flex items-center gap-3">
							<div className={`text-sm font-bold px-3 py-1 rounded-full ${
								timeLeft <= 10 ? 'bg-red-100 text-red-700 animate-pulse' :
								timeLeft <= 20 ? 'bg-orange-100 text-orange-700' :
								'bg-blue-100 text-blue-700'
							}`}>
								⏱️ {timeLeft}s
							</div>
							<span className="text-sm font-medium text-blue-600">IQ Test</span>
						</div>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div 
							className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
							style={{ width: `${Math.min(100, (questionNumber / 20) * 100)}%` }}
						></div>
					</div>
					{/* Timer Progress Bar */}
					<div className="w-full bg-gray-200 rounded-full h-1 mt-2">
						<div 
							className={`h-1 rounded-full transition-all ${
								timeLeft <= 10 ? 'bg-red-500' :
								timeLeft <= 20 ? 'bg-orange-500' :
								'bg-blue-500'
							}`}
							style={{ width: `${(timeLeft / getTimeLimit(question.difficulty || 3)) * 100}%` }}
						></div>
					</div>
				</div>
			</div>

			{/* Question Content */}
			<div className="flex-1 flex items-center justify-center p-4 pb-8">
				<div className="w-full max-w-2xl space-y-6">
					{/* Question Card */}
					<div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
						<h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
							{question.text}
						</h2>
						
						{/* Options */}
						<div className="space-y-3">
							{question.options.map((o: any) => {
								const isSelected = selectedOption === o.id;
								const isDisabled = isSubmitting || selectedOption !== null;
								
								return (
									<button
										key={o.id}
										onClick={() => answer(o.id)}
										disabled={isDisabled}
										className={`
											w-full text-left p-4 rounded-xl border-2 transition-all duration-200
											${isSelected 
												? 'border-blue-600 bg-blue-50 shadow-md transform scale-[1.02]' 
												: 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
											}
											${isDisabled && !isSelected ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
											${!isDisabled ? 'active:scale-[0.98]' : ''}
										`}
									>
										<div className="flex items-center gap-3">
											<div className={`
												flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
												${isSelected 
													? 'bg-blue-600 text-white' 
													: 'bg-gray-100 text-gray-700 border border-gray-300'
												}
											`}>
												{o.id}
											</div>
											<span className="text-base md:text-lg text-gray-900 font-medium flex-1">
												{o.text}
											</span>
											{isSelected && isSubmitting && (
												<div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
											)}
										</div>
									</button>
								);
							})}
						</div>
					</div>

					{/* Instructions */}
					<p className="text-center text-sm text-gray-500 px-4">
						Take your time to think. Select the answer that seems most logical to you.
					</p>
				</div>
			</div>
		</div>
	);
}



