import React, { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { QrCode, LogOut, LayoutDashboard } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDashboard = () => {
    window.location.href = "/dashboard";
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-sm">
              <QrCode className="h-4 w-4 text-white" />
            </div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-gray-900"
            >
              Qrunchy
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleDashboard}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign in
              </Link>
            )}
          </nav>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMobileMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      handleDashboard();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center px-6 py-2 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="relative h-6 w-6 rounded-md bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-sm">
                <QrCode className="h-3 w-3 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Qrunchy</span>
              <span className="text-gray-500">
                © {new Date().getFullYear()}
              </span>
            </div>
            <div className="text-gray-600">
              <span>contact@ </span>
              <a 
                href="tel:+8801918411315" 
                className="hover:text-gray-900 transition-colors duration-200 cursor-pointer"
              >
                +8801918 411 315
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
