// src/pages/home/Home.tsx
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { trpc } from "@/utils/trpc";

export default function Home() {
  const { data: test } = trpc.hello.hello.useQuery({ name: "faisal" });

  console.log(test);

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen">
        <div className="container mx-auto px-4 py-16 md:py-32">
          <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8 border border-blue-100">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Trusted by 1000+ restaurants
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
              Digital Menus
              <span className="block text-blue-600">Made Simple</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Create beautiful, interactive menus for your restaurant that customers can
              access instantly via QR code. No app downloads required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Button
                asChild
                className="group flex-1 bg-blue-600 hover:bg-blue-700 py-4 px-8 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-200/50"
                size="lg"
              >
                <Link href="/photo-menu" className="flex items-center gap-2">
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Photo Menu
                </Link>
              </Button>

              <Button
                asChild
                className="group flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-4 px-8 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-200/50"
                size="lg"
              >
                <Link href="/digital-menu" className="flex items-center gap-2">
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Digital Menu
                </Link>
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-32 max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Qrunchy?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to digitize your restaurant menu and enhance customer experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Lightning Fast Setup",
                  description:
                    "Upload your existing menu photos or create a digital menu in under 5 minutes. No technical expertise required.",
                  icon: (
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-8 h-8 text-blue-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  ),
                },
                {
                  title: "Smart QR Codes",
                  description:
                    "Generate beautiful QR codes that customers can scan instantly. Works on any smartphone without app downloads.",
                  icon: (
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-8 h-8 text-purple-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                        />
                      </svg>
                    </div>
                  ),
                },
                {
                  title: "Real-time Updates",
                  description:
                    "Update your menu anytime and customers instantly see the latest version. No reprinting, no delays.",
                  icon: (
                    <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-8 h-8 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                  ),
                },
              ].map((feature, index) => (
                <Card 
                  key={index} 
                  className="group bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 duration-1000"
                  style={{ animationDelay: `${400 + index * 200}ms` }}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mt-32 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                See How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Create your digital menu in three simple steps
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="p-8 md:p-12">
                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {[
                    { step: "01", title: "Upload", desc: "Add your menu photos or create items" },
                    { step: "02", title: "Customize", desc: "Design your menu layout and style" },
                    { step: "03", title: "Share", desc: "Generate QR code and start serving" }
                  ].map((item, index) => (
                    <div key={index} className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Demo Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 group hover:border-blue-300 transition-colors duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-600 font-medium">Interactive Demo Coming Soon</span>
                    <p className="text-gray-500 text-sm mt-2">Experience the full Qrunchy workflow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
