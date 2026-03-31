"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  showPercentage?: boolean
  indicatorClassName?: string
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, showPercentage = false, indicatorClassName, ...props }, ref) => {
  const percentage = Math.min(100, Math.max(0, value ?? 0))

  return (
    <div className="flex items-center gap-3 w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-slate-100",
          className
        )}
        value={percentage}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 rounded-full transition-all duration-500 ease-in-out",
            percentage === 100
              ? "bg-[#16A34A]"
              : percentage >= 60
              ? "bg-[#0F172A]"
              : percentage >= 30
              ? "bg-[#F59E0B]"
              : "bg-red-400",
            indicatorClassName
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </ProgressPrimitive.Root>
      {showPercentage && (
        <span className="min-w-[3rem] text-right text-sm font-medium text-[#0F172A]">
          {percentage}%
        </span>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
