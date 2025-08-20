import React from "react";
import { QrCode } from "lucide-react";
import { Container } from "./shared/Container";

export const Footer: React.FC = () => (
  <footer className="border-t border-neutral-900/50 py-8">
    <Container>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="relative h-6 w-6 rounded-md bg-gradient-to-br from-white to-neutral-300 flex items-center justify-center shadow-sm">
            <QrCode className="h-3 w-3 text-neutral-900" />
          </div>
          <span className="font-semibold text-neutral-200">Qrunchy</span>
          <span className="text-neutral-500">
            © {new Date().getFullYear()}
          </span>
        </div>
        <div className="text-neutral-400">
          <span>contact@ </span>
          <a 
            href="tel:+8801918411315" 
            className="hover:text-neutral-200 transition-colors duration-200 cursor-pointer"
          >
            +8801918 411 315
          </a>
        </div>
      </div>
    </Container>
  </footer>
);