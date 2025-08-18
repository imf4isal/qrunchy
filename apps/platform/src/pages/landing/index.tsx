import React, { useState } from "react";
import {
  RestaurantChainAndFoodCourtExperience,
  Hero,
  Workflows,
  QRDistribution,
  StructuredPower,
  FAQ,
  Navbar,
  Footer,
  FinalCTA,
} from "./components";

// -------------------------------
// Main Page
// -------------------------------
export default function LandingPageTest() {
  const [restaurantName, setRestaurantName] = useState("");

  const onCTAClick = () => {
    // Navigate to photo menu creation as the primary CTA
    window.location.href = "/photo-menu";
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300">
      <Navbar onCTAClick={onCTAClick} />
      <Hero
        restaurantName={restaurantName}
        setRestaurantName={setRestaurantName}
        onCTAClick={onCTAClick}
      />
      <Workflows />
      <QRDistribution />
      <RestaurantChainAndFoodCourtExperience />
      {/* <StructuredPower /> */}
      <FAQ />
      <FinalCTA onCTAClick={onCTAClick} />
      <Footer />

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800/60 bg-neutral-950/95 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-sm text-neutral-300 font-medium">
            Ready to publish?
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => (window.location.href = "/photo-menu")}
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 hover:shadow-sm transition-all duration-200 active:scale-95"
            >
              Photo Menu
            </button>
            <button
              onClick={() => (window.location.href = "/digital-menu")}
              className="rounded-xl border border-neutral-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-200 active:scale-95"
            >
              Digital
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
