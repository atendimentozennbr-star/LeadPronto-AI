import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Topbar } from "@/components/layout/topbar"
import { UsageCard } from "@/components/dashboard/usage-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  FileText, MessageCircle, Zap, Users, Target, Clock,
  TrendingUp, Plus, Calendar, CheckCircle2, AlertCircle,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

const PLAN_LIMITS: Record<string, number> = { free: 10, basic: 40, pro: 200 }

const CONTENT_LABEL: Record<string, string> = {
  post: "Post", story: "Story", reel: "Reel", email: "E-mail",
  whatsapp: "WhatsApp", ad: "Anúncio", blog: "Blog", caption: "Legenda",
}

const CONTENT_VARIANT: Record<string, "default" | "secondary" | "warning" | "success" | "outline"> = {
  post: "secondary", story: "warning", reel: "success", email: "default",
  whatsapp: "secondary", ad: "warning", blog: "outline", caption: "default",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ data: profile }, { data: workspace }] = await Promise.all([
    supabase.from("profiles").select("full_name, onboarded").eq("id", user.id).single(),
    supabase.from("workspaces").select("id, name").eq("owner_id", user.id).single(),
  ])

  if (profile && !profile.onboarded) redirect("/onboarding")

  if (!workspace) {
    return (
      <div>
        <Topbar title="Dashboard" subtitle="Bem-vindo ao LeadPronto AI" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-[#16A34A]" />
            </div>
            <h2 className="text-xl font-semibold text-[#0F172A]">Configure sua conta</h2>
            <p className="text-[#64748B] max-w-sm">Complete o onboarding para acessar todos os recursos.</p>
            <Link href="/onboarding">
              <Button variant="secondary" size="lg">Iniciar configuração</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const now = new Date().toISOString()

  const [
    { data: subscription },
    { count: generationsUsed },
    { data: recentContents },
    { count: totalContents },
    { count: leadsCount },
    { count: brandsCount },
    { data: pendingFollowups },
  ] = await Promise.all([
    supabase.from("subscriptions").select("plan, current_period_end").eq("workspace_id", workspace.id).single(),
    supabase.from("usage_logs").select("*", { count: "exact", head: true }).eq("workspace_id", workspace.id).gte("created_at", startOfMonth),
    supabase.from("generated_contents").select("id, type, title, content, created_at").eq("workspace_id", workspace.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("generated_contents").select("*", { count: "exact", head: true }).eq("workspace_id", workspace.id),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("workspace_id", workspace.id).in("status", ["new", "contacted", "qualified", "negotiating"]),
    supabase.from("brands").select("*", { count: "exact", head: true }).eq("workspace_id", workspace.id),
    supabase.from("lead_followups").select("id, type, content, scheduled_at, leads(name)").eq("workspace_id", workspace.id).eq("is_completed", false).lte("scheduled_at", now).order("scheduled_at", { ascending: true }).limit(5),
  ])

  const plan = subscription?.plan ?? "free"
  const generationsLimit = PLAN_LIMITS[plan] ?? 40
  const resetDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
    : undefined
  const firstName = profile?.full_name?.split(" ")[0] ?? "Usuário"

  const stats = [
    { label: "Gerações usadas", value: generationsUsed ?? 0, icon: Zap, color: "text-[#F59E0B]", bg: "bg-[#FEF3C7]", sub: `de ${generationsLimit} este mês` },
    { label: "Marcas", value: brandsCount ?? 0, icon: Target, color: "text-[#16A34A]", bg: "bg-[#DCFCE7]", sub: "configuradas" },
    { label: "Conteúdos", value: totalContents ?? 0, icon: FileText, color: "text-[#0F172A]", bg: "bg-[#F1F5F9]", sub: "gerados no total" },
    { label: "Leads ativos", value: leadsCount ?? 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50", sub: "em negociação" },
  ]

  const quickActions = [
    { href: "/conteudo", label: "Gerar Conteúdo", icon: FileText, description: "Posts, reels, legendas" },
    { href: "/whatsapp", label: "Script WhatsApp", icon: MessageCircle, description: "Mensagens de vendas" },
    { href: "/campanha", label: "Criar Campanha", icon: Zap, description: "Campanha expressa" },
    { href: "/funil", label: "Adicionar Lead", icon: Users, description: "Funil de vendas" },
  ]

  return (
    <div>
      <Topbar title="Dashboard" subtitle={`Bem-vindo de volta, ${firstName}`} />
      <div className="p-4 md:p-6 space-y-6">

        {/* Welcome + Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#16A34A]/10 rounded-full -translate-y-16 translate-x-16" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full translate-y-10 -translate-x-10" />
            <div className="relative">
              <p className="text-[#94A3B8] text-sm mb-1">Olá, {firstName} 👋</p>
              <h2 className="text-2xl font-bold mb-2">Pronto para gerar resultados?</h2>
              <p className="text-[#94A3B8] text-sm mb-4">Crie conteúdo de alta conversão com IA em segundos.</p>
              <Link href="/conteudo">
                <Button variant="secondary" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" /> Gerar conteúdo agora
                </Button>
              </Link>
            </div>
          </div>
          <UsageCard used={generationsUsed ?? 0} limit={generationsLimit} plan={plan} resetDate={resetDate} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[#64748B] text-xs mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-[#0F172A]">{stat.value}</p>
                      <p className="text-[#94A3B8] text-xs mt-0.5">{stat.sub}</p>
                    </div>
                    <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#16A34A]" />
              Ações rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.href} href={action.href}>
                    <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#E2E8F0] hover:border-[#16A34A] hover:bg-[#F0FDF4] transition-all cursor-pointer group">
                      <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] group-hover:bg-[#DCFCE7] flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5 text-[#0F172A] group-hover:text-[#16A34A]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[#0F172A] text-xs font-medium">{action.label}</p>
                        <p className="text-[#94A3B8] text-xs hidden sm:block">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Generations */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#64748B]" />
                  Gerações recentes
                </CardTitle>
                <Link href="/historico">
                  <Button variant="ghost" size="sm" className="text-xs h-7">Ver todos</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {!recentContents?.length ? (
                <div className="text-center py-8">
                  <FileText className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
                  <p className="text-[#94A3B8] text-sm">Nenhum conteúdo gerado ainda</p>
                  <Link href="/conteudo">
                    <Button variant="secondary" size="sm" className="mt-3">Criar primeiro</Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-2">
                  {recentContents.map((content) => (
                    <li key={content.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#F8FAFC] transition-colors">
                      <div className="w-8 h-8 rounded-md bg-[#F1F5F9] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-3.5 h-3.5 text-[#64748B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[#0F172A] text-sm font-medium truncate">
                            {content.title ?? content.content.substring(0, 40) + "…"}
                          </p>
                          <Badge variant={CONTENT_VARIANT[content.type] ?? "default"} className="flex-shrink-0">
                            {CONTENT_LABEL[content.type] ?? content.type}
                          </Badge>
                        </div>
                        <p className="text-[#94A3B8] text-xs">
                          {formatDistanceToNow(new Date(content.created_at), { addSuffix: true, locale: ptBR })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Pending Followups */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#F59E0B]" />
                  Followups pendentes
                </CardTitle>
                <Link href="/funil">
                  <Button variant="ghost" size="sm" className="text-xs h-7">Ver funil</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {!pendingFollowups?.length ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-8 h-8 text-[#CBD5E1] mx-auto mb-2" />
                  <p className="text-[#94A3B8] text-sm">Nenhum followup pendente</p>
                  <p className="text-[#CBD5E1] text-xs mt-1">Tudo em dia! 🎉</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {pendingFollowups.map((followup) => (
                    <li key={followup.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#F8FAFC] transition-colors">
                      <div className="w-8 h-8 rounded-md bg-[#FEF3C7] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#0F172A] text-sm font-medium truncate">
                          {(followup.leads as { name: string } | null)?.name ?? "Lead"}
                        </p>
                        <p className="text-[#64748B] text-xs truncate">{followup.content ?? followup.type}</p>
                        <p className="text-[#94A3B8] text-xs">
                          {followup.scheduled_at
                            ? formatDistanceToNow(new Date(followup.scheduled_at), { addSuffix: true, locale: ptBR })
                            : "Hoje"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Card */}
        <Card className="border-[#E2E8F0] bg-gradient-to-r from-[#F0FDF4] to-[#FEFCE8]">
          <CardContent className="p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#16A34A] flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[#0F172A] font-semibold text-sm mb-1">💡 Dica do dia</p>
              <p className="text-[#64748B] text-sm">
                Use o <strong>Script WhatsApp</strong> para criar mensagens personalizadas para cada etapa do funil.
                Leads contatados no mesmo dia têm <strong>3× mais chance de conversão</strong>.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
