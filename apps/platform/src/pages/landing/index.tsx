import React, { useState, useEffect } from "react";
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
  const [showMobileSticky, setShowMobileSticky] = useState(false);

  const onCTAClick = () => {
    // Navigate to photo menu creation as the primary CTA
    window.location.href = "/photo-menu";
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show sticky footer when user is close to the bottom (within 200px)
      const nearBottom = scrollTop + windowHeight >= documentHeight - 200;
      setShowMobileSticky(nearBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300">
      <Navbar />
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
      {showMobileSticky && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800/60 bg-neutral-950/95 backdrop-blur-lg lg:hidden transform transition-transform duration-300 ease-in-out">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="text-sm text-neutral-300 font-medium">
              Ready to publish menu?
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => (window.location.href = "/photo-menu")}
                className="rounded-md  bg-white px-3 py-2 text-xs font-semibold text-black hover:bg-neutral-100 hover:shadow-sm transition-all duration-200 active:scale-95"
              >
                Photo
              </button>
              <button
                onClick={() => (window.location.href = "/digital-menu")}
                className="rounded-md border border-neutral-600 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-200 active:scale-95"
              >
                Digital
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
