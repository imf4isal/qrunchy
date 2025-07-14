import MainLayout from "@/components/layout/MainLayout";

export default function About() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 text-white text-xl font-semibold rounded-lg mb-8 hover:scale-105 transition-transform duration-200">
                Q
              </div>
              <h1 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
                About Qrunchy
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Transforming how restaurants share their menus with customers through elegant digital solutions
              </p>
            </div>

            {/* Story Section */}
            <div className="mb-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                  <h2 className="text-3xl font-light text-gray-900 mb-8 tracking-tight">
                    Our Story
                  </h2>
                  <div className="space-y-6 text-gray-600 leading-relaxed">
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

                <div className="lg:pl-8">
                  <div className="bg-gray-50 rounded-lg p-8 hover:bg-gray-100 transition-colors duration-300">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-6 hover:rotate-3 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">
                      Simple. Beautiful. Effective.
                    </h3>
                    <p className="text-gray-600">
                      Making digital menus accessible to every restaurant,
                      regardless of size or technical expertise.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="mb-24">
              <h2 className="text-3xl font-light text-gray-900 text-center mb-16 tracking-tight">
                What We Believe
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: "Simplicity First",
                    description: "Complex technology should feel simple. We hide the complexity so you can focus on what matters most.",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    ),
                    title: "Quality Matters",
                    description: "Every detail counts. From smooth animations to crisp images, we craft experiences that delight.",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    ),
                    title: "For Everyone",
                    description: "From street food vendors to Michelin-starred restaurants, beautiful menus should be accessible to all.",
                  },
                ].map((value, index) => (
                  <div
                    key={index}
                    className="text-center p-6 hover:bg-gray-50 rounded-lg transition-colors duration-300 group"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-lg mb-4 group-hover:scale-110 transition-transform duration-200">
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mission Section */}
            <div className="text-center bg-gray-900 text-white rounded-lg p-12 hover:bg-gray-800 transition-colors duration-300">
              <h2 className="text-3xl font-light mb-6 tracking-tight">Our Mission</h2>
              <p className="text-lg leading-relaxed max-w-3xl mx-auto opacity-90">
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
