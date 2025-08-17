import React from "react";
import { ArrowLeft, Search, Store } from "lucide-react";
import { PhonePreview } from "./PhonePreview";

interface FoodCourtPhonePreviewProps {
  activeStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const FoodCourtPhonePreview: React.FC<FoodCourtPhonePreviewProps> = ({ 
  activeStep, 
  totalSteps, 
  stepTitles 
}) => {
  return (
    <PhonePreview theme="dark" mode="digital">
      <div key={`food-court-step-${activeStep}`} className="space-y-3">
        {/* Debug indicator */}
        <div className="text-center p-2 bg-yellow-500/20 rounded text-[10px] text-yellow-300 font-bold border border-yellow-500/40">
          STEP {activeStep + 1} of {totalSteps} - {stepTitles[activeStep]}
        </div>
        
        {activeStep === 0 && (
          // STEP 1: QR Landing - Food Court Welcome
          <div className="space-y-3">
            <div className="text-center p-4 rounded-lg border-2 border-green-500/30 bg-gradient-to-b from-green-900/20 to-blue-900/20">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-blue-500 mx-auto mb-3 flex items-center justify-center shadow-lg">
                <Store className="h-8 w-8 text-white" />
              </div>
              <div className="text-[12px] font-bold text-green-400 mb-1">Central Plaza Food Court</div>
              <div className="text-[10px] text-neutral-300">12 vendors • Downtown Location</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-500/20 border-2 border-blue-500/40">
              <div className="text-[11px] text-blue-300 font-bold">🎯 ONE QR, ALL VENDORS</div>
              <div className="text-[9px] text-blue-200">Scan once, access everything</div>
            </div>
            <div className="text-center text-[8px] text-neutral-400 bg-neutral-800 p-2 rounded">
              Welcome Screen
            </div>
          </div>
        )}

        {activeStep === 1 && (
          // STEP 2: Universal Search Interface
          <div className="space-y-3">
            <div className="relative bg-purple-500/10 p-3 rounded-lg border-2 border-purple-500/30">
              <Search className="absolute left-6 top-6 h-5 w-5 text-purple-400" />
              <input 
                className="h-12 w-full rounded-lg border-2 border-purple-500/50 bg-purple-900/20 pl-12 pr-3 text-[12px] text-purple-200 font-bold" 
                value="🔍 burger" 
                readOnly
              />
            </div>
            <div className="text-[11px] text-purple-300 text-center font-bold bg-purple-500/10 p-2 rounded">
              Found 8 items across 4 vendors
            </div>
            {[
              { name: "Classic Burger", vendor: "Burger Hub", price: "$8.99", color: "from-red-500 to-orange-500" },
              { name: "Crispy Chicken Burger", vendor: "Wings & Things", price: "$9.50", color: "from-yellow-500 to-red-500" },
              { name: "Veggie Burger", vendor: "Green Bites", price: "$7.99", color: "from-green-500 to-blue-500" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-purple-950/30 border-2 border-purple-700/30">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-[8px]`}>
                  {item.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-purple-200">{item.name}</div>
                  <div className="text-[9px] text-purple-400">📍 {item.vendor}</div>
                </div>
                <div className="text-[10px] font-bold text-purple-100 bg-purple-500/20 px-2 py-1 rounded">{item.price}</div>
              </div>
            ))}
            <div className="text-center text-[8px] text-neutral-400 bg-neutral-800 p-2 rounded">
              Universal Search
            </div>
          </div>
        )}

        {activeStep === 2 && (
          // STEP 3: Vendor Discovery Grid
          <div className="space-y-3">
            <div className="text-[12px] font-bold text-orange-400 mb-3 text-center bg-orange-500/10 p-3 rounded-lg border-2 border-orange-500/30">
              🏪 Browse All Vendors
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Burger Hub", cuisine: "American", rating: "4.8", bg: "from-red-500 to-orange-500" },
                { name: "Noodle Box", cuisine: "Asian", rating: "4.6", bg: "from-yellow-500 to-red-500" },
                { name: "Pizza Corner", cuisine: "Italian", rating: "4.7", bg: "from-green-500 to-blue-500" },
                { name: "Taco Fiesta", cuisine: "Mexican", rating: "4.5", bg: "from-purple-500 to-pink-500" }
              ].map((vendor, i) => (
                <div key={i} className="p-4 rounded-xl border-2 border-orange-500/20 bg-orange-950/20 text-center hover:border-orange-400/40 transition-all transform hover:scale-105">
                  <div className={`h-12 w-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-br ${vendor.bg} shadow-lg`}>
                    {vendor.name[0]}
                  </div>
                  <div className="text-[10px] font-bold text-orange-200">{vendor.name}</div>
                  <div className="text-[8px] text-orange-400">{vendor.cuisine}</div>
                  <div className="text-[8px] text-yellow-300 bg-yellow-500/10 rounded px-1 mt-1">⭐ {vendor.rating}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-[8px] text-neutral-400 bg-neutral-800 p-2 rounded">
              Vendor Discovery
            </div>
          </div>
        )}

        {activeStep === 3 && (
          // STEP 4: Individual Vendor Menu Navigation
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 border-b-2 border-red-500/30 bg-red-500/10 rounded-t-lg">
              <ArrowLeft className="h-4 w-4 text-red-400" />
              <div className="text-[11px] font-bold text-red-300">🍔 Burger Hub</div>
              <div className="ml-auto text-[9px] text-red-400 bg-red-500/20 px-2 py-1 rounded">Food Court</div>
            </div>
            {[
              { name: "Classic Burger", desc: "Beef patty, lettuce, tomato", price: "$8.99", emoji: "🍔" },
              { name: "Cheese Deluxe", desc: "Double cheese, bacon", price: "$10.99", emoji: "🧀" },
              { name: "Chicken Club", desc: "Grilled chicken, avocado", price: "$9.50", emoji: "🐔" },
              { name: "Veggie Burger", desc: "Plant-based patty", price: "$7.99", emoji: "🥬" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-red-950/20 border-2 border-red-500/20 hover:border-red-400/40 transition-all">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-[14px] shadow-lg">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-red-200">{item.name}</div>
                  <div className="text-[9px] text-red-400">{item.desc}</div>
                </div>
                <div className="text-[10px] font-bold text-red-100 bg-red-500/20 px-2 py-1 rounded">{item.price}</div>
              </div>
            ))}
            <div className="text-center text-[8px] text-neutral-400 bg-neutral-800 p-2 rounded">
              Individual Menu
            </div>
          </div>
        )}
      </div>
    </PhonePreview>
  );
};