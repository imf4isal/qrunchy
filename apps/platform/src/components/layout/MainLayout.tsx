import React from "react";
import { Link } from "wouter";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-xl font-bold text-blue-600">Qrunchy</a>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/how-it-works">
              <a className="text-sm text-gray-600 hover:text-gray-900">
                How It Works
              </a>
            </Link>
            <Link href="/login">
              <a className="text-sm text-gray-600 hover:text-gray-900">Login</a>
            </Link>
            <Link href="/signup">
              <a className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Sign Up
              </a>
            </Link>
          </nav>
          <button className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
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
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/">
                <a className="text-xl font-bold">Qrunchy</a>
              </Link>
            </div>
            <div className="flex gap-6">
              <Link href="/about">
                <a className="text-gray-300 hover:text-white">About</a>
              </Link>
              <Link href="/contact">
                <a className="text-gray-300 hover:text-white">Contact</a>
              </Link>
              <Link href="/privacy">
                <a className="text-gray-300 hover:text-white">Privacy</a>
              </Link>
              <Link href="/terms">
                <a className="text-gray-300 hover:text-white">Terms</a>
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-400">
            &copy; {new Date().getFullYear()} Qrunchy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
