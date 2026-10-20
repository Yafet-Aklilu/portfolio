"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AiAssistantPanel } from "@/components/assistant/AiAssistantPanel";
import {
  PixelMascot,
  type MascotExpression,
} from "@/components/assistant/PixelMascot";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { getGsap } from "@/lib/gsap";

const BUBBLE_COPY = "Ask me anything about Yafet";

type Spot = { x: number; y: number; rotation: number };

function mascotSize() {
  return window.matchMedia("(max-width: 639px)").matches ? 88 : 100;
}

function parkCorner(size: number): Spot {
  const pad = window.innerWidth < 640 ? 12 : 24;
  return {
    x: Math.max(pad, window.innerWidth - size - pad),
    y: Math.max(pad, window.innerHeight - size - pad),
    rotation: 0,
  };
}

/** Random viewport spot in safe margins (not tied to page scroll height). */
function randomSpot(size: number, avoid: Spot | null): Spot {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const pad = w < 640 ? 10 : 18;
  const maxX = Math.max(pad, w - size - pad);
  const maxY = Math.max(pad, h - size - pad);
  const mobile = w < 768;

  let x = pad;
  let y = pad;

  if (mobile) {
    // Prefer the right third so content stays readable
    const band = Math.floor(Math.random() * 3);
    x = maxX - Math.random() * Math.min(36, maxX * 0.12);
    if (band === 0) y = pad + Math.random() * (h * 0.28);
    else if (band === 1) y = h * 0.35 + Math.random() * (h * 0.25);
    else y = h * 0.62 + Math.random() * Math.max(20, maxY - h * 0.62);
  } else {
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) {
      x = pad + Math.random() * Math.max(1, maxX - pad);
      y = pad + Math.random() * Math.min(h * 0.22, 140);
    } else if (edge === 1) {
      x = pad + Math.random() * Math.max(1, maxX - pad);
      y = maxY - Math.random() * Math.min(h * 0.24, 160);
    } else if (edge === 2) {
      x = pad + Math.random() * Math.min(w * 0.22, 180);
      y = pad + Math.random() * Math.max(1, maxY - pad);
    } else {
      x = maxX - Math.random() * Math.min(w * 0.24, 200);
      y = pad + Math.random() * Math.max(1, maxY - pad);
    }
  }

  x = Math.min(maxX, Math.max(pad, x));
  y = Math.min(maxY, Math.max(pad, y));

  if (
    avoid &&
    Math.hypot(x - avoid.x, y - avoid.y) <
      Math.min(w, h) * (mobile ? 0.18 : 0.22)
  ) {
    return randomSpot(size, null);
  }

  return {
    x,
    y,
    rotation: (Math.random() * 10 - 5) * (mobile ? 0.7 : 1),
  };
}

export function AiAssistantButton() {
  const reducedMotion = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [expression, setExpression] = useState<MascotExpression>("idle");
  const [clicking, setClicking] = useState(false);
  const [bubbleSide, setBubbleSide] = useState<"start" | "end">("end");

  const moverRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<Spot | null>(null);
  const expressionLock = useRef(false);
  const interactiveRef = useRef(false);
  const bubbleSideRef = useRef<"start" | "end">("end");
  const pausedRef = useRef(false);
  const timers = useRef<number[]>([]);

  interactiveRef.current = hovered || focused || clicking;
  pausedRef.current = hovered || focused || clicking || open;

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const applyBubbleSide = useCallback((x: number) => {
    const next = x < window.innerWidth * 0.45 ? "start" : "end";
    if (next === bubbleSideRef.current) return;
    bubbleSideRef.current = next;
    setBubbleSide(next);
  }, []);

  // Random hops on scroll — not scrubbed to page height, no idle timer
  useIsomorphicLayoutEffect(() => {
    const mover = moverRef.current;
    if (!mover) return;

    const { gsap } = getGsap();
    const size = mascotSize();

    const place = (spot: Spot, animate: boolean) => {
      spotRef.current = spot;
      applyBubbleSide(spot.x);
      if (animate && !reducedMotion) {
        gsap.to(mover, {
          left: spot.x,
          top: spot.y,
          rotation: spot.rotation,
          duration: 1.15 + Math.random() * 0.55,
          ease: "power1.inOut",
          overwrite: "auto",
          onUpdate: () => {
            applyBubbleSide(Number(gsap.getProperty(mover, "left")) || spot.x);
          },
        });
      } else {
        gsap.set(mover, {
          left: spot.x,
          top: spot.y,
          rotation: reducedMotion ? 0 : spot.rotation,
          x: 0,
          y: 0,
        });
      }
    };

    if (open || reducedMotion) {
      gsap.killTweensOf(mover);
      place(parkCorner(size), false);
      return;
    }

    place(spotRef.current ?? parkCorner(size), false);

    let lastScrollY = window.scrollY;
    let travelled = 0;
    const hopEveryPx = 140;

    const hop = (direction: number) => {
      if (pausedRef.current) return;
      place(randomSpot(mascotSize(), spotRef.current), true);
      if (!expressionLock.current && !interactiveRef.current) {
        setExpression(direction >= 0 ? "scroll" : "look");
        const exprId = window.setTimeout(() => {
          if (!interactiveRef.current && !expressionLock.current) {
            setExpression("idle");
          }
        }, 380);
        timers.current.push(exprId);
      }
    };

    const onScroll = () => {
      if (pausedRef.current) {
        lastScrollY = window.scrollY;
        return;
      }
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      travelled += Math.abs(delta);
      if (travelled < hopEveryPx) return;
      travelled = 0;
      hop(delta);
    };

    const onResize = () => {
      const sizeNow = mascotSize();
      const current = spotRef.current ?? parkCorner(sizeNow);
      const pad = window.innerWidth < 640 ? 10 : 18;
      place(
        {
          x: Math.min(
            Math.max(pad, current.x),
            window.innerWidth - sizeNow - pad,
          ),
          y: Math.min(
            Math.max(pad, current.y),
            window.innerHeight - sizeNow - pad,
          ),
          rotation: current.rotation,
        },
        false,
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(mover);
    };
  }, [open, reducedMotion, applyBubbleSide]);

  // Idle blink
  useEffect(() => {
    if (open || reducedMotion || hovered || focused || clicking) return;

    let cancelled = false;
    let timeoutId = 0;

    const scheduleBlink = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled || expressionLock.current) {
          scheduleBlink();
          return;
        }
        setExpression("blink");
        window.setTimeout(() => {
          if (!cancelled && !interactiveRef.current) setExpression("idle");
          if (!cancelled) scheduleBlink();
        }, 140);
      }, 3000 + Math.random() * 3400);
    };

    scheduleBlink();
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [open, reducedMotion, hovered, focused, clicking]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useEffect(() => {
    if (clicking || open) return;
    if (hovered || focused) {
      setExpression(reducedMotion ? "idle" : "hover");
    } else {
      setExpression("idle");
    }
  }, [hovered, focused, clicking, open, reducedMotion]);

  const showBubble = (hovered || focused) && !open && !clicking;

  const openChat = () => {
    if (open || clicking) return;

    if (reducedMotion) {
      setOpen(true);
      return;
    }

    expressionLock.current = true;
    setClicking(true);
    setExpression("click");

    const id = window.setTimeout(() => {
      setOpen(true);
      setClicking(false);
      expressionLock.current = false;
      setExpression("idle");
    }, 220);
    timers.current.push(id);
  };

  return (
    <>
      <div
        ref={moverRef}
        className={cn(
          "pointer-events-none fixed z-[70] will-change-transform",
          open && "invisible",
        )}
        style={{ left: 0, top: 0 }}
      >
        <div
          className={cn(
            "pointer-events-auto relative flex flex-col",
            bubbleSide === "end" ? "items-end" : "items-start",
          )}
        >
          <div
            id="assistant-mascot-tip"
            role="tooltip"
            className={cn(
              "pixel-mascot__bubble mb-2 max-w-[11.5rem] px-3 py-2 text-left text-[11px] leading-snug text-ink sm:max-w-[13rem] sm:text-[12px]",
              bubbleSide === "end"
                ? "pixel-mascot__bubble--end"
                : "pixel-mascot__bubble--start",
              showBubble
                ? "pixel-mascot__bubble--visible"
                : "pointer-events-none opacity-0",
            )}
          >
            {BUBBLE_COPY}
          </div>

          <button
            type="button"
            className={cn(
              "pixel-mascot relative inline-flex origin-bottom touch-manipulation items-end justify-center bg-transparent p-0 text-ink",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
              clicking && "pixel-mascot--click",
              (hovered || focused) && !clicking && "pixel-mascot--react",
            )}
            aria-label="Open portfolio assistant"
            aria-expanded={open}
            aria-describedby={showBubble ? "assistant-mascot-tip" : undefined}
            title={BUBBLE_COPY}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onClick={openChat}
          >
            <span className="sr-only">{BUBBLE_COPY}</span>
            <PixelMascot expression={reducedMotion ? "idle" : expression} />
          </button>
        </div>
      </div>

      <AiAssistantPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
