import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

// ---------- helpers ----------

function safeParseJSON(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch (err) {
    console.error("[generate] Failed to parse AI response:", err, "raw:", raw)
    return null
  }
}

// ---------- module handlers ----------

function buildContentPrompt(data: Record<string, string>): string {
  const { content_type, voice_tone, offer } = data
  return `Você é um especialista em copywriting e marketing digital no Brasil.
Crie 3 variações de ${content_type ?? "post para Instagram"} com tom de voz "${voice_tone ?? "direto"}" para a oferta abaixo.

OFERTA: ${offer}

Responda APENAS com um JSON válido neste formato exato (sem markdown):
{"result": ["variação 1 completa", "variação 2 completa", "variação 3 completa"]}`
}

function buildWhatsAppPrompt(data: Record<string, string>): string {
  const { message_type, context } = data
  return `Você é um especialista em vendas pelo WhatsApp no Brasil.
Crie 3 mensagens do tipo "${message_type ?? "primeiro contato"}" para o contexto abaixo.
As mensagens devem ser naturais, persuasivas e prontas para enviar.

CONTEXTO: ${context}

Responda APENAS com um JSON válido neste formato exato (sem markdown):
{"result": ["mensagem 1", "mensagem 2", "mensagem 3"]}`
}

function buildCampaignPrompt(data: Record<string, string>): string {
  const { objective, offer } = data
  return `Você é um estrategista de marketing digital no Brasil.
Crie uma campanha completa de vendas para o objetivo "${objective ?? "vender serviço"}" e a oferta abaixo.

OFERTA: ${offer}

Responda APENAS com um JSON válido neste formato exato (sem markdown):
{
  "result": {
    "headline": "headline principal de impacto",
    "copies": ["copy 1", "copy 2", "copy 3"],
    "ctas": ["cta 1", "cta 2", "cta 3", "cta 4", "cta 5"],
    "direct_messages": ["mensagem 1", "mensagem 2", "mensagem 3"],
    "followups": ["followup 1", "followup 2", "followup 3"],
    "content_ideas": ["ideia 1", "ideia 2", "ideia 3", "ideia 4", "ideia 5", "ideia 6", "ideia 7"],
    "video_script": "script completo de vídeo curto de 30-60 segundos"
  }
}`
}

function buildOfferDNAPrompt(data: Record<string, string>): string {
  const { product, target, pain, transformation, price, differentials } = data
  return `Você é um especialista em ofertas e copywriting no Brasil.
Crie o DNA completo da oferta abaixo.

PRODUTO/SERVIÇO: ${product}
PÚBLICO-ALVO: ${target}
PRINCIPAL DOR: ${pain ?? "não informado"}
TRANSFORMAÇÃO PROMETIDA: ${transformation ?? "não informado"}
PREÇO: ${price ?? "não informado"}
DIFERENCIAIS: ${differentials ?? "não informado"}

Responda APENAS com um JSON válido neste formato exato (sem markdown):
{
  "result": {
    "value_proposition": "proposta de valor em 1-2 frases",
    "headline": "headline principal de impacto",
    "main_promise": "promessa principal clara e específica",
    "benefits": ["benefício 1", "benefício 2", "benefício 3", "benefício 4", "benefício 5"],
    "differentials": ["diferencial 1", "diferencial 2", "diferencial 3"],
    "main_cta": "call-to-action principal",
    "objections": ["objeção 1", "objeção 2", "objeção 3", "objeção 4"],
    "sales_angles": ["ângulo 1", "ângulo 2", "ângulo 3", "ângulo 4"]
  }
}`
}

function buildOnboardingPrompt(data: Record<string, string>): string {
  const { brandName, niche, productDescription, targetAudience, mainPain, toneOfVoice, mainObjective } = data
  const objectiveLabels: Record<string, string> = {
    gerar_leads: "gerar leads",
    fechar_vendas: "fechar vendas",
    engajar: "engajar audiência",
    educar: "educar o mercado",
  }
  return `Você é um especialista em copywriting e marketing digital no Brasil.
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
}

// ---------- mock fallbacks ----------

function mockForModule(module: string, data: Record<string, string>): NextResponse {
  if (module === "content") {
    return NextResponse.json({
      result: [
        `[Exemplo] ${data.offer ?? "Sua oferta"} — descubra como isso pode transformar seu negócio. Clique no link da bio!`,
        `[Exemplo] Você sabia que a maioria das pessoas enfrenta esse problema? Nós resolvemos. Saiba mais!`,
        `[Exemplo] Resultados reais para pessoas reais. Comece hoje com ${data.offer?.substring(0, 40) ?? "nossa solução"}.`,
      ],
    })
  }
  if (module === "whatsapp") {
    return NextResponse.json({
      result: [
        `Olá! Tudo bem? Vi que você demonstrou interesse em ${data.context?.substring(0, 50) ?? "nosso serviço"}. Posso te contar mais?`,
        `Oi! Queria saber se você ainda tem interesse. Tenho uma oportunidade especial para você hoje!`,
        `Olá! Não quero te incomodar, mas preparei algo que pode fazer diferença para você. Tem 2 minutos?`,
      ],
    })
  }
  if (module === "campaign") {
    return NextResponse.json({
      result: {
        headline: `${data.offer?.substring(0, 50) ?? "Sua oferta"}: resultados em tempo recorde`,
        copies: ["Copy 1 de exemplo para sua campanha.", "Copy 2 de exemplo para sua campanha.", "Copy 3 de exemplo para sua campanha."],
        ctas: ["Quero começar agora", "Agendar conversa gratuita", "Ver demonstração", "Falar com especialista", "Garantir minha vaga"],
        direct_messages: ["Mensagem de direct 1.", "Mensagem de direct 2.", "Mensagem de direct 3."],
        followups: ["Follow-up 1 dia depois.", "Follow-up 3 dias depois.", "Follow-up 7 dias depois."],
        content_ideas: ["Ideia 1", "Ideia 2", "Ideia 3", "Ideia 4", "Ideia 5", "Ideia 6", "Ideia 7"],
        video_script: "GANCHO: Você está perdendo vendas por falta de estratégia?\nDESENVOLVIMENTO: Com nosso método você vai...\nCTA: Clique no link abaixo agora!",
      },
    })
  }
  if (module === "offer_dna") {
    return NextResponse.json({
      result: {
        value_proposition: `Ajudamos ${data.target ?? "empreendedores"} a alcançar ${data.transformation ?? "resultados extraordinários"} com ${data.product ?? "nossa solução"}.`,
        headline: `${data.product ?? "Nossa solução"}: a transformação que você esperava`,
        main_promise: `Em 30 dias você terá resultados claros ou devolvemos seu investimento.`,
        benefits: ["Economia de tempo", "Mais vendas", "Processo simplificado", "Suporte dedicado", "Resultados mensuráveis"],
        differentials: ["Metodologia exclusiva", "Atendimento personalizado", "Garantia de resultado"],
        main_cta: "Comece agora e transforme seu negócio →",
        objections: ["Preço alto", "Sem tempo", "Já tentei antes", "Não sei se funciona para mim"],
        sales_angles: ["Ângulo da dor", "Ângulo da transformação", "Ângulo social", "Ângulo da urgência"],
      },
    })
  }
  // onboarding fallback
  const painText = data.mainPain?.toLowerCase() ?? "sua principal dor"
  return NextResponse.json({
    headline: `${data.brandName ?? "Sua marca"}: a solução que seu negócio precisava`,
    postIdea: `Você sabia que ${painText}? Por isso criamos ${(data.productDescription ?? "").substring(0, 60)}... Clique no link da bio e saiba mais!`,
    whatsappMessage: `Olá! Vi que você pode estar passando por ${painText}. Temos a solução ideal para você. Posso te contar mais?`,
    cta: `Comece hoje e transforme seu negócio →`,
  })
}

// ---------- route handler ----------

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const body: unknown = await request.json()
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 })
  }
  const bodyObj = body as Record<string, unknown>
  const requestModule = typeof bodyObj.module === "string" ? bodyObj.module : undefined
  const data = bodyObj.data !== null && typeof bodyObj.data === "object" ? bodyObj.data as Record<string, string> : undefined

  // Determine which module to use (support legacy onboarding format)
  const activeModule = requestModule ?? "onboarding"
  const activeData: Record<string, string> = data ?? (bodyObj as Record<string, string>)

  if (!process.env.OPENAI_API_KEY) {
    return mockForModule(activeModule, activeData)
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  let prompt: string
  let maxTokens: number

  switch (activeModule) {
    case "content":
      if (!activeData.offer) return NextResponse.json({ error: "Dados insuficientes" }, { status: 400 })
      prompt = buildContentPrompt(activeData)
      maxTokens = 800
      break
    case "whatsapp":
      if (!activeData.context) return NextResponse.json({ error: "Dados insuficientes" }, { status: 400 })
      prompt = buildWhatsAppPrompt(activeData)
      maxTokens = 800
      break
    case "campaign":
      if (!activeData.offer) return NextResponse.json({ error: "Dados insuficientes" }, { status: 400 })
      prompt = buildCampaignPrompt(activeData)
      maxTokens = 2000
      break
    case "offer_dna":
      if (!activeData.product || !activeData.target) return NextResponse.json({ error: "Dados insuficientes" }, { status: 400 })
      prompt = buildOfferDNAPrompt(activeData)
      maxTokens = 1200
      break
    default:
      // legacy onboarding format
      if (!activeData.brandName || !activeData.productDescription) {
        return NextResponse.json({ error: "Dados insuficientes" }, { status: 400 })
      }
      prompt = buildOnboardingPrompt(activeData)
      maxTokens = 600
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: maxTokens,
  })

  const raw = completion.choices[0]?.message?.content ?? "{}"
  const parsed = safeParseJSON(raw)

  // Log usage
  const { data: workspace } = await supabase.from("workspaces").select("id").eq("owner_id", user.id).single()
  if (workspace) {
    await supabase.from("usage_logs").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      feature: activeModule,
      tokens_used: completion.usage?.total_tokens ?? 0,
      model: "gpt-4o-mini",
      metadata: { module: activeModule },
    })
  }

  if (!parsed) {
    return mockForModule(activeModule, activeData)
  }

  return NextResponse.json(parsed)
}
