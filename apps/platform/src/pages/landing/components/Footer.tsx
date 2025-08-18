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
        <div className="flex items-center gap-6 text-neutral-400">
          <a href="#" className="hover:text-neutral-200 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-neutral-200 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-neutral-200 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </Container>
  </footer>
);