import React from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              Qrunchy
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
              How It Works
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
                  Dashboard
                </Link>
                <span className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
                  {user?.mobile_number}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors duration-200"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login" className="px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 hover:shadow-lg hover:shadow-blue-200/50">
                Login
              </Link>
            )}
          </nav>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-50 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="text-2xl font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200">
                Qrunchy
              </Link>
              <p className="text-gray-600 text-sm mt-2">Digital menus made simple</p>
            </div>
            <div className="flex gap-8">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm">
                Terms
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Qrunchy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
