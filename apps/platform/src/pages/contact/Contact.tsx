// src/pages/contact/Contact.tsx
import MainLayout from "@/components/layout/MainLayout";

export default function Contact() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Illustration & Message */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-8">
                  We're here to help.
                </h1>

                {/* Illustration Area */}
                <div className="relative mb-8">
                  <div className="bg-white rounded-3xl p-8 max-w-md mx-auto lg:mx-0 shadow-sm">
                    <div className="flex items-center justify-center h-64">
                      {/* Simple illustration placeholder */}
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-bold rounded-2xl mx-auto mb-4 flex items-center justify-center">
                          Q
                        </div>
                        <div className="space-y-2">
                          <div className="w-20 h-3 bg-gray-200 rounded mx-auto"></div>
                          <div className="w-16 h-3 bg-gray-200 rounded mx-auto"></div>
                          <div className="w-24 h-3 bg-gray-200 rounded mx-auto"></div>
                        </div>
                      </div>
                    </div>

                    {/* Speech bubble */}
                    <div className="relative bg-gray-100 rounded-2xl p-6 mt-4">
                      <p className="text-gray-700 font-medium">
                        Need help with your digital menu? We're here to make it
                        simple!
                      </p>
                      {/* Speech bubble tail */}
                      <div className="absolute -top-2 left-8 w-4 h-4 bg-gray-100 rotate-45"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Options */}
              <div className="space-y-12">
                {/* Email Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Email
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Send us an email and we'll get back to you within 24 hours.
                  </p>
                  <a
                    href="mailto:hello@qrunchy.com"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Email Us
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                  <p className="text-sm text-gray-500 mt-2">
                    hello@qrunchy.com
                  </p>
                </div>

                {/* Phone Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Call Us
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Prefer to talk? Give us a call during business hours.
                  </p>
                  <a
                    href="tel:+8801717171717"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Call Now
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                  <p className="text-sm text-gray-500 mt-2">+8801717171717</p>
                </div>

                {/* Hours */}
                <div className="text-sm text-gray-500 pt-8 border-t">
                  <p>* Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
