import React from "react";
import { ArrowLeft, Search, Store, UtensilsCrossed, Coffee, Pizza, Globe, CircleDot, Sandwich, Cookie, Leaf } from "lucide-react";
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
        
        {activeStep === 0 && (
          // STEP 1: QR Landing - Food Court Welcome
          <div className="space-y-3">
            <div className="text-center p-4 rounded-lg border border-neutral-800 bg-neutral-950">
              <div className="h-16 w-16 rounded-2xl bg-neutral-800 mx-auto mb-3 flex items-center justify-center">
                <Store className="h-8 w-8 text-neutral-300" />
              </div>
              <div className="text-[12px] font-bold text-neutral-200 mb-1">Central Plaza Food Court</div>
              <div className="text-[10px] text-neutral-400">12 vendors • Downtown Location</div>
            </div>
            <div className="space-y-2">
              {[
                { name: "Burger Hub", cuisine: "American", status: "Open", icon: <UtensilsCrossed className="h-4 w-4" /> },
                { name: "Noodle Box", cuisine: "Asian", status: "Open", icon: <Coffee className="h-4 w-4" /> },
                { name: "Pizza Corner", cuisine: "Italian", status: "Open", icon: <Pizza className="h-4 w-4" /> },
                { name: "Taco Fiesta", cuisine: "Mexican", status: "Busy", icon: <Globe className="h-4 w-4" /> }
              ].map((vendor, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                  <div className="h-8 w-8 rounded bg-neutral-800 flex items-center justify-center text-neutral-300">
                    {vendor.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-bold text-neutral-200">{vendor.name}</div>
                    <div className="text-[9px] text-neutral-400">{vendor.cuisine}</div>
                  </div>
                  <div className={`text-[9px] px-2 py-1 rounded text-center ${
                    vendor.status === "Open" 
                      ? "bg-neutral-800 text-neutral-300" 
                      : "bg-neutral-700 text-neutral-300"
                  }`}>
                    {vendor.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStep === 1 && (
          // STEP 2: Universal Search Interface
          <div className="space-y-3">
            <div className="relative bg-neutral-900 p-3 rounded-lg border border-neutral-800">
              <Search className="absolute left-6 top-6 h-5 w-5 text-neutral-400" />
              <input 
                className="h-12 w-full rounded-lg border border-neutral-700 bg-neutral-950 pl-12 pr-3 text-[12px] text-neutral-200 font-bold" 
                value="Search: burger" 
                readOnly
              />
            </div>
            <div className="text-[11px] text-neutral-200 text-center font-bold bg-neutral-800 p-2 rounded">
              Found 8 items across 4 vendors
            </div>
            {[
              { name: "Classic Burger", vendor: "Burger Hub", price: "$8.99" },
              { name: "Crispy Chicken Burger", vendor: "Wings & Things", price: "$9.50" },
              { name: "Veggie Burger", vendor: "Green Bites", price: "$7.99" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 font-bold text-[8px]">
                  {item.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-neutral-200">{item.name}</div>
                  <div className="text-[9px] text-neutral-400">{item.vendor}</div>
                </div>
                <div className="text-[10px] font-bold text-neutral-200 bg-neutral-800 px-2 py-1 rounded">{item.price}</div>
              </div>
            ))}
          </div>
        )}

        {activeStep === 2 && (
          // STEP 3: Vendor Discovery Grid
          <div className="space-y-3">
            <div className="text-[12px] font-bold text-neutral-200 mb-3 text-center bg-neutral-900 p-3 rounded-lg border border-neutral-800">
              Browse All Vendors
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Burger Hub", cuisine: "American", rating: "4.8" },
                { name: "Noodle Box", cuisine: "Asian", rating: "4.6" },
                { name: "Pizza Corner", cuisine: "Italian", rating: "4.7" },
                { name: "Taco Fiesta", cuisine: "Mexican", rating: "4.5" }
              ].map((vendor, i) => (
                <div key={i} className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 text-center hover:border-neutral-700 transition-all">
                  <div className="h-12 w-12 rounded-full mx-auto mb-2 flex items-center justify-center text-neutral-300 text-[10px] font-bold bg-neutral-800">
                    {vendor.name[0]}
                  </div>
                  <div className="text-[10px] font-bold text-neutral-200">{vendor.name}</div>
                  <div className="text-[8px] text-neutral-400">{vendor.cuisine}</div>
                  <div className="text-[8px] text-neutral-300 bg-neutral-800 rounded px-1 mt-1">{vendor.rating}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStep === 3 && (
          // STEP 4: Individual Vendor Menu Navigation
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 border-b border-neutral-800 bg-neutral-900 rounded-t-lg">
              <ArrowLeft className="h-4 w-4 text-neutral-400" />
              <div className="text-[11px] font-bold text-neutral-200">Burger Hub</div>
              <div className="ml-auto text-[9px] text-neutral-400 bg-neutral-800 px-2 py-1 rounded">Food Court</div>
            </div>
            {[
              { name: "Classic Burger", desc: "Beef patty, lettuce, tomato", price: "$8.99", icon: <CircleDot className="h-5 w-5" /> },
              { name: "Cheese Deluxe", desc: "Double cheese, bacon", price: "$10.99", icon: <Cookie className="h-5 w-5" /> },
              { name: "Chicken Club", desc: "Grilled chicken, avocado", price: "$9.50", icon: <Sandwich className="h-5 w-5" /> },
              { name: "Veggie Burger", desc: "Plant-based patty", price: "$7.99", icon: <Leaf className="h-5 w-5" /> }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all">
                <div className="h-12 w-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-neutral-200">{item.name}</div>
                  <div className="text-[9px] text-neutral-400">{item.desc}</div>
                </div>
                <div className="text-[10px] font-bold text-neutral-200 bg-neutral-800 px-2 py-1 rounded">{item.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PhonePreview>
  );
};