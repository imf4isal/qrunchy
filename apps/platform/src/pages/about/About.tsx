import MainLayout from "@/components/layout/MainLayout";

export default function About() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-bold rounded-2xl mb-6">
                Q
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                About Qrunchy
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transforming how restaurants share their menus with customers
                through elegant digital solutions.
              </p>
            </div>

            {/* Story Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Qrunchy was born from a simple observation: restaurant menus
                    should be as beautiful and accessible as the food they
                    describe. In a world where digital experiences matter more
                    than ever, we believe every restaurant deserves a stunning
                    digital presence.
                  </p>
                  <p>
                    Whether you're a cozy cafe with handwritten menus or a fine
                    dining establishment with complex offerings, Qrunchy makes
                    it effortless to create beautiful, scannable menus that your
                    customers will love.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Simple. Beautiful. Effective.
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Making digital menus accessible to every restaurant,
                    regardless of size or technical expertise.
                  </p>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                What We Believe
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
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
                    title: "Simplicity First",
                    description:
                      "Complex technology should feel simple. We hide the complexity so you can focus on what matters most.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    ),
                    title: "Quality Matters",
                    description:
                      "Every detail counts. From smooth animations to crisp images, we craft experiences that delight.",
                  },
                  {
                    icon: (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    ),
                    title: "For Everyone",
                    description:
                      "From street food vendors to Michelin-starred restaurants, beautiful menus should be accessible to all.",
                  },
                ].map((value, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-xl bg-white shadow-sm border"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl leading-relaxed max-w-3xl mx-auto opacity-95">
                To empower every restaurant with beautiful, accessible digital
                menus that enhance the dining experience and help businesses
                thrive in the digital age.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
