"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles, ChevronRight, ChevronLeft, CheckCircle2,
  Copy, ArrowRight, Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── helpers ──────────────────────────────────────────────────────────────────

const NICHES = [
  { value: "digital", label: "Marketing Digital" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "servicos", label: "Serviços" },
  { value: "infoprodutos", label: "Infoprodutos" },
  { value: "coaching", label: "Coaching" },
  { value: "consultoria", label: "Consultoria" },
  { value: "saude", label: "Saúde & Bem-estar" },
  { value: "outros", label: "Outros" },
]

const CHANNELS = [
  { value: "instagram", label: "Instagram DM" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "site", label: "Site / Landing Page" },
  { value: "todos", label: "Todos os canais" },
]

const TONES = [
  { value: "direto", label: "Direto", desc: "Objetivo e sem rodeios" },
  { value: "premium", label: "Premium", desc: "Sofisticado e exclusivo" },
  { value: "emocional", label: "Emocional", desc: "Conexão e sentimentos" },
  { value: "tecnico", label: "Técnico", desc: "Dados e autoridade" },
  { value: "agressivo", label: "Agressivo", desc: "Urgência e impacto" },
  { value: "amigavel", label: "Amigável", desc: "Próximo e acolhedor" },
]

const OBJECTIVES = [
  { value: "gerar_leads", label: "🎯 Gerar Leads", desc: "Atrair novos contatos" },
  { value: "fechar_vendas", label: "💰 Fechar Vendas", desc: "Converter em clientes" },
  { value: "engajar", label: "📣 Engajar Audiência", desc: "Aumentar interação" },
  { value: "educar", label: "📚 Educar Mercado", desc: "Construir autoridade" },
]

// Map display tone → valid DB enum
const TONE_DB_MAP: Record<string, string> = {
  direto: "informal",
  premium: "formal",
  emocional: "inspiracional",
  tecnico: "técnico",
  agressivo: "informal",
  amigavel: "informal",
}

// ── types ─────────────────────────────────────────────────────────────────────

interface FormData {
  brandName: string
  niche: string
  productDescription: string
  salesChannels: string[]
  targetAudience: string
  mainPain: string
  toneOfVoice: string
  avgTicket: string
  mainObjective: string
}

interface GeneratedContent {
  headline: string
  postIdea: string
  whatsappMessage: string
  cta: string
}

// ── component ─────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [generated, setGenerated] = useState<GeneratedContent | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const [form, setForm] = useState<FormData>({
    brandName: "",
    niche: "",
    productDescription: "",
    salesChannels: [],
    targetAudience: "",
    mainPain: "",
    toneOfVoice: "",
    avgTicket: "",
    mainObjective: "",
  })

  const set = (field: keyof FormData, value: string | string[]) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const toggleChannel = (value: string) => {
    if (value === "todos") {
      set("salesChannels", form.salesChannels.includes("todos") ? [] : ["todos"])
      return
    }
    const updated = form.salesChannels.filter((c) => c !== "todos")
    set("salesChannels", updated.includes(value) ? updated.filter((c) => c !== value) : [...updated, value])
  }

  const canProceed = () => {
    if (step === 1) return form.brandName.trim().length >= 2 && form.niche !== ""
    if (step === 2) return form.productDescription.trim().length >= 10 && form.salesChannels.length > 0
    if (step === 3) return form.targetAudience.trim().length >= 5 && form.mainPain.trim().length >= 5
    if (step === 4) return form.toneOfVoice !== ""
    if (step === 5) return form.mainObjective !== ""
    return false
  }

  const handleFinish = async () => {
    setSaving(true)
    setError("")
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Sessão expirada")

      // Ensure workspace exists
      let workspaceId: string
      const { data: existing } = await supabase
        .from("workspaces")
        .select("id")
        .eq("owner_id", user.id)
        .single()

      if (existing) {
        workspaceId = existing.id
      } else {
        const slug = form.brandName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").slice(0, 40)
          + "-" + user.id.slice(0, 8)
        const { data: newWs, error: wsErr } = await supabase
          .from("workspaces")
          .insert({ name: form.brandName, slug, owner_id: user.id })
          .select("id")
          .single()
        if (wsErr) throw wsErr
        workspaceId = newWs!.id
      }

      // Save brand
      const { error: brandErr } = await supabase.from("brands").insert({
        workspace_id: workspaceId,
        name: form.brandName,
        segment: form.niche,
        target_audience: form.targetAudience,
        pain_points: [form.mainPain],
        tone_of_voice: TONE_DB_MAP[form.toneOfVoice] ?? "informal",
        extra_context: JSON.stringify({
          productDescription: form.productDescription,
          salesChannels: form.salesChannels,
          toneOfVoice: form.toneOfVoice,
          avgTicket: form.avgTicket,
          mainObjective: form.mainObjective,
        }),
      })
      if (brandErr) throw brandErr

      // Mark onboarded
      await supabase.from("profiles").update({ onboarded: true }).eq("id", user.id)

      // Generate initial content via API
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: form.brandName,
          niche: form.niche,
          productDescription: form.productDescription,
          targetAudience: form.targetAudience,
          mainPain: form.mainPain,
          toneOfVoice: form.toneOfVoice,
          mainObjective: form.mainObjective,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Erro ao gerar conteúdo")
      setGenerated(json)
      setStep(6)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Algo deu errado, tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const progressPercent = step <= 5 ? ((step - 1) / 5) * 100 : 100

  // ── Wow Moment (step 6) ───────────────────────────────────────────────────
  if (step === 6 && generated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#16A34A] mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Sua IA está pronta! 🚀</h1>
            <p className="text-[#94A3B8]">Criamos seu primeiro conteúdo personalizado para <strong className="text-white">{form.brandName}</strong></p>
          </div>

          <div className="space-y-3">
            {[
              { key: "headline", label: "🎯 Headline de impacto", text: generated.headline },
              { key: "postIdea", label: "📱 Ideia de post", text: generated.postIdea },
              { key: "whatsappMessage", label: "💬 Mensagem WhatsApp", text: generated.whatsappMessage },
              { key: "cta", label: "⚡ Call-to-Action", text: generated.cta },
            ].map(({ key, label, text }) => (
              <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wide">{label}</span>
                  <button
                    onClick={() => copyText(text, key)}
                    className="flex items-center gap-1 text-xs text-[#64748B] hover:text-white transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copied === key ? "Copiado!" : "Copiar"}
                  </button>
                </div>
                <p className="text-white text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="w-full gap-2 text-base"
            onClick={() => router.push("/dashboard")}
          >
            Ir para o Dashboard <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    )
  }

  // ── Form steps 1–5 ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#0F172A]">LeadPronto AI</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-1">Configure sua conta</h1>
          <p className="text-[#64748B] text-sm">Passo {step} de 5 — leva menos de 2 minutos</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progressPercent} indicatorClassName="bg-[#16A34A]" />
          <div className="flex justify-between mt-2">
            {["Marca", "Produto", "Público", "Tom", "Objetivo"].map((label, i) => (
              <span
                key={label}
                className={cn("text-xs", step > i + 1 ? "text-[#16A34A] font-medium" : step === i + 1 ? "text-[#0F172A] font-medium" : "text-[#CBD5E1]")}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-5">

            {/* Step 1 */}
            {step === 1 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Bem-vindo! Fale sobre sua marca 👋</h2>
                  <p className="text-[#64748B] text-sm">Essas informações ajudam a IA a criar conteúdo personalizado.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Nome da marca *</label>
                    <Input
                      placeholder="Ex: Clínica Bella, Agência Alfa..."
                      value={form.brandName}
                      onChange={(e) => set("brandName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-2">Nicho de mercado *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {NICHES.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => set("niche", value)}
                          className={cn(
                            "px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left",
                            form.niche === value
                              ? "border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]"
                              : "border-[#E2E8F0] text-[#64748B] hover:border-[#16A34A]/50"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Seu produto ou serviço 📦</h2>
                  <p className="text-[#64748B] text-sm">Conte como você ajuda seus clientes.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Descreva seu produto/serviço *</label>
                    <textarea
                      className="flex min-h-[100px] w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A] focus-visible:ring-offset-2 resize-y"
                      placeholder="Ex: Ofereço consultoria de marketing digital para pequenas empresas que querem crescer online..."
                      value={form.productDescription}
                      onChange={(e) => set("productDescription", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-2">Canal de vendas principal *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CHANNELS.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleChannel(value)}
                          className={cn(
                            "px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left",
                            form.salesChannels.includes(value)
                              ? "border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]"
                              : "border-[#E2E8F0] text-[#64748B] hover:border-[#16A34A]/50"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Quem é seu cliente ideal? 🎯</h2>
                  <p className="text-[#64748B] text-sm">Quanto mais específico, melhor o conteúdo gerado.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Público-alvo *</label>
                    <Input
                      placeholder="Ex: Mulheres de 30-45 anos, donas de pequenos negócios..."
                      value={form.targetAudience}
                      onChange={(e) => set("targetAudience", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Principal dor ou problema que você resolve *</label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#0F172A] placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A] focus-visible:ring-offset-2 resize-y"
                      placeholder="Ex: Não conseguem atrair clientes online e perdem vendas para a concorrência..."
                      value={form.mainPain}
                      onChange={(e) => set("mainPain", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Tom de voz da sua marca 🗣️</h2>
                  <p className="text-[#64748B] text-sm">Como sua marca se comunica com o público?</p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {TONES.map(({ value, label, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set("toneOfVoice", value)}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all",
                          form.toneOfVoice === value
                            ? "border-[#16A34A] bg-[#F0FDF4]"
                            : "border-[#E2E8F0] hover:border-[#16A34A]/50"
                        )}
                      >
                        <p className={cn("text-sm font-semibold", form.toneOfVoice === value ? "text-[#16A34A]" : "text-[#0F172A]")}>{label}</p>
                        <p className="text-[#94A3B8] text-xs mt-0.5">{desc}</p>
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Ticket médio (opcional)</label>
                    <Input
                      placeholder="Ex: R$ 297, R$ 2.000, R$ 10.000..."
                      value={form.avgTicket}
                      onChange={(e) => set("avgTicket", e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Qual é o seu objetivo principal? 🚀</h2>
                  <p className="text-[#64748B] text-sm">Isso define a estratégia de todo o seu conteúdo.</p>
                </div>
                <div className="space-y-2">
                  {OBJECTIVES.map(({ value, label, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => set("mainObjective", value)}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3",
                        form.mainObjective === value
                          ? "border-[#16A34A] bg-[#F0FDF4]"
                          : "border-[#E2E8F0] hover:border-[#16A34A]/50"
                      )}
                    >
                      <div className="flex-1">
                        <p className={cn("text-sm font-semibold", form.mainObjective === value ? "text-[#16A34A]" : "text-[#0F172A]")}>{label}</p>
                        <p className="text-[#94A3B8] text-xs mt-0.5">{desc}</p>
                      </div>
                      {form.mainObjective === value && (
                        <CheckCircle2 className="w-5 h-5 text-[#16A34A] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[#FEF3C7] border border-[#FDE68A]">
                  <Sparkles className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                  <p className="text-[#92400E] text-xs">A IA vai gerar seu primeiro conteúdo personalizado ao finalizar!</p>
                </div>
              </>
            )}

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-3 pt-2">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={saving}
                  className="gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
              )}
              <Button
                variant="secondary"
                className="flex-1 gap-1.5"
                disabled={!canProceed() || saving}
                onClick={() => {
                  if (step < 5) setStep((s) => s + 1)
                  else handleFinish()
                }}
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Gerando…</>
                ) : step < 5 ? (
                  <>Continuar <ChevronRight className="w-4 h-4" /></>
                ) : (
                  <>Finalizar e gerar insights <Sparkles className="w-4 h-4" /></>
                )}
              </Button>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    s === step ? "w-6 bg-[#16A34A]" : s < step ? "w-3 bg-[#16A34A]/40" : "w-3 bg-[#E2E8F0]"
                  )}
                />
              ))}
            </div>

          </CardContent>
        </Card>

        <p className="text-center text-[#94A3B8] text-xs mt-4">
          Seus dados são usados exclusivamente para personalizar seu conteúdo.
        </p>
      </div>
    </div>
  )
}
