import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Layers, Smartphone, Plus, Edit3, Users } from "lucide-react";
import { PhonePreview } from "./PhonePreview";

export const RestaurantChainSection: React.FC = () => {
  const [previewStep, setPreviewStep] = useState(0);
  
  // Cycle through different chain management steps for demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      setPreviewStep((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const chainFeatures = [
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Create & Manage Chains",
      description: "Group restaurants under unified brands",
      details: "Easily create restaurant chains and assign your existing restaurants to maintain brand consistency across locations."
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "Organized Dashboard", 
      description: "All restaurants grouped by chains",
      details: "Your dashboard automatically organizes restaurants by their chains, making it easy to manage multiple locations and brands."
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Flexible Assignment",
      description: "Add restaurants to chains anytime",
      details: "Assign existing restaurants to chains or create new restaurants directly within a chain structure as you expand."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
    >
      {/* Left: Chain Features */}
      <div className="space-y-4 lg:space-y-8">
        {chainFeatures.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex gap-3 lg:gap-4 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-950 to-neutral-900 hover:from-neutral-900 hover:to-neutral-850 transition-all duration-300"
          >
            <div className="h-10 w-10 lg:h-12 lg:w-12 flex items-center justify-center rounded-lg lg:rounded-xl bg-gradient-to-br from-white/10 to-neutral-800 border border-neutral-700 shadow-inner text-white">
              {feature.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-base lg:text-lg font-semibold text-neutral-100 mb-1 lg:mb-2">
                {feature.title}
              </h3>
              <p className="text-sm lg:text-base text-neutral-400 mb-2 lg:mb-3">
                {feature.description}
              </p>
              <p className="text-xs lg:text-sm text-neutral-500 hidden sm:block">
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
          <div className="absolute -inset-8 bg-neutral-800/10 rounded-full blur-3xl"></div>
          <PhonePreview theme="dark" mode="digital">
            <div className="space-y-3 transition-all duration-500">
              {previewStep === 0 && (
                <>
                  {/* Create Chain Dialog */}
                  <div className="p-3 rounded-lg border border-neutral-700 bg-gradient-to-r from-neutral-950 to-neutral-900">
                    <div className="flex items-center gap-2 mb-3">
                      <Plus className="h-3 w-3 text-neutral-300" />
                      <div className="text-[10px] font-semibold text-neutral-200">Create New Chain</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-[8px] text-neutral-400 mb-1">Chain Name</div>
                      <div className="h-4 rounded bg-neutral-800 border border-neutral-700 px-2 flex items-center">
                        <div className="text-[8px] text-neutral-200">Pizza Palace Chain</div>
                      </div>
                      <div className="text-[8px] text-neutral-400 mb-1">Description</div>
                      <div className="h-6 rounded bg-neutral-800 border border-neutral-700 px-2 pt-1">
                        <div className="text-[7px] text-neutral-300">Authentic Italian pizzas across the city</div>
                      </div>
                    </div>
                    <div className="mt-3 h-4 rounded bg-neutral-600 border border-neutral-500 flex items-center justify-center">
                      <div className="text-[8px] text-neutral-200 font-medium">Create Chain</div>
                    </div>
                  </div>
                  
                  {/* Available Restaurants */}
                  <div className="p-2 rounded-lg border border-neutral-800 bg-neutral-950">
                    <div className="text-[8px] text-neutral-400 mb-2">Select Restaurants to Add</div>
                    <div className="space-y-1">
                      {[
                        { name: "Downtown Pizza", selected: true },
                        { name: "Uptown Slice", selected: true },
                        { name: "Pizza Corner", selected: false }
                      ].map((restaurant, i) => (
                        <div key={i} className="flex items-center gap-2 p-1">
                          <div className={`h-2 w-2 rounded border ${restaurant.selected ? 'bg-neutral-300 border-neutral-300' : 'border-neutral-600'}`}></div>
                          <div className="text-[8px] text-neutral-200">{restaurant.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {previewStep === 1 && (
                <>
                  {/* Chain Dashboard View */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg border border-neutral-500 bg-gradient-to-r from-neutral-800 to-neutral-750">
                      <Building2 className="h-3 w-3 text-neutral-200" />
                      <div className="flex-1">
                        <div className="text-[9px] font-semibold text-neutral-100">Pizza Palace Chain</div>
                        <div className="text-[7px] text-neutral-400">2 restaurants</div>
                      </div>
                      <Edit3 className="h-2 w-2 text-neutral-300" />
                    </div>
                    
                    {/* Chain Restaurants */}
                    <div className="ml-4 space-y-1">
                      {[
                        { name: "Downtown Pizza", status: "Active" },
                        { name: "Uptown Slice", status: "Active" }
                      ].map((restaurant, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                          <div className="h-6 w-6 rounded bg-neutral-600 border border-neutral-500 flex items-center justify-center text-[7px] font-bold text-neutral-200">
                            {restaurant.name.split(' ').map(w => w[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="text-[8px] font-medium text-neutral-200">{restaurant.name}</div>
                            <div className="text-[6px] text-neutral-500">{restaurant.status}</div>
                          </div>
                          <div className="h-3 w-3 rounded-full bg-neutral-400 border border-neutral-500"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Individual Restaurants Section */}
                  <div className="space-y-1">
                    <div className="text-[9px] text-neutral-400 font-medium">Individual Restaurants</div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                      <div className="h-6 w-6 rounded bg-neutral-700 border border-neutral-600 flex items-center justify-center text-[7px] font-bold text-neutral-200">TC</div>
                      <div className="flex-1">
                        <div className="text-[8px] font-medium text-neutral-200">Taco Corner</div>
                        <div className="text-[6px] text-neutral-500">Independent</div>
                      </div>
                      <Plus className="h-2 w-2 text-neutral-400" />
                    </div>
                  </div>
                </>
              )}
              
              {previewStep === 2 && (
                <>
                  {/* Chain Management Overview */}
                  <div className="p-3 rounded-lg border border-neutral-700 bg-gradient-to-r from-neutral-950 to-neutral-900">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-3 w-3 text-neutral-300" />
                      <div className="text-[10px] font-semibold text-neutral-200">Chain Overview</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                        <div className="text-[10px] font-bold text-neutral-200">2</div>
                        <div className="text-[7px] text-neutral-400">Chains</div>
                      </div>
                      <div className="p-2 rounded bg-neutral-900 border border-neutral-800">
                        <div className="text-[10px] font-bold text-neutral-200">5</div>
                        <div className="text-[7px] text-neutral-400">Total Restaurants</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <div className="text-[8px] text-neutral-400 font-medium">Quick Actions</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-center">
                        <Plus className="h-3 w-3 text-neutral-300 mx-auto mb-1" />
                        <div className="text-[7px] text-neutral-200">Add Restaurant</div>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-center">
                        <Edit3 className="h-3 w-3 text-neutral-300 mx-auto mb-1" />
                        <div className="text-[7px] text-neutral-200">Edit Chains</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chain Stats */}
                  <div className="p-2 rounded-lg border border-neutral-800 bg-neutral-950">
                    <div className="flex justify-between items-center">
                      <div className="text-[8px] text-neutral-300">Pizza Palace Chain</div>
                      <div className="text-[7px] text-neutral-300 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded-full">2 locations</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </PhonePreview>
        </div>
      </motion.div>
    </motion.div>
  );
};