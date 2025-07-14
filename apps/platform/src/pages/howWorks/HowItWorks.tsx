import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function HowItWorks() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white text-xl font-semibold rounded-lg mb-8 hover:scale-105 transition-transform duration-200">
                Q
              </div>
              <h1 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
                How Qrunchy Works
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Create beautiful digital menus in minutes with our simple process
              </p>
            </div>

            {/* Two Menu Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
              {/* Photo Menu */}
              <div className="group bg-gray-50 rounded-lg p-8 hover:bg-gray-100 transition-colors duration-300">
                <div className="text-center mb-10">
                  <div className="w-14 h-14 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center shadow-sm">
                    <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-medium text-gray-900 mb-3">
                    Photo Menu
                  </h2>
                  <p className="text-gray-600">
                    Perfect for existing printed menus
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    {
                      step: "1",
                      title: "Setup & Upload",
                      description: "Enter your restaurant name and upload photos of your existing menu pages.",
                    },
                    {
                      step: "2", 
                      title: "Arrange Pages",
                      description: "Drag and drop to organize your menu pages in the correct order.",
                    },
                    {
                      step: "3",
                      title: "Generate QR",
                      description: "Get your custom QR code and start serving customers instantly.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-medium hover:scale-110 transition-transform duration-200">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    <Link href="/photo-menu">Create Photo Menu</Link>
                  </Button>
                </div>
              </div>

              {/* Digital Menu */}
              <div className="group bg-gray-50 rounded-lg p-8 hover:bg-gray-100 transition-colors duration-300">
                <div className="text-center mb-10">
                  <div className="w-14 h-14 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center shadow-sm">
                    <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-medium text-gray-900 mb-3">
                    Digital Menu
                  </h2>
                  <p className="text-gray-600">
                    Build structured menus with variants and add-ons
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    {
                      step: "1",
                      title: "Setup Restaurant",
                      description: "Enter your restaurant information and choose between manual entry or JSON upload.",
                    },
                    {
                      step: "2",
                      title: "Build Menu",
                      description: "Add categories, items, variants (sizes, spice levels), and optional add-ons.",
                    },
                    {
                      step: "3",
                      title: "Generate QR",
                      description: "Preview your structured menu and generate your QR code.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-medium hover:scale-110 transition-transform duration-200">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <Button asChild className="w-full border border-gray-300 bg-white text-gray-900 hover:bg-gray-50">
                    <Link href="/digital-menu">Create Digital Menu</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-24">
              <h2 className="text-3xl font-light text-gray-900 text-center mb-16 tracking-tight">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    ),
                    title: "Mobile First",
                    description: "Optimized for smartphone viewing",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: "Instant Updates",
                    description: "Change your menu anytime, anywhere",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    ),
                    title: "QR Code Ready",
                    description: "Print and place anywhere in your restaurant",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: "No App Required",
                    description: "Customers scan and view instantly",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-6 hover:bg-gray-50 rounded-lg transition-colors duration-300 group"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4 group-hover:bg-gray-200 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
