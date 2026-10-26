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

function bounds(size: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const pad = w < 640 ? 10 : 18;
  return {
    pad,
    maxX: Math.max(pad, w - size - pad),
    maxY: Math.max(pad, h - size - pad),
    w,
    h,
    mobile: w < 768,
  };
}

function parkCorner(size: number): Spot {
  const { maxX, maxY } = bounds(size);
  return { x: maxX, y: maxY, rotation: 0 };
}

function clampSpot(x: number, y: number, rotation: number, size: number): Spot {
  const { pad, maxX, maxY } = bounds(size);
  return {
    x: Math.min(maxX, Math.max(pad, x)),
    y: Math.min(maxY, Math.max(pad, y)),
    rotation,
  };
}

/**
 * Soft nearby target from current position — small drifts feel continuous,
 * not teleporting across the viewport.
 */
function softNearbySpot(size: number, from: Spot, scrollDir: number): Spot {
  const { mobile, w, h } = bounds(size);
  const reach = mobile
    ? Math.min(110, Math.min(w, h) * 0.18)
    : Math.min(160, Math.min(w, h) * 0.16);

  // Bias slightly with scroll direction so motion feels intentional
  const biasY = scrollDir >= 0 ? reach * 0.25 : -reach * 0.25;
  const dx = (Math.random() * 2 - 1) * reach;
  const dy = (Math.random() * 2 - 1) * reach * 0.85 + biasY;
  const rot =
    from.rotation * 0.4 + (Math.random() * 6 - 3) * (mobile ? 0.6 : 1);

  return clampSpot(from.x + dx, from.y + dy, rot, size);
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

  // Smooth scroll-driven drifts (nearby targets + quickTo easing)
  useIsomorphicLayoutEffect(() => {
    const mover = moverRef.current;
    if (!mover) return;

    const { gsap } = getGsap();
    const size = mascotSize();

    if (open || reducedMotion) {
      gsap.killTweensOf(mover);
      const park = parkCorner(size);
      spotRef.current = park;
      gsap.set(mover, {
        left: park.x,
        top: park.y,
        rotation: 0,
        x: 0,
        y: 0,
      });
      applyBubbleSide(park.x);
      return;
    }

    const start = spotRef.current ?? parkCorner(size);
    spotRef.current = start;
    gsap.set(mover, {
      left: start.x,
      top: start.y,
      rotation: start.rotation,
      x: 0,
      y: 0,
      force3D: true,
    });
    applyBubbleSide(start.x);

    const xTo = gsap.quickTo(mover, "left", {
      duration: 1.55,
      ease: "power3.out",
      onUpdate: () => {
        applyBubbleSide(Number(gsap.getProperty(mover, "left")) || 0);
      },
    });
    const yTo = gsap.quickTo(mover, "top", {
      duration: 1.55,
      ease: "power3.out",
    });
    const rTo = gsap.quickTo(mover, "rotation", {
      duration: 1.8,
      ease: "power2.out",
    });

    let lastScrollY = window.scrollY;
    let travelled = 0;
    const driftEveryPx = 90;

    const drift = (direction: number) => {
      if (pausedRef.current) return;
      const current = spotRef.current ?? parkCorner(mascotSize());
      const next = softNearbySpot(mascotSize(), current, direction);
      spotRef.current = next;
      xTo(next.x);
      yTo(next.y);
      rTo(next.rotation);

      if (!expressionLock.current && !interactiveRef.current) {
        setExpression(direction >= 0 ? "scroll" : "look");
        const exprId = window.setTimeout(() => {
          if (!interactiveRef.current && !expressionLock.current) {
            setExpression("idle");
          }
        }, 420);
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
      if (travelled < driftEveryPx) return;
      travelled = 0;
      drift(delta);
    };

    const onResize = () => {
      const sizeNow = mascotSize();
      const current = spotRef.current ?? parkCorner(sizeNow);
      const next = clampSpot(current.x, current.y, current.rotation, sizeNow);
      spotRef.current = next;
      gsap.set(mover, { left: next.x, top: next.y, rotation: next.rotation });
      applyBubbleSide(next.x);
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
