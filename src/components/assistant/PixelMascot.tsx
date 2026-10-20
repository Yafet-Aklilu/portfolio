import { cn } from "@/lib/cn";

export type MascotExpression =
  | "idle"
  | "blink"
  | "look"
  | "hover"
  | "click"
  | "scroll";

type PixelMascotProps = {
  expression?: MascotExpression;
  className?: string;
};

/**
 * Original monochrome pixel companion for the portfolio assistant.
 * Drawn on a 32×32 grid with crispEdges — not based on Claude’s mark.
 */
export function PixelMascot({
  expression = "idle",
  className,
}: PixelMascotProps) {
  const pupils =
    expression === "hover" || expression === "look"
      ? { lx: 10, ly: 12, rx: 19, ry: 12 }
      : expression === "scroll"
        ? { lx: 11, ly: 14, rx: 20, ry: 14 }
        : expression === "click"
          ? { lx: 10, ly: 13, rx: 19, ry: 13 }
          : { lx: 10, ly: 13, rx: 19, ry: 13 };

  const blinking = expression === "blink";
  const mouth =
    expression === "click"
      ? "open"
      : expression === "hover"
        ? "grin"
        : expression === "scroll"
          ? "smirk"
          : "smile";

  return (
    <svg
      viewBox="0 0 32 32"
      width="100"
      height="100"
      className={cn(
        "pixel-mascot__art block h-[88px] w-[88px] text-ink sm:h-[100px] sm:w-[100px]",
        className,
      )}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {/* Soft shadow (offset pixels) */}
      <g fill="currentColor" opacity="0.12">
        <rect x="9" y="27" width="14" height="2" />
        <rect x="11" y="29" width="10" height="1" />
      </g>

      {/* Antenna */}
      <g fill="currentColor">
        <rect x="15" y="2" width="2" height="4" />
        <rect x="14" y="1" width="4" height="2" />
        <rect x="15" y="0" width="2" height="1" />
      </g>

      {/* Ears */}
      <g fill="currentColor">
        <rect x="5" y="8" width="3" height="4" />
        <rect x="24" y="8" width="3" height="4" />
      </g>

      {/* Body */}
      <g fill="currentColor">
        <rect x="8" y="6" width="16" height="2" />
        <rect x="6" y="8" width="20" height="2" />
        <rect x="5" y="10" width="22" height="12" />
        <rect x="6" y="22" width="20" height="2" />
        <rect x="8" y="24" width="16" height="2" />
      </g>

      {/* Face panel */}
      <g fill="var(--palette-bg)">
        <rect x="8" y="10" width="16" height="12" />
      </g>

      {/* Eyes */}
      {blinking ? (
        <g fill="currentColor">
          <rect x="9" y="14" width="5" height="2" />
          <rect x="18" y="14" width="5" height="2" />
        </g>
      ) : (
        <g>
          <g fill="var(--palette-bg-elevated)">
            <rect x="9" y="12" width="5" height="5" />
            <rect x="18" y="12" width="5" height="5" />
          </g>
          <g fill="currentColor">
            <rect x={pupils.lx} y={pupils.ly} width="2" height="2" />
            <rect x={pupils.rx} y={pupils.ry} width="2" height="2" />
          </g>
          {expression === "click" ? (
            <g fill="currentColor" opacity="0.35">
              <rect x="8" y="11" width="1" height="1" />
              <rect x="14" y="11" width="1" height="1" />
              <rect x="17" y="11" width="1" height="1" />
              <rect x="23" y="11" width="1" height="1" />
            </g>
          ) : null}
        </g>
      )}

      {/* Mouth */}
      <g fill="currentColor">
        {mouth === "open" ? (
          <>
            <rect x="13" y="20" width="6" height="1" />
            <rect x="14" y="21" width="4" height="2" />
          </>
        ) : mouth === "grin" ? (
          <>
            <rect x="12" y="20" width="8" height="1" />
            <rect x="12" y="21" width="1" height="1" />
            <rect x="19" y="21" width="1" height="1" />
          </>
        ) : mouth === "smirk" ? (
          <>
            <rect x="14" y="20" width="5" height="1" />
            <rect x="18" y="21" width="1" height="1" />
          </>
        ) : (
          <rect x="13" y="20" width="6" height="1" />
        )}
      </g>

      {/* Tiny YA stitch on belly edge */}
      <g fill="currentColor" opacity="0.55">
        <rect x="12" y="24" width="1" height="1" />
        <rect x="14" y="24" width="1" height="1" />
        <rect x="16" y="24" width="1" height="1" />
        <rect x="18" y="24" width="1" height="1" />
      </g>

      {/* Feet */}
      <g fill="currentColor">
        <rect x="9" y="26" width="5" height="2" />
        <rect x="18" y="26" width="5" height="2" />
      </g>
    </svg>
  );
}
