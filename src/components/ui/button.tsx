"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#0F172A] text-white hover:bg-[#1E293B] focus-visible:ring-[#0F172A]",
        secondary:
          "bg-[#16A34A] text-white hover:bg-[#15803D] focus-visible:ring-[#16A34A]",
        accent:
          "bg-[#F59E0B] text-[#0F172A] hover:bg-[#D97706] focus-visible:ring-[#F59E0B]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
        outline:
          "border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:text-[#0F172A] focus-visible:ring-[#0F172A]",
        ghost:
          "hover:bg-[#F1F5F9] hover:text-[#0F172A] focus-visible:ring-[#0F172A]",
        link: "text-[#16A34A] underline-offset-4 hover:underline focus-visible:ring-[#16A34A]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
