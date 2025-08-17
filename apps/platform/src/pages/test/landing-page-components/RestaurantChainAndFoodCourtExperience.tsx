import React, { useState } from "react";
import { Building2, Store } from "lucide-react";
import { RestaurantChainSection } from "./RestaurantChainSection";
import { FoodCourtExperienceSection } from "./FoodCourtExperienceSection";

interface SectionProps {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, subtitle, children }) => {
  return (
    <section
      id={id}
      className="relative px-6 py-20 bg-black text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-black to-neutral-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,80,200,0.1),transparent_70%)]" />
      
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
        
        {children}
      </div>
    </section>
  );
};

export const RestaurantChainAndFoodCourtExperience: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"chain" | "foodcourt">("chain");

  return (
    <Section
      id="chain"
      title="Restaurant chains & food court experience"
      subtitle="Seamless experiences for customers, whether visiting a chain location or discovering vendors in a food court."
    >
      {/* Toggle between Chain and Food Court */}
      <div className="mb-12 w-fit rounded-full border border-neutral-800 p-1 flex items-center gap-2 mx-auto">
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