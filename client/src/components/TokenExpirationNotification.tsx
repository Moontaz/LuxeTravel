"use client";
import { useState, useEffect } from "react";
import { getTimeUntilExpiration } from "@/lib/tokenUtils";
import { getAuthTokens } from "@/lib/cookieHandler";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface TokenExpirationNotificationProps {
  onLogout: () => void;
}

const TokenExpirationNotification: React.FC<
  TokenExpirationNotificationProps
> = ({ onLogout }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    const updateTimeLeft = () => {
      const { token1, token2 } = getAuthTokens();

      if (token1 || token2) {
        let earliestExpiration = Infinity;

        if (token1) {
          const timeUntilExp1 = getTimeUntilExpiration(token1);
          if (timeUntilExp1 > 0) {
            earliestExpiration = Math.min(earliestExpiration, timeUntilExp1);
          }
        }

        if (token2) {
          const timeUntilExp2 = getTimeUntilExpiration(token2);
          if (timeUntilExp2 > 0) {
            earliestExpiration = Math.min(earliestExpiration, timeUntilExp2);
          }
        }

        if (earliestExpiration !== Infinity) {
          setTimeLeft(earliestExpiration);

          // Show notification when 5 minutes left
          if (earliestExpiration <= 300000 && earliestExpiration > 0) {
            setShowNotification(true);
          }
        }
      }
    };

    // Update immediately
    updateTimeLeft();

    // Update every second
    const interval = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleLogout = () => {
    onLogout();
    setShowNotification(false);
  };

  if (!showNotification || timeLeft <= 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-80 border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-orange-800">
                Session Expiring Soon
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                Your session will expire in {formatTime(timeLeft)}. Please save
                your work and refresh to continue.
              </p>
              <div className="flex items-center space-x-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  Logout Now
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowNotification(false)}
                  className="text-orange-600 hover:bg-orange-100"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenExpirationNotification;
