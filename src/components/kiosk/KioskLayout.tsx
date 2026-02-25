import { ReactNode } from "react";
import { motion } from "framer-motion";

interface KioskLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
}

const KioskLayout = ({ children, showHeader = true, title, subtitle }: KioskLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {showHeader && (
        <header className="kiosk-hero-gradient px-6 py-4">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-bold text-secondary-foreground text-sm">
                S1
              </div>
              <span className="text-lg font-bold text-primary-foreground">SUVIDHA One</span>
            </div>
            {title && (
              <div className="text-right">
                <p className="text-sm font-medium text-primary-foreground/80">{subtitle}</p>
                <p className="text-lg font-bold text-primary-foreground">{title}</p>
              </div>
            )}
          </div>
        </header>
      )}

      <main className="flex flex-1 flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-1 flex-col"
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t border-border bg-card px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between text-xs text-muted-foreground">
          <span>SUVIDHA One — Unified Civic Utility Kiosk</span>
          <span>Powered by Smart City Initiative</span>
        </div>
      </footer>
    </div>
  );
};

export default KioskLayout;
