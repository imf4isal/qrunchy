// src/pages/home/Home.tsx
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white to-gray-100">
        <div className="container mx-auto px-4 py-12 md:py-24">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              {/* Replace with your logo */}
              <div className="mx-auto w-36 h-12 bg-blue-600 flex items-center justify-center text-white text-xl font-bold rounded-md">
                Qrunchy
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Digital Menus Made Simple
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Create beautiful menus for your restaurant that customers can
              access instantly via QR code.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-6 max-w-md mx-auto">
              <Button
                asChild
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-6"
                size="lg"
              >
                <Link href="/photo-menu">Create Photo Menu</Link>
              </Button>

              <Button
                asChild
                className="flex-1 bg-purple-600 hover:bg-purple-700 py-6"
                size="lg"
              >
                <Link href="/digital-menu">Create Digital Menu</Link>
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Easy Setup",
                description:
                  "Upload your existing menu photos or create a digital menu in minutes.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-10 h-10 text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                ),
              },
              {
                title: "Instant QR Codes",
                description:
                  "Generate QR codes that customers can scan to view your menu.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-10 h-10 text-purple-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                ),
              },
              {
                title: "Easy Updates",
                description:
                  "Change your menu anytime - customers always see the latest version.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-10 h-10 text-green-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <Card key={index} className="bg-white">
                <CardHeader>
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works Section */}
          <div className="mt-24 max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4">See How It Works</h2>
              <p className="text-gray-600 mb-6">
                Watch how easy it is to create your digital menu with Qrunchy
              </p>

              {/* Placeholder for video or demo */}
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Demo Video</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
