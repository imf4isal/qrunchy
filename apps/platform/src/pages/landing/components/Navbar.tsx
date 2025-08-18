import React from "react";
import { QrCode, ArrowRight, LogOut, LayoutDashboard } from "lucide-react";
import { Container } from "./shared/Container";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar: React.FC<{ onCTAClick: () => void }> = ({ onCTAClick }) => {
  const { isAuthenticated, logout } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleSignIn = () => {
    window.location.href = "/login";
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleDashboard = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/60 border-b border-neutral-900/50">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-white to-neutral-300 flex items-center justify-center shadow-sm">
            <QrCode className="h-4 w-4 text-neutral-900" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Qrunchy
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-neutral-400">
          {isAuthenticated && (
            <button
              onClick={handleDashboard}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Dashboard
            </button>
          )}
          <a
            href="/how-it-works"
            className="hover:text-white transition-colors cursor-pointer"
          >
            How It Works
          </a>
          <button
            onClick={() => scrollToSection("faq")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            FAQ
          </button>
          <a
            href="/contact"
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign in
            </button>
          )}
        </div>
      </Container>
    </div>
  );
};