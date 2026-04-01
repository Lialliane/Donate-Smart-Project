import React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Icon } from '@iconify/react';

// Utility to merge class names without needing a library
function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function RadioGroup({ className, ...props }) {
  return (
    <RadioGroupPrimitive.Root
      className={cx("grid gap-3", className)}
      {...props}
    />
  )
}

export function RadioGroupItem({ className, ...props }) {
  return (
    <RadioGroupPrimitive.Item
      className={cx(
        "aspect-square size-4 shrink-0 rounded-full border border-input shadow-sm bg-[var(--color-bg-soft)]",
        "focus-visible:ring-2 focus-visible:ring-[#a1a1a1] focus-visible:ring-offset-2",
        "data-[state=checked]:border-[var(--color-primary)] data-[state=checked]:bg-[#7fdb34]/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="relative flex items-center justify-center">
        <Icon icon="material-symbols:circle"
          className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-primary)]"
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}
