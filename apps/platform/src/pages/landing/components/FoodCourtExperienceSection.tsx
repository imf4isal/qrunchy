import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FoodCourtPhonePreview } from "./FoodCourtPhonePreview";

export const FoodCourtExperienceSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const foodCourtSteps = [
    {
      title: "One QR, All Vendors",
      description: "Single scan access to entire food court"
    },
    {
      title: "Universal Search",
      description: "Search 'burger' across all vendors"
    },
    {
      title: "Easy Discovery",
      description: "Browse vendors and trending items"
    },
    {
      title: "Seamless Navigation",
      description: "Jump between vendor menus instantly"
    }
  ];

  // Debug: Log state changes
  useEffect(() => {
    console.log(`FoodCourt activeStep changed to: ${activeStep}`);
  }, [activeStep]);

  const handleStepClick = (i: number) => {
    console.log(`Clicking food court step ${i + 1}`);
    setActiveStep(i);
  };

  const nextSlide = () => {
    setActiveStep((prev) => {
      const next = (prev + 1) % foodCourtSteps.length;
      console.log(`Next slide: ${prev} -> ${next}`);
      return next;
    });
  };

  const prevSlide = () => {
    setActiveStep((prev) => {
      const next = (prev - 1 + foodCourtSteps.length) % foodCourtSteps.length;
      console.log(`Prev slide: ${prev} -> ${next}`);
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* Food Court Customer Journey */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-neutral-100 mb-4">
          Customer Journey: From Scan to Order
        </h3>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          See how customers experience a food court powered by Qrunchy - one scan unlocks everything.
        </p>
      </div>

      {/* Interactive Journey Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
        {/* Left: Step Navigator */}
        <div className="space-y-3 lg:space-y-4">
          {foodCourtSteps.map((step, i) => (
            <motion.button
              key={i}
              onClick={() => handleStepClick(i)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`w-full text-left p-4 lg:p-6 rounded-xl lg:rounded-2xl border transition-all duration-300 ${
                activeStep === i
                  ? "border-white bg-gradient-to-r from-neutral-900 to-neutral-800 shadow-lg"
                  : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
              }`}
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <div className={`h-8 w-8 lg:h-10 lg:w-10 rounded-full border-2 flex items-center justify-center text-xs lg:text-sm font-bold transition-colors ${
                  activeStep === i 
                    ? "border-white text-white bg-neutral-800" 
                    : "border-neutral-700 text-neutral-400"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm lg:text-base font-semibold mb-1 transition-colors ${
                    activeStep === i ? "text-white" : "text-neutral-200"
                  }`}>
                    {step.title}
                  </h4>
                  <p className={`text-xs lg:text-sm transition-colors ${
                    activeStep === i ? "text-neutral-300" : "text-neutral-500"
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Right: Phone Preview with Navigation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative flex justify-center mt-6 lg:mt-0"
        >
          <div className="relative">
            <div className="absolute -inset-4 lg:-inset-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
            
            {/* Navigation buttons - hidden on mobile */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 h-6 w-6 lg:h-8 lg:w-8 rounded-full border border-neutral-800/60 bg-neutral-950/60 backdrop-blur-sm text-neutral-400 hover:text-neutral-200 hover:border-neutral-700/80 transition-all z-10 hidden lg:flex items-center justify-center"
            >
              <ArrowLeft className="h-3 w-3" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 h-6 w-6 lg:h-8 lg:w-8 rounded-full border border-neutral-800/60 bg-neutral-950/60 backdrop-blur-sm text-neutral-400 hover:text-neutral-200 hover:border-neutral-700/80 transition-all z-10 hidden lg:flex items-center justify-center"
            >
              <ArrowRight className="h-3 w-3" />
            </button>

            <FoodCourtPhonePreview
              activeStep={activeStep}
              totalSteps={foodCourtSteps.length}
              stepTitles={foodCourtSteps.map(step => step.title)}
            />
            
            {/* Step indicator */}
            <div className="flex justify-center mt-3 lg:mt-4 gap-1.5 lg:gap-2">
              {foodCourtSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleStepClick(i)}
                  className={`h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full transition-colors ${
                    activeStep === i ? "bg-white" : "bg-neutral-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};