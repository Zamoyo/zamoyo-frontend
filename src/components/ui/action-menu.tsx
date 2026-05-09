"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function ActionMenu({
  ...props
}: React.ComponentProps<typeof Popover>) {
  return <Popover {...props} />
}

function ActionMenuTrigger({
  ...props
}: React.ComponentProps<typeof PopoverTrigger>) {
  return <PopoverTrigger {...props} />
}

function ActionMenuContent({
  className,
  align = "end",
  side = "bottom",
  sideOffset = 6,
  collisionPadding = 12,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  return (
    <PopoverContent
      align={align}
      side={side}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cn(
        "w-44 gap-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-1.5 text-zinc-700 shadow-[0_10px_40px_rgba(0,0,0,0.1)] ring-0",
        className
      )}
      {...props}
    />
  )
}

function ActionMenuItem({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009E49]",
        className
      )}
      {...props}
    />
  )
}

function ActionMenuNote({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-xl px-3 py-2 text-left text-[11px] font-bold text-zinc-500", className)}
      {...props}
    />
  )
}

function ActionMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("my-1 h-px bg-zinc-100", className)} {...props} />
}

export {
  ActionMenu,
  ActionMenuContent,
  ActionMenuItem,
  ActionMenuNote,
  ActionMenuSeparator,
  ActionMenuTrigger,
}
