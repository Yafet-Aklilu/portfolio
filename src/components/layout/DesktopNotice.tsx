"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  DESKTOP_NOTICE_KEY,
  readDismissed,
  writeDismissed,
} from "@/lib/storage";

export function DesktopNotice() {
  const isCompact = useMediaQuery("(max-width: 1023px)");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isCompact) {
      setVisible(false);
      return;
    }
    setVisible(!readDismissed(DESKTOP_NOTICE_KEY));
  }, [isCompact]);

  if (!visible) return null;

  return (
    <div
      className="relative z-[60] border-b border-line bg-bg-elevated"
      role="region"
      aria-label="Display recommendation"
    >
      <Container className="flex items-start justify-between gap-6 py-3.5 sm:items-center">
        <div className="min-w-0">
          <p className="text-label text-muted">Best on desktop</p>
          <p className="mt-1 text-sm text-ink-muted sm:text-[15px]">
            This portfolio is designed for a larger screen. Continue here anytime,
            or open it on desktop for the full editorial experience.
          </p>
        </div>
        <button
          type="button"
          className="text-label shrink-0 text-ink transition-opacity hover:opacity-55"
          onClick={() => {
            writeDismissed(DESKTOP_NOTICE_KEY);
            setVisible(false);
          }}
        >
          Continue
        </button>
      </Container>
    </div>
  );
}
