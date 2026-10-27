"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cvs, type CvItem } from "@/lib/content";
import { cn } from "@/lib/cn";

type CvActionsProps = {
  /** When set, only this CV (category page). When omitted, show all (hero). */
  cv?: CvItem;
  variant?: "hero" | "page";
  className?: string;
};

function CvLinks({
  cv,
  layout = "row",
}: {
  cv: CvItem;
  layout?: "row" | "stack";
}) {
  const filename = cv.href.split("/").pop() ?? "cv.pdf";
  return (
    <div
      className={cn(
        "flex gap-2",
        layout === "stack" ? "flex-col" : "flex-wrap items-center",
      )}
    >
      <a
        href={cv.href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-line !px-3 !py-2"
      >
        View
      </a>
      <a href={cv.href} download={filename} className="btn btn-solid !px-3 !py-2">
        Download
      </a>
    </div>
  );
}

export function CvActions({ cv, variant = "page", className }: CvActionsProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (cv) {
    return (
      <div className={cn("flex flex-wrap items-center gap-3", className)}>
        {variant === "page" ? (
          <p className="text-label text-muted">CV · {cv.label}</p>
        ) : null}
        <CvLinks cv={cv} />
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className="btn btn-line"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        CV
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 top-full z-20 mt-2 min-w-[16rem] border border-line bg-bg p-3 shadow-[0_12px_40px_rgba(0,0,0,0.12)] lg:left-auto lg:right-0"
        >
          <ul className="space-y-4">
            {cvs.map((item) => (
              <li key={item.id} className="space-y-2">
                <p className="text-label text-muted">{item.shortLabel}</p>
                <CvLinks cv={item} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
