// src/pages/home/Home.tsx
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section - Minimal & Elegant */}
      <div className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white min-h-screen">
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/5 border border-gray-200/50 rounded-full text-sm font-medium text-gray-700 mb-8 backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Trusted by 1000+ restaurants
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900 mb-6 max-w-5xl">
            Digital Menus
            <span className="block font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Transform your restaurant experience with beautiful, instant digital menus.
            <span className="block mt-2 text-lg text-gray-500">No apps. No delays. Just simplicity.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              asChild
              className="group relative bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-0"
              size="lg"
            >
              <Link href="/photo-menu" className="flex items-center gap-3">
                <div className="w-5 h-5 relative">
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                Upload Photos
                <div className="w-1 h-1 bg-white/60 rounded-full group-hover:w-2 transition-all duration-300"></div>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="group bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300 hover:bg-white text-gray-700 px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              size="lg"
            >
              <Link href="/digital-menu" className="flex items-center gap-3">
                <div className="w-5 h-5 relative">
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                Build Menu
                <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:w-2 transition-all duration-300"></div>
              </Link>
            </Button>
          </div>

          {/* Visual indicator */}
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Features Section - Minimal Grid */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Everything you need
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                title: "5-minute setup",
                description: "Upload photos or build your menu from scratch. Ready in minutes, not hours.",
                icon: "⚡"
              },
              {
                title: "Instant access",
                description: "Customers scan QR codes to view menus instantly. No downloads required.",
                icon: "📱"
              },
              {
                title: "Live updates",
                description: "Change prices, add items, update availability in real-time.",
                icon: "🔄"
              }
            ].map((feature, index) => (
              <div key={index} className="group text-center">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section - Elegant Steps */}
      <div className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              How it works
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection lines */}
              <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gray-200"></div>
              
              {[
                { number: "01", title: "Create", desc: "Upload menu photos or build from scratch" },
                { number: "02", title: "Customize", desc: "Choose colors, layout, and styling" },
                { number: "03", title: "Share", desc: "Generate QR code and go live instantly" }
              ].map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-700 font-medium text-lg relative z-10">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 max-w-xs mx-auto">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Minimal */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of restaurants already using Qrunchy to enhance their customer experience.
          </p>
          <Button
            asChild
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            size="lg"
          >
            <Link href="/photo-menu">
              Start Free Today
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}