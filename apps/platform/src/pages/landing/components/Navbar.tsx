import React from "react";
import { QrCode, LogOut, LayoutDashboard } from "lucide-react";
import { Container } from "./shared/Container";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

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
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleDashboard}
                className="inline-flex items-center gap-2 rounded-full border border-neutral-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 hover:border-neutral-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-100 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </>
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
