import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[#0F172A] text-white hover:bg-[#1E293B] focus:ring-[#0F172A]",
        secondary:
          "bg-[#DCFCE7] text-[#15803D] hover:bg-[#BBF7D0] focus:ring-[#16A34A]",
        success:
          "bg-[#16A34A] text-white hover:bg-[#15803D] focus:ring-[#16A34A]",
        warning:
          "bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A] focus:ring-[#F59E0B]",
        destructive:
          "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500",
        outline:
          "border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] focus:ring-[#0F172A]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
