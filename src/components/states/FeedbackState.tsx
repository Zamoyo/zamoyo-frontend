"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeedbackTone = "default" | "danger";

type FeedbackStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  tone?: FeedbackTone;
  className?: string;
};

export function FeedbackState({
  icon: Icon,
  title,
  description,
  action,
  tone = "default",
  className,
}: FeedbackStateProps) {
  const toneClassName =
    tone === "danger"
      ? "border-red-100 bg-red-50 text-red-900"
      : "border-zinc-200/60 bg-white text-zinc-900 shadow-[0_8px_30px_rgba(15,23,42,0.04)]";

  const iconClassName =
    tone === "danger"
      ? "bg-red-100 text-red-500"
      : "bg-zinc-100 text-zinc-400";

  const descriptionClassName = tone === "danger" ? "text-red-700" : "text-zinc-500";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border p-8 text-center",
        toneClassName,
        className,
      )}
    >
      <div className={cn("mb-4 flex h-16 w-16 items-center justify-center rounded-full", iconClassName)}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className={cn("mt-1 text-sm", descriptionClassName)}>{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
