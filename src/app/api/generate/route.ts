import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const body = await request.json()
  const { brandName, niche, productDescription, targetAudience, mainPain, toneOfVoice, mainObjective } = body

  if (!brandName || !productDescription) {
    return NextResponse.json({ error: "Dados insuficientes" }, { status: 400 })
  }

  const objectiveLabels: Record<string, string> = {
    gerar_leads: "gerar leads",
    fechar_vendas: "fechar vendas",
    engajar: "engajar audiência",
    educar: "educar o mercado",
  }

  const prompt = `Você é um especialista em copywriting e marketing digital no Brasil.
Crie 4 peças de conteúdo de alta conversão para a marca abaixo.

MARCA: ${brandName}
NICHO: ${niche}
PRODUTO/SERVIÇO: ${productDescription}
PÚBLICO-ALVO: ${targetAudience}
PRINCIPAL DOR: ${mainPain}
TOM DE VOZ: ${toneOfVoice}
OBJETIVO: ${objectiveLabels[mainObjective] ?? mainObjective}

Responda APENAS com um JSON válido neste formato exato (sem markdown):
{
  "headline": "headline de impacto em até 15 palavras",
  "postIdea": "ideia completa de post para Instagram em 3-4 linhas com gancho, desenvolvimento e CTA",
  "whatsappMessage": "mensagem de abordagem no WhatsApp natural e persuasiva em 3-5 linhas",
  "cta": "call-to-action direto em até 10 palavras"
}`

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 600,
  })

  const raw = completion.choices[0]?.message?.content ?? "{}"
  let generated: Record<string, string>
  try {
    generated = JSON.parse(raw)
  } catch {
    generated = {
      headline: `${brandName}: a solução que seu negócio precisava`,
      postIdea: `Você sabia que ${mainPain?.toLowerCase()}? Por isso criamos ${productDescription?.substring(0, 60)}... Clique no link da bio e saiba mais!`,
      whatsappMessage: `Olá! Vi que você pode estar passando por ${mainPain?.toLowerCase()}. Temos a solução ideal para você. Posso te contar mais?`,
      cta: `Comece hoje e transforme seu negócio →`,
    }
  }

  // Log usage
  const { data: workspace } = await supabase.from("workspaces").select("id").eq("owner_id", user.id).single()
  if (workspace) {
    await supabase.from("usage_logs").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      feature: "content",
      tokens_used: completion.usage?.total_tokens ?? 0,
      model: "gpt-4o-mini",
      metadata: { source: "onboarding" },
    })
  }

  return NextResponse.json(generated)
}
