import React, { useState } from "react";
import { Building2, Store } from "lucide-react";
import { RestaurantChainSection } from "./RestaurantChainSection";
import { FoodCourtExperienceSection } from "./FoodCourtExperienceSection";
import { Section } from "./shared/Section";

export const RestaurantChainAndFoodCourtExperience: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"chain" | "foodcourt">("chain");

  return (
    <Section
      id="chain"
      title="Restaurant chains & food court experience"
      subtitle="Seamless experiences for customers, whether visiting a chain location or discovering vendors in a food court."
    >
      {/* Toggle between Chain and Food Court */}
      <div className="mb-12 w-fit rounded-full border border-neutral-800 p-1 flex items-center gap-2">
        {[
          { key: "chain", label: "Restaurant Chains", icon: <Building2 className="h-4 w-4" /> },
          { key: "foodcourt", label: "Food Courts", icon: <Store className="h-4 w-4" /> }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as "chain" | "foodcourt")}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm transition-all duration-200 active:scale-95 ${
              activeTab === t.key
                ? "bg-white text-black shadow-sm"
                : "text-neutral-300 hover:bg-neutral-900 hover:text-neutral-200"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "chain" && <RestaurantChainSection />}
      {activeTab === "foodcourt" && <FoodCourtExperienceSection />}
    </Section>
  );
};