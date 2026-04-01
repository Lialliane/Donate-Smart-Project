import React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Icon } from '@iconify/react';

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

export function Checkbox({ className, ...props }) {
  return (
    <CheckboxPrimitive.Root
      className={cx(
        "peer size-4 shrink-0 rounded-[4px] border border-input bg-background shadow-sm ",
        "transition-shadow outline-none",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Icon icon="lucide:check" className="h-3.5 w-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}
