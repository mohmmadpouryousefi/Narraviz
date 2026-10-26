"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Two-step destructive action: the first click asks, the second confirms. Avoids window.confirm(),
 * which blocks the page, and resets itself after a few seconds.
 */
export function ConfirmButton({
  onConfirm,
  label,
  confirmLabel = "Click again to confirm",
  icon,
  disabled,
}: {
  onConfirm: () => void | Promise<void>;
  label: string;
  confirmLabel?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <Button
      type="button"
      size="sm"
      variant={armed ? "destructive" : "ghost"}
      disabled={disabled || busy}
      aria-label={armed ? confirmLabel : label}
      title={armed ? confirmLabel : label}
      onClick={async () => {
        if (!armed) return setArmed(true);
        setBusy(true);
        try {
          await onConfirm();
        } finally {
          setBusy(false);
          setArmed(false);
        }
      }}
    >
      {icon}
      {armed && <span className="ml-1">{confirmLabel}</span>}
    </Button>
  );
}
