// src/pages/contact/Contact.tsx
import MainLayout from "@/components/layout/MainLayout";
import { Phone } from "lucide-react";

export default function Contact() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            {/* Header */}
            <div className="mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-2xl font-bold rounded-xl mb-6">
                Q
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Contact Us
              </h1>
              <p className="text-gray-600">
                Need help with your digital menu? We're here to assist you.
              </p>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-slate-600" />
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Call Us
                </h2>
                
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  For any questions or support, feel free to call us directly.
                </p>
                
                <a
                  href="tel:+8801918411315"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/25"
                >
                  <Phone className="w-4 h-4" />
                  +880 1918 411 315
                </a>
                
                <p className="text-sm text-gray-500 mt-4">
                  Available 24/7 for support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
