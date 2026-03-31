"use client"

import { Bell, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TopbarProps {
  title?: string
  subtitle?: string
}

export function Topbar({ title = "Dashboard", subtitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 md:px-6 bg-white border-b border-[#E2E8F0] shadow-sm">
      {/* Left: Title (with mobile spacing for hamburger) */}
      <div className="flex items-center gap-3 ml-12 md:ml-0">
        <div>
          <h1 className="text-[#0F172A] font-semibold text-base leading-tight">{title}</h1>
          {subtitle && <p className="text-[#64748B] text-xs">{subtitle}</p>}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors hidden sm:flex">
          <Search className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <Link href="/conteudo">
          <Button size="sm" variant="secondary" className="hidden sm:flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Gerar</span>
          </Button>
        </Link>
      </div>
    </header>
  )
}
