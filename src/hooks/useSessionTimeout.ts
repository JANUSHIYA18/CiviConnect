import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const TIMEOUT_MS = 120_000; // 2 minutes
const WARNING_MS = 30_000;  // show warning 30s before

export const useSessionTimeout = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setShowWarning(false);
    setSecondsLeft(30);
  }, []);

  const handleLogout = useCallback(async () => {
    clearAllTimers();
    await signOut();
    navigate("/");
  }, [signOut, navigate, clearAllTimers]);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    if (!user) return;

    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setSecondsLeft(Math.floor(WARNING_MS / 1000));
      countdownRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
    }, TIMEOUT_MS - WARNING_MS);

    timerRef.current = setTimeout(() => {
      handleLogout();
    }, TIMEOUT_MS);
  }, [user, clearAllTimers, handleLogout]);

  useEffect(() => {
    if (!user) return;

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    const handler = () => resetTimer();

    events.forEach((e) => window.addEventListener(e, handler));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      clearAllTimers();
    };
  }, [user, resetTimer, clearAllTimers]);

  return { showWarning, secondsLeft, resetTimer };
};
