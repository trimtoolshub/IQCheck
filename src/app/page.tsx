export default function Home() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <header className="max-w-7xl mx-auto flex items-center justify-between p-6">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">IQCheck</div>
        <nav className="hidden sm:flex gap-6 text-gray-700">
          <a href="#how" className="hover:text-gray-900 font-medium transition-colors">How it works</a>
          <a href="#why" className="hover:text-gray-900 font-medium transition-colors">Benefits</a>
        </nav>
        <a href="/test/start" className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 font-semibold hover:shadow-lg transition-shadow">Start Free Test</a>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24 space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              How Intelligent Are You?
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 font-medium">
              Take our scientifically designed IQ test and discover your cognitive strengths
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a href="/test/start" className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 text-lg font-bold hover:shadow-xl transform hover:scale-105 transition-all">
                Take the Test Now - It's Free
              </a>
              <a href="#how" className="rounded-lg border-2 border-gray-300 text-gray-700 px-8 py-4 text-lg font-semibold hover:border-gray-400 transition-colors">
                Learn More
              </a>
            </div>
            <p className="text-sm text-gray-500 pt-4">No sign-up required • Takes 5-10 minutes • Instant results</p>
          </div>
        </section>

        {/* Curious Questions Section */}
        <section className="py-12 md:py-16 bg-white/50 rounded-2xl mb-12">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
              Ever Wonder...
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-2xl mb-3">🤔</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Where do you rank intellectually?</h3>
                <p className="text-gray-700">Discover if you're in the top 2% of the population or how you compare to others.</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-2xl mb-3">💡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">What are your cognitive strengths?</h3>
                <p className="text-gray-700">Find out if you excel at pattern recognition, logical reasoning, or verbal skills.</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                <div className="text-2xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Are you a quick thinker or deep analyzer?</h3>
                <p className="text-gray-700">Learn about your unique cognitive style and problem-solving approach.</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200">
                <div className="text-2xl mb-3">✨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">What makes your mind unique?</h3>
                <p className="text-gray-700">Get personalized insights into your intelligence profile and cognitive traits.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="py-12 md:py-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📝</div>
              <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Step 1</div>
              <h3 className="text-2xl font-bold text-gray-900">Answer Questions</h3>
              <p className="text-gray-600 leading-relaxed">
                Our adaptive test adjusts difficulty based on your answers, giving you questions perfectly suited to your level.
              </p>
            </div>
            <div className="text-center space-y-4 p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">⚡</div>
              <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Step 2</div>
              <h3 className="text-2xl font-bold text-gray-900">Get Instant Results</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive your IQ score, cognitive category, and discover your unique personality traits immediately.
              </p>
            </div>
            <div className="text-center space-y-4 p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📊</div>
              <div className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Step 3</div>
              <h3 className="text-2xl font-bold text-gray-900">Discover Your Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn your cognitive strengths across verbal, mathematical, logical reasoning, and pattern recognition.
              </p>
            </div>
          </div>
        </section>

        {/* Why Take It */}
        <section id="why" className="py-12 md:py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Why Take This Test?</h2>
            <div className="space-y-6">
              <div className="flex gap-4 p-6 bg-white rounded-xl shadow-md">
                <div className="text-3xl">🎓</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Scientifically Designed</h3>
                  <p className="text-gray-700">Based on established cognitive assessment methods and psychometric principles.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-white rounded-xl shadow-md">
                <div className="text-3xl">🔒</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Completely Free to Start</h3>
                  <p className="text-gray-700">Take the test and see your results without any cost. No credit card required.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-white rounded-xl shadow-md">
                <div className="text-3xl">⏱️</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Quick & Convenient</h3>
                  <p className="text-gray-700">Complete in just 5-10 minutes from any device. No lengthy surveys or forms.</p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-white rounded-xl shadow-md">
                <div className="text-3xl">📈</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Insights</h3>
                  <p className="text-gray-700">Get detailed analysis of your cognitive profile and discover what makes your thinking unique.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Discover Your Intelligence?</h2>
            <p className="text-xl text-blue-100">Find out your IQ score and cognitive profile in minutes. It's completely free to get started.</p>
            <a href="/test/start" className="inline-block rounded-lg bg-white text-blue-600 px-10 py-4 text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all">
              Start Your Free IQ Test Now
            </a>
            <p className="text-sm text-blue-100">No sign-up required • Instant results • 100% free to start</p>
          </div>
        </section>
      </main>
      
      <footer className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} IQCheck • Your Cognitive Assessment Platform
      </footer>
    </div>
  );
}
