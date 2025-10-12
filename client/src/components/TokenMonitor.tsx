"use client";
import { useTokenMonitoring } from "@/hooks/useTokenMonitoring";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import TokenExpirationNotification from "./TokenExpirationNotification";
import { performAutoLogout } from "@/lib/tokenUtils";

interface TokenMonitorProps {
  children: React.ReactNode;
}

const TokenMonitor: React.FC<TokenMonitorProps> = ({ children }) => {
  const router = useRouter();
  const { checkTokens } = useTokenMonitoring();

  useEffect(() => {
    // Check tokens on mount and route changes
    const handleRouteChange = () => {
      if (checkTokens()) {
        router.push("/auth");
      }
    };

    // Initial check
    handleRouteChange();

    // Listen for route changes
    const handlePopState = () => {
      handleRouteChange();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [checkTokens, router]);

  const handleLogout = () => {
    performAutoLogout();
  };

  return (
    <>
      {children}
      <TokenExpirationNotification onLogout={handleLogout} />
    </>
  );
};

export default TokenMonitor;
