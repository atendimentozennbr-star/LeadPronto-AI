import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"

// ── helpers ─────────────────────────────────────────────────────────────────

function buildPrompt(module: string, data: Record<string, string>): { prompt: string; maxTokens: number } {
  switch (module) {
    case "content": {
      const typeLabels: Record<string, string> = {
        instagram_post: "Post para Instagram",
        reels_script: "Roteiro de Reels",
        stories_cta: "Stories com CTA",
        short_ad: "Anúncio Curto",
        landing_text: "Texto para Landing Page",
        offer_title: "Título de Oferta",
      }
      const label = typeLabels[data.content_type] ?? data.content_type
      return {
        prompt: `Você é um especialista em copywriting e marketing digital no Brasil.
Crie 3 variações de "${label}" de alta conversão para a oferta abaixo.
TOM DE VOZ: ${data.voice_tone}
OFERTA: ${data.offer}

Responda APENAS com um JSON válido (sem markdown):
{"result": ["variação 1 completa", "variação 2 completa", "variação 3 completa"]}`,
        maxTokens: 800,
      }
    }
    case "whatsapp": {
      const typeLabels: Record<string, string> = {
        first_contact: "Primeiro Contato",
        cold_lead: "Lead Frio",
        undecided_lead: "Lead Indeciso",
        followup_1d: "Follow-up após 1 dia",
        followup_3d: "Follow-up após 3 dias",
        followup_7d: "Follow-up após 7 dias",
        break_objection: "Quebra de Objeção",
        close_urgency: "Fechamento com Urgência",
        recover_lead: "Recuperar Lead Parado",
      }
      const label = typeLabels[data.message_type] ?? data.message_type
      return {
        prompt: `Você é um especialista em vendas pelo WhatsApp no Brasil.
Crie 3 mensagens de "${label}" naturais e persuasivas para o contexto abaixo.
CONTEXTO: ${data.context}

Responda APENAS com um JSON válido (sem markdown):
{"result": ["mensagem 1", "mensagem 2", "mensagem 3"]}`,
        maxTokens: 700,
      }
    }
    case "campaign": {
      const objectiveLabels: Record<string, string> = {
        sell_service: "Vender Serviço",
        capture_leads: "Captar Leads",
        promote_offer: "Divulgar Promoção",
        launch_product: "Lançar Produto",
        fill_schedule: "Encher Agenda",
      }
      const label = objectiveLabels[data.objective] ?? data.objective
      return {
        prompt: `Você é um estrategista de marketing digital no Brasil.
Crie uma campanha completa para o objetivo "${label}" com base na oferta abaixo.
OFERTA: ${data.offer}

Responda APENAS com um JSON válido (sem markdown):
{
  "result": {
    "headline": "headline principal de impacto",
    "copies": ["copy 1", "copy 2", "copy 3"],
    "ctas": ["cta 1", "cta 2", "cta 3", "cta 4", "cta 5"],
    "direct_messages": ["mensagem 1", "mensagem 2", "mensagem 3"],
    "followups": ["followup 1", "followup 2", "followup 3"],
    "content_ideas": ["ideia 1", "ideia 2", "ideia 3", "ideia 4", "ideia 5", "ideia 6", "ideia 7"],
    "video_script": "script completo do vídeo curto"
  }
}`,
        maxTokens: 1500,
      }
    }
    case "offer_dna": {
      return {
        prompt: `Você é um especialista em posicionamento de ofertas e copywriting no Brasil.
Analise a oferta abaixo e retorne sua estrutura completa de DNA.
PRODUTO/SERVIÇO: ${data.product}
PÚBLICO-ALVO: ${data.target}
PRINCIPAL DOR: ${data.pain ?? "não informado"}
TRANSFORMAÇÃO PROMETIDA: ${data.transformation ?? "não informado"}
PREÇO: ${data.price ?? "não informado"}
DIFERENCIAIS: ${data.differentials ?? "não informado"}

Responda APENAS com um JSON válido (sem markdown):
{
  "result": {
    "value_proposition": "proposta de valor em 1-2 frases",
    "headline": "headline principal",
    "main_promise": "promessa principal da oferta",
    "benefits": ["benefício 1", "benefício 2", "benefício 3", "benefício 4", "benefício 5"],
    "differentials": ["diferencial 1", "diferencial 2", "diferencial 3"],
    "main_cta": "call-to-action principal",
    "objections": ["objeção 1", "objeção 2", "objeção 3"],
    "sales_angles": ["ângulo 1", "ângulo 2", "ângulo 3"]
  }
}`,
        maxTokens: 1200,
      }
    }
    default:
      return { prompt: "", maxTokens: 0 }
  }
}

function getMockResult(module: string, data: Record<string, string>): unknown {
  switch (module) {
    case "content":
      return {
        result: [
          `✨ ${data.offer ?? "Sua oferta"} — resultados reais para quem quer crescer. Acesse o link na bio e comece hoje!`,
          `🚀 Chega de perder tempo sem resultado. ${data.offer ?? "Nossa solução"} transforma o seu negócio em semanas. Clique e saiba mais!`,
          `💡 Você merece uma solução que funciona. ${data.offer ?? "Conheça nossa oferta"} e veja a diferença. Link na bio!`,
        ],
      }
    case "whatsapp":
      return {
        result: [
          `Olá! Vi que você demonstrou interesse. Posso te contar mais sobre como ${data.context ?? "nossa solução"} pode te ajudar?`,
          `Oi! Queria entender melhor o que você busca para te indicar a melhor opção. Tem um minutinho?`,
          `Olá! Só passando para verificar se ficou alguma dúvida. Estou à disposição para te ajudar 😊`,
        ],
      }
    case "campaign":
      return {
        result: {
          headline: `A solução que seu negócio precisava`,
          copies: [
            `Transforme seus resultados com nossa oferta exclusiva. Acesse agora!`,
            `Pare de deixar dinheiro na mesa. Nossa solução resolve isso hoje.`,
            `Resultado garantido ou seu dinheiro de volta. Simples assim.`,
          ],
          ctas: ["Quero começar agora", "Falar com especialista", "Ver demonstração", "Acessar oferta", "Garantir minha vaga"],
          direct_messages: [
            `Olá! Vi que você pode se interessar pela nossa oferta. Posso te contar mais?`,
            `Oi! Temos uma condição especial disponível por tempo limitado. Quer saber mais?`,
            `Olá! Estou aqui para tirar suas dúvidas e te mostrar como podemos te ajudar.`,
          ],
          followups: [
            `Oi! Só passando para verificar se recebeu as informações. Alguma dúvida?`,
            `Olá! Queria saber se conseguiu analisar nossa proposta. Podemos conversar?`,
            `Oi! Última chance de aproveitar a condição especial que separei para você.`,
          ],
          content_ideas: [
            "Bastidores do processo de transformação do cliente",
            "Antes e depois: resultado real de quem já usou",
            "3 erros que impedem seu crescimento (e como evitar)",
            "Como funciona nossa metodologia em 60 segundos",
            "Depoimento espontâneo de cliente satisfeito",
            "Dúvida frequente respondida em formato de vídeo",
            "Oferta com urgência e escassez real",
          ],
          video_script: `[GANCHO] Você sabia que a maioria das pessoas comete um erro fatal nessa área?\n[DESENVOLVIMENTO] O problema é que sem a estratégia certa, você continua rodando em círculos...\n[SOLUÇÃO] Por isso criamos essa solução que já transformou a vida de centenas de pessoas.\n[CTA] Clique no link da bio e garanta sua vaga agora!`,
        },
      }
    case "offer_dna":
      return {
        result: {
          value_proposition: `Transformamos ${data.target ?? "seu público"} através de ${data.product ?? "nossa solução"} com resultados comprovados.`,
          headline: `A transformação que ${data.target ?? "você"} sempre quis`,
          main_promise: `Em 30 dias, você terá resultados concretos ou devolvemos seu investimento.`,
          benefits: [
            "Economia de tempo e esforço",
            "Resultados mensuráveis e concretos",
            "Suporte especializado durante todo o processo",
            "Metodologia comprovada e testada",
            "Acesso a conteúdo exclusivo",
          ],
          differentials: [
            "Atendimento personalizado e humano",
            "Garantia incondicional de resultados",
            "Comunidade ativa de clientes",
          ],
          main_cta: `Quero começar minha transformação agora`,
          objections: [
            "Preço acima do que esperava",
            "Não tenho tempo suficiente",
            "Já tentei outras soluções antes",
          ],
          sales_angles: [
            "Ângulo da dor: foque no problema que o público quer resolver",
            "Ângulo da transformação: mostre o antes e depois",
            "Ângulo da urgência: por que agir agora é melhor que esperar",
          ],
        },
      }
    default:
      return {}
  }
}

// ── legacy onboarding handler ────────────────────────────────────────────────

async function handleOnboarding(
  body: Record<string, string>,
  openai: OpenAI | null,
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<NextResponse> {
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

  const painText = mainPain?.toLowerCase() ?? "sua principal dor"
  const mockFallback = {
    headline: `${brandName}: a solução que seu negócio precisava`,
    postIdea: `Você sabia que ${painText}? Por isso criamos ${productDescription.substring(0, 60)}... Clique no link da bio e saiba mais!`,
    whatsappMessage: `Olá! Vi que você pode estar passando por ${painText}. Temos a solução ideal para você. Posso te contar mais?`,
    cta: `Comece hoje e transforme seu negócio →`,
  }

  if (!openai) return NextResponse.json(mockFallback)

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
    generated = mockFallback
  }

  const { data: workspace } = await supabase.from("workspaces").select("id").eq("owner_id", userId).single()
  if (workspace) {
    await supabase.from("usage_logs").insert({
      workspace_id: workspace.id,
      user_id: userId,
      feature: "content",
      tokens_used: completion.usage?.total_tokens ?? 0,
      model: "gpt-4o-mini",
      metadata: { source: "onboarding" },
    })
  }

  return NextResponse.json(generated)
}

// ── main handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

  const body: Record<string, unknown> = await request.json()
  const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null

  // Detect request type: module-based vs legacy onboarding
  const module = typeof body.module === "string" ? body.module : null
  const data = (body.data && typeof body.data === "object" ? body.data : {}) as Record<string, string>

  // Legacy onboarding format (flat body with brandName)
  if (!module) {
    return handleOnboarding(body as Record<string, string>, openai, supabase, user.id)
  }

  // Module-based format
  const { prompt, maxTokens } = buildPrompt(module, data)
  if (!prompt) {
    return NextResponse.json({ error: "Módulo desconhecido" }, { status: 400 })
  }

  let result: unknown
  if (!openai) {
    result = getMockResult(module, data)
  } else {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: maxTokens,
    })

    const raw = completion.choices[0]?.message?.content ?? "{}"
    try {
      result = JSON.parse(raw)
    } catch {
      result = getMockResult(module, data)
    }

    // Log usage
    const { data: workspace } = await supabase.from("workspaces").select("id").eq("owner_id", user.id).single()
    if (workspace) {
      await supabase.from("usage_logs").insert({
        workspace_id: workspace.id,
        user_id: user.id,
        feature: module,
        tokens_used: completion.usage?.total_tokens ?? 0,
        model: "gpt-4o-mini",
        metadata: { source: module },
      })
    }
  }

  return NextResponse.json(result)
}
