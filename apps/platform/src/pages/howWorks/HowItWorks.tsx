// src/pages/how-it-works/HowItWorks.tsx
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

export default function HowItWorks() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-bold rounded-2xl mb-6">
                Q
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                How Qrunchy Works
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Create beautiful digital menus in minutes with our simple,
                three-step process.
              </p>
            </div>

            {/* Two Menu Types */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              {/* Photo Menu */}
              <div className="bg-white rounded-2xl shadow-lg border p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Photo Menu
                  </h2>
                  <p className="text-gray-600">
                    Perfect for existing printed menus
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      step: "1",
                      title: "Setup & Upload",
                      description:
                        "Enter your restaurant name and upload photos of your existing menu pages.",
                    },
                    {
                      step: "2",
                      title: "Arrange Pages",
                      description:
                        "Drag and drop to organize your menu pages in the correct order.",
                    },
                    {
                      step: "3",
                      title: "Generate QR",
                      description:
                        "Get your custom QR code and start serving customers instantly.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t">
                  <Button
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Link href="/photo-menu">Create Photo Menu</Link>
                  </Button>
                </div>
              </div>

              {/* Digital Menu */}
              <div className="bg-white rounded-2xl shadow-lg border p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Digital Menu
                  </h2>
                  <p className="text-gray-600">
                    Build structured menus with variants and add-ons
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      step: "1",
                      title: "Setup Restaurant",
                      description:
                        "Enter your restaurant information and choose between manual entry or JSON upload.",
                    },
                    {
                      step: "2",
                      title: "Build Menu",
                      description:
                        "Add categories, items, variants (sizes, spice levels), and optional add-ons.",
                    },
                    {
                      step: "3",
                      title: "Generate QR",
                      description:
                        "Preview your structured menu and generate your QR code.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t">
                  <Button
                    asChild
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <Link href="/digital-menu">Create Digital Menu</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                Powerful Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    title: "Mobile First",
                    description: "Optimized for smartphone viewing",
                  },
                  {
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    ),
                    title: "Instant Updates",
                    description: "Change your menu anytime, anywhere",
                  },
                  {
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                    ),
                    title: "QR Code Ready",
                    description: "Print and place anywhere in your restaurant",
                  },
                  {
                    icon: (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    title: "No App Required",
                    description: "Customers scan and view instantly",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-xl bg-white border"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-95">
                Choose your menu type and create your first digital menu in
                minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Link href="/photo-menu">Create Photo Menu</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                >
                  <Link href="/digital-menu">Create Digital Menu</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
