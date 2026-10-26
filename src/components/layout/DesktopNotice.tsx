"use client";

import { useEffect, useId, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  DESKTOP_NOTICE_KEY,
  readDismissed,
  writeDismissed,
} from "@/lib/storage";

/**
 * Full-screen gate on compact viewports.
 * Site stays blocked until the visitor chooses to continue.
 */
export function DesktopNotice() {
  const isCompact = useMediaQuery("(max-width: 1023px)");
  const [ready, setReady] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!isCompact) {
      setBlocking(false);
      setReady(true);
      return;
    }
    setBlocking(!readDismissed(DESKTOP_NOTICE_KEY));
    setReady(true);
  }, [isCompact]);

  useEffect(() => {
    if (!blocking) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [blocking]);

  if (!ready || !blocking) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="w-full max-w-md text-center">
        <p className="text-label text-muted">Display</p>
        <h2 id={titleId} className="text-title mt-5 text-ink">
          Better on a larger screen
        </h2>
        <p
          id={descId}
          className="mt-5 text-sm leading-relaxed text-ink-muted sm:text-[15px]"
        >
          This portfolio is designed for desktop. The layout, motion, and
          editorial pacing land best on a bigger display. You can still continue
          here if you prefer.
        </p>
        <button
          type="button"
          className="btn btn-solid mt-10"
          autoFocus
          onClick={() => {
            writeDismissed(DESKTOP_NOTICE_KEY);
            setBlocking(false);
          }}
        >
          Go anyways
        </button>
      </div>
    </div>
  );
}
