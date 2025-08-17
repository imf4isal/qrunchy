import React from "react";
import { motion } from "framer-motion";
import { Building2, Layers, Smartphone } from "lucide-react";
import { PhonePreview } from "./PhonePreview";

export const RestaurantChainSection: React.FC = () => {
  const chainFeatures = [
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Unified Brand Experience",
      description: "Same menu, same quality, local touches",
      details: "Customers get consistent experience across all locations while allowing local specials and pricing adjustments."
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "Central Menu Management", 
      description: "Update once, publish everywhere",
      details: "Change prices or add new items from headquarters and push updates to all locations instantly."
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "Location-Aware Menus",
      description: "Automatic location detection",
      details: "Customers see location-specific pricing, availability, and local specialties while maintaining brand consistency."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
    >
      {/* Left: Chain Features */}
      <div className="space-y-8">
        {chainFeatures.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex gap-4 p-6 rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-950 to-neutral-900 hover:from-neutral-900 hover:to-neutral-850 transition-all duration-300"
          >
            <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-neutral-800 border border-neutral-700 shadow-inner text-white">
              {feature.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-400 mb-3">
                {feature.description}
              </p>
              <p className="text-sm text-neutral-500">
                {feature.details}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right: Chain Phone Preview */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative flex justify-center"
      >
        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <PhonePreview theme="dark" mode="digital">
            <div className="space-y-3">
              {/* Chain Brand Header */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-700 bg-gradient-to-r from-neutral-900 to-neutral-800">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  MC
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-neutral-200">McDonald's</div>
                  <div className="text-[9px] text-neutral-400">Chain Restaurant</div>
                </div>
                <div className="text-[8px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                  LIVE
                </div>
              </div>
              
              {/* Location Selector with real data */}
              <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] text-neutral-400">LOCATION</div>
                  <div className="h-3 w-3 border border-neutral-600 rounded flex items-center justify-center">
                    <div className="h-1 w-1 bg-neutral-500 rounded"></div>
                  </div>
                </div>
                <div className="text-[11px] text-neutral-200 font-medium">Times Square, NYC</div>
                <div className="text-[9px] text-neutral-500">2.1 miles away</div>
              </div>

              {/* Chain Menu Items with consistent branding */}
              <div className="space-y-2">
                {[
                  { name: "Big Mac", price: "$5.99", category: "Burgers" },
                  { name: "McChicken", price: "$4.99", category: "Chicken" },
                  { name: "Apple Pie", price: "$1.29", category: "Desserts" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-neutral-950 border border-neutral-800/50">
                    <div className="h-10 w-10 rounded bg-gradient-to-br from-yellow-600/20 to-red-600/20 border border-yellow-600/30"></div>
                    <div className="flex-1">
                      <div className="text-[10px] font-medium text-neutral-200">{item.name}</div>
                      <div className="text-[8px] text-neutral-500">{item.category}</div>
                    </div>
                    <div className="text-[9px] font-semibold text-neutral-300">{item.price}</div>
                  </div>
                ))}
              </div>

              {/* Chain-wide promotion banner */}
              <div className="p-2 rounded-lg bg-gradient-to-r from-red-600/10 to-yellow-600/10 border border-red-600/20">
                <div className="text-[9px] text-red-400 font-medium">🎉 Chain Special</div>
                <div className="text-[8px] text-neutral-400">Valid at all locations</div>
              </div>
            </div>
          </PhonePreview>
        </div>
      </motion.div>
    </motion.div>
  );
};