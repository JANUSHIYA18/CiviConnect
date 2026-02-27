import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  show: boolean;
  secondsLeft: number;
  onContinue: () => void;
}

const SessionTimeoutWarning = ({ show, secondsLeft, onContinue }: Props) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="rounded-2xl bg-card p-8 kiosk-card-shadow max-w-sm mx-4 text-center"
          >
            <Clock className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-card-foreground mb-2">Session Timeout</h3>
            <p className="text-muted-foreground mb-4">
              Your session will expire in <span className="font-bold text-destructive text-lg">{secondsLeft}s</span>
            </p>
            <Button variant="kiosk" className="w-full h-14" onClick={onContinue}>
              Continue Session
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionTimeoutWarning;
