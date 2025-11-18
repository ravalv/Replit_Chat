import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SessionTimeoutWarningProps {
  isOpen: boolean;
  remainingSeconds: number;
  onExtendSession: () => void;
  onLogout: () => void;
}

export default function SessionTimeoutWarning({
  isOpen,
  remainingSeconds,
  onExtendSession,
  onLogout,
}: SessionTimeoutWarningProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle>Session Expiring Soon</DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            Your session will expire due to inactivity. You will be automatically logged out in:
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-6">
          <div className="text-4xl font-mono font-semibold" data-testid="text-countdown">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onLogout} data-testid="button-logout-now">
            Logout Now
          </Button>
          <Button onClick={onExtendSession} data-testid="button-extend-session">
            Continue Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
