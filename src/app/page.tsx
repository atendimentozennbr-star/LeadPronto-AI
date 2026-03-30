import Link from "next/link"
import {
  Zap,
  MessageCircle,
  Users,
  Clock,
  TrendingDown,
  Bell,
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  Image,
  Smartphone,
  Megaphone,
  GitBranch,
  BarChart3,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const painPoints = [
  {
    icon: Target,
    title: "Não sabe o que postar",
    desc: "Fica horas pensando e termina não postando nada.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp sem resposta",
    desc: "Manda mensagem e o cliente simplesmente some.",
  },
  {
    icon: Users,
    title: "Leads que somem",
    desc: "Interessados que não viram clientes por falta de follow-up.",
  },
  {
    icon: Clock,
    title: "Sem tempo para criar conteúdo",
    desc: "O dia acaba e você não publicou nada.",
  },
  {
    icon: TrendingDown,
    title: "Campanhas que não convertem",
    desc: "Gasta tempo e dinheiro em ações que não trazem resultado.",
  },
  {
    icon: Bell,
    title: "Perde vendas por falta de follow-up",
    desc: "Não tem um processo para nutrir e fechar leads.",
  },
]

const steps = [
  {
    number: "01",
    title: "Configure sua marca",
    desc: "Em apenas 1 minuto, informe seu nicho, público-alvo e tom de voz. A IA aprende sobre seu negócio.",
    time: "1 minuto",
  },
  {
    number: "02",
    title: "Escolha o que gerar",
    desc: "Posts para Instagram, scripts de WhatsApp, campanhas completas ou funis de venda. Você decide.",
    time: "10 segundos",
  },
  {
    number: "03",
    title: "Copie, envie e venda mais",
    desc: "Conteúdo pronto, personalizado para sua marca. Copie e publique imediatamente.",
    time: "Instantâneo",
  },
]

const modules = [
  {
    icon: Target,
    title: "Oferta DNA",
    desc: "Crie propostas irresistíveis que destacam o valor único do seu produto ou serviço.",
    color: "text-[#F59E0B]",
    bg: "bg-amber-50",
  },
  {
    icon: Image,
    title: "Conteúdo para Instagram",
    desc: "Legendas, carrosséis e reels roteirizados prontos para publicar e engajar.",
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    icon: Smartphone,
    title: "Scripts WhatsApp",
    desc: "Mensagens de abordagem, follow-up e fechamento que geram respostas.",
    color: "text-[#16A34A]",
    bg: "bg-green-50",
  },
  {
    icon: Megaphone,
    title: "Campanha Expressa",
    desc: "Campanhas completas de lançamento ou promoção em segundos.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: GitBranch,
    title: "Funil de Leads",
    desc: "Sequência automatizada de mensagens para converter leads em clientes.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Acompanhe o desempenho das suas gerações e otimize seus resultados.",
    color: "text-[#F59E0B]",
    bg: "bg-amber-50",
  },
]

const testimonials = [
  {
    name: "Ana Paula S.",
    role: "Coach de emagrecimento",
    content:
      "Em 3 dias usando o LeadPronto AI, fechei 2 clientes que estavam parados há semanas. Os scripts de WhatsApp são incríveis — parece que fui eu mesma que escrevi!",
    rating: 5,
  },
  {
    name: "Rodrigo M.",
    role: "Consultor financeiro",
    content:
      "Economizo pelo menos 4 horas por semana que gastava criando conteúdo. Agora posto todos os dias e minha autoridade no Instagram dobrou.",
    rating: 5,
  },
  {
    name: "Fernanda C.",
    role: "Loja de roupas online",
    content:
      "A Campanha Expressa me salvou! Fiz uma campanha de Black Friday em 15 minutos e tive o melhor resultado da história da minha loja.",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ── Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0F172A]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">LeadPronto AI</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#como-funciona" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                Como funciona
              </a>
              <a href="#planos" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                Planos
              </a>
              <Link href="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                Login
              </Link>
            </nav>

            <Link href="/register">
              <Button className="bg-[#F59E0B] hover:bg-amber-500 text-[#0F172A] font-semibold text-sm px-5 h-9 rounded-lg transition-all hover:scale-105">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] pt-16">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#16A34A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Badge className="mb-6 bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/30 hover:bg-[#16A34A]/20 text-xs font-semibold px-4 py-1.5 rounded-full">
            🚀 IA especializada em vendas para empreendedores
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-4xl mx-auto mb-6">
            Pare de perder vendas por{" "}
            <span className="text-[#F59E0B]">não saber o que postar</span>{" "}
            e como responder.
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            A plataforma de IA que gera seus posts, scripts de WhatsApp e campanhas completas em
            segundos — feita para empreendedores que <strong className="text-white">vendem de verdade.</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-[#F59E0B] hover:bg-amber-500 text-[#0F172A] font-bold text-base px-8 h-12 rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-105 hover:shadow-amber-500/40"
              >
                Começar grátis por 7 dias
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <a href="#como-funciona">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 font-semibold text-base px-8 h-12 rounded-xl transition-all"
              >
                Ver como funciona
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </a>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["bg-pink-400", "bg-blue-400", "bg-amber-400", "bg-green-400"].map((c, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-[#1E293B]`} />
                ))}
              </div>
              <span><strong className="text-white">500+</strong> empreendedores</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
              ))}
              <span className="ml-1"><strong className="text-white">98%</strong> de satisfação</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span><strong className="text-white">10x</strong> mais rápido</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-4">
              Você se identifica com algum desses problemas?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Se você respondeu sim para qualquer um deles, o LeadPronto AI foi feito para você.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {painPoints.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group p-6 rounded-2xl border border-red-100 bg-red-50/40 hover:bg-red-50 hover:border-red-200 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <Icon className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1.5">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution ── */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 hover:bg-[#16A34A]/10">
                A solução completa
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-6 leading-tight">
                O LeadPronto AI resolve{" "}
                <span className="text-[#16A34A]">tudo isso para você</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Nossa IA foi treinada especificamente para empreendedores brasileiros. Ela entende
                seu nicho, fala a língua do seu cliente e gera conteúdo que{" "}
                <strong>realmente converte.</strong>
              </p>
              <ul className="space-y-4">
                {[
                  "Conteúdo personalizado para sua marca em segundos",
                  "Scripts de WhatsApp que geram respostas imediatas",
                  "Campanhas completas do zero sem esforço",
                  "Follow-up automático que não deixa lead escapar",
                  "Analytics para saber o que funciona melhor",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Empreendedores ativos", value: "500+", color: "bg-[#0F172A] text-white" },
                { label: "Satisfação dos usuários", value: "98%", color: "bg-[#16A34A] text-white" },
                { label: "Mais rápido que escrever", value: "10×", color: "bg-[#F59E0B] text-[#0F172A]" },
                { label: "Gerações por mês", value: "50k+", color: "bg-white border border-slate-200 text-[#0F172A]" },
              ].map(({ label, value, color }) => (
                <div key={label} className={`rounded-2xl p-6 ${color} shadow-sm`}>
                  <div className="text-3xl font-extrabold mb-1">{value}</div>
                  <div className="text-sm opacity-80 leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-4">
              Como funciona em{" "}
              <span className="text-[#16A34A]">3 passos simples</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Do zero ao conteúdo pronto em menos de 2 minutos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#16A34A]/30 via-[#F59E0B]/30 to-[#16A34A]/30" />

            {steps.map(({ number, title, desc, time }, i) => (
              <div key={number} className="relative text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white font-extrabold text-xl mb-6 shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform">
                  {number}
                </div>
                <Badge className="mb-3 bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20 hover:bg-[#16A34A]/10 text-xs">
                  ⏱ {time}
                </Badge>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-10 w-8 h-8 text-slate-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules / Benefits ── */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-4">
              Tudo que você precisa para{" "}
              <span className="text-[#F59E0B]">vender mais</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              6 módulos de IA integrados, cada um especializado em uma etapa da sua venda.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(({ icon: Icon, title, desc, color, bg }) => (
              <Card
                key={title}
                className="border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all hover:-translate-y-1 bg-white group"
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  <CardTitle className="text-[#0F172A] text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-4">
              Quem usa, <span className="text-[#16A34A]">recomenda</span>
            </h2>
            <p className="text-slate-500 text-lg">Histórias reais de empreendedores que transformaram suas vendas.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map(({ name, role, content, rating }) => (
              <div
                key={name}
                className="p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic flex-1">"{content}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#16A34A] to-[#0F172A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0F172A] text-sm">{name}</div>
                    <div className="text-slate-400 text-xs">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="planos" className="py-24 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Planos simples,{" "}
              <span className="text-[#F59E0B]">resultado real</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Sem contrato. Cancele quando quiser. 7 dias grátis em qualquer plano.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Básico */}
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 hover:border-white/20 transition-all">
              <h3 className="text-white font-bold text-2xl mb-1">Básico</h3>
              <p className="text-slate-400 text-sm mb-6">Para quem está começando</p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-slate-400 text-sm">R$</span>
                <span className="text-white font-extrabold text-5xl">47</span>
                <span className="text-slate-400 text-sm mb-1">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["40 gerações por mês", "1 marca configurada", "Todos os 6 módulos", "Suporte por email", "7 dias grátis"].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full border-white/20 text-white bg-white/5 hover:bg-white/10 font-semibold h-12 rounded-xl">
                  Começar agora
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-[#F59E0B] bg-white/5 backdrop-blur p-8 hover:shadow-2xl hover:shadow-amber-500/10 transition-all">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#F59E0B] text-[#0F172A] font-bold px-4 py-1 text-xs rounded-full shadow-lg">
                  ⭐ Mais Popular
                </Badge>
              </div>
              <h3 className="text-white font-bold text-2xl mb-1">Pro</h3>
              <p className="text-slate-400 text-sm mb-6">Para quem quer resultados sérios</p>
              <div className="flex items-end gap-1 mb-8" aria-label="R$ 90,99 por mês">
                <span className="text-slate-400 text-sm" aria-hidden="true">R$</span>
                <span className="text-[#F59E0B] font-extrabold text-5xl" aria-hidden="true">90,99</span>
                <span className="text-slate-400 text-sm mb-2" aria-hidden="true">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "150 gerações por mês",
                  "3 marcas configuradas",
                  "Todos os 6 módulos",
                  "Prioridade no suporte",
                  "Analytics avançado",
                  "7 dias grátis",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full bg-[#F59E0B] hover:bg-amber-500 text-[#0F172A] font-bold h-12 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]">
                  Começar agora
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-[#16A34A]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
            Comece hoje e gere seu primeiro conteúdo em{" "}
            <span className="text-[#FDE68A]">5 minutos</span>
          </h2>
          <p className="text-green-100 text-lg mb-10">
            Sem cartão de crédito. Sem complicação. Só resultado.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white hover:bg-slate-100 text-[#16A34A] font-bold text-base px-10 h-14 rounded-xl shadow-xl transition-all hover:scale-105"
            >
              Começar grátis por 7 dias
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-green-200 text-sm mt-4">Mais de 500 empreendedores já começaram hoje</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0F172A] py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#16A34A] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold">LeadPronto AI</span>
            </div>

            <nav className="flex flex-wrap items-center gap-6 text-slate-400 text-sm">
              <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
              <a href="#planos" className="hover:text-white transition-colors">Planos</a>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              <Link href="/register" className="hover:text-white transition-colors">Cadastro</Link>
            </nav>

            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} LeadPronto AI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
