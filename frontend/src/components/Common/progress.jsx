import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

function Progress({ value ,...props}) 
{
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={"bg-[#7fdb34]/20 relative h-2 w-full overflow-hidden rounded-full"}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-[#7fdb34] h-full w-full flex-1 transition-all"
        style={{
          transform: `translateX(-${100 - value}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
