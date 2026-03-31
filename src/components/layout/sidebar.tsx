"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard, Target, FileText, MessageCircle, Zap, Filter,
  BarChart2, Clock, Settings, ChevronRight, LogOut, Menu, X,
  Sparkles, User
} from "lucide-react"
import { cn, usageColour } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/oferta-dna", label: "Oferta DNA", icon: Target },
  { href: "/conteudo", label: "Conteúdo", icon: FileText },
  { href: "/whatsapp", label: "WhatsApp & Direct", icon: MessageCircle },
  { href: "/campanha", label: "Campanha Expressa", icon: Zap },
  { href: "/funil", label: "Funil de Leads", icon: Filter },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/historico", label: "Histórico", icon: Clock },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
]

interface SidebarProps {
  generationsUsed?: number
  generationsLimit?: number
  userEmail?: string
  userName?: string
  plan?: string
}

interface SidebarContentProps {
  pathname: string
  setIsOpen: (v: boolean) => void
  handleSignOut: () => void
  generationsUsed: number
  generationsLimit: number
  usagePercent: number
  plan: string
  userEmail: string
  userName: string
}

function SidebarContent({
  pathname,
  setIsOpen,
  handleSignOut,
  generationsUsed,
  generationsLimit,
  usagePercent,
  plan,
  userEmail,
  userName,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1E293B]">
        <div className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">LeadPronto</p>
          <p className="text-[#16A34A] text-xs font-semibold">AI</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-[#16A34A] text-white shadow-sm"
                      : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Usage bar */}
      <div className="px-4 py-3 border-t border-[#1E293B]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[#94A3B8] text-xs">Gerações</span>
          <span className="text-white text-xs font-medium">{generationsUsed}/{generationsLimit}</span>
        </div>
        <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", usageColour(usagePercent))}
            style={{ width: `${Math.min(usagePercent, 100)}%` }}
          />
        </div>
        <p className="text-[#64748B] text-xs mt-1 capitalize">Plano {plan}</p>
      </div>

      {/* User section */}
      <div className="px-3 py-3 border-t border-[#1E293B]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-[#16A34A] flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{userName || "Usuário"}</p>
            <p className="text-[#64748B] text-xs truncate">{userEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-md text-[#64748B] hover:text-white hover:bg-[#1E293B] transition-colors"
            title="Sair"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function Sidebar({
  generationsUsed = 0,
  generationsLimit = 40,
  userEmail = "",
  userName = "",
  plan = "basic"
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const usagePercent = Math.round((generationsUsed / generationsLimit) * 100)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0F172A] text-white shadow-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          pathname={pathname}
          setIsOpen={setIsOpen}
          handleSignOut={handleSignOut}
          generationsUsed={generationsUsed}
          generationsLimit={generationsLimit}
          usagePercent={usagePercent}
          plan={plan}
          userEmail={userEmail}
          userName={userName}
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0 bg-[#0F172A] border-r border-[#1E293B]">
        <SidebarContent
          pathname={pathname}
          setIsOpen={setIsOpen}
          handleSignOut={handleSignOut}
          generationsUsed={generationsUsed}
          generationsLimit={generationsLimit}
          usagePercent={usagePercent}
          plan={plan}
          userEmail={userEmail}
          userName={userName}
        />
      </div>
    </>
  )
}
