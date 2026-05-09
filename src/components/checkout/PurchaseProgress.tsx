"use client";

import { cn } from "@/lib/utils";

export type PurchaseProgressStep = "cart" | "details" | "payment" | "review" | "confirmed";

interface PurchaseProgressProps {
  currentStep: PurchaseProgressStep;
  className?: string;
}

const steps: Array<{
  id: PurchaseProgressStep;
  activeClassName: string;
}> = [
  {
    id: "cart",
    activeClassName: "from-amber-300 via-orange-400 to-[#FF6B00]",
  },
  {
    id: "details",
    activeClassName: "from-orange-400 via-[#FF6B00] to-red-500",
  },
  {
    id: "payment",
    activeClassName: "from-red-500 via-rose-500 to-fuchsia-500",
  },
  {
    id: "review",
    activeClassName: "from-fuchsia-500 via-violet-500 to-sky-400",
  },
  {
    id: "confirmed",
    activeClassName: "from-cyan-300 via-sky-500 to-blue-700",
  },
];

export function PurchaseProgress({ currentStep, className }: PurchaseProgressProps) {
  const currentIndex = Math.max(0, steps.findIndex((step) => step.id === currentStep));
  const activeStep = steps[currentIndex] ?? steps[0];
  const progressWidth = `${(currentIndex / (steps.length - 1)) * 100}%`;

  return (
    <div className={cn("sticky top-[7.75rem] z-40 -mx-4 border-b border-white/60 bg-[#f4fbf6]/90 px-4 py-2 backdrop-blur-xl md:hidden", className)}>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-zinc-200/80 shadow-inner">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full bg-gradient-to-r shadow-[0_0_18px_rgba(255,107,0,0.35)] transition-all duration-700 ease-out",
            activeStep.activeClassName,
          )}
          style={{ width: progressWidth }}
        />
      </div>
      <div className="mt-1.5 grid grid-cols-5 gap-1">
        {steps.map((step, index) => (
          <span
            key={step.id}
            className={cn(
              "h-1 rounded-full transition-colors duration-500",
              index <= currentIndex ? "bg-zinc-900/50" : "bg-zinc-300/70",
            )}
          />
        ))}
      </div>
    </div>
  );
}
