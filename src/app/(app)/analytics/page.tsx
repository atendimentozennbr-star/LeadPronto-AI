"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, FileText, MessageSquare, Zap, Star, AlertCircle } from "lucide-react";

const MOCK_STATS = {
  totalGenerations: 28,
  generationsLimit: 40,
  favorites: 7,
  pendingFollowups: 3,
  topModules: [
    { module: "Conteúdo Instagram", count: 10, icon: "📸" },
    { module: "WhatsApp - 1° Contato", count: 7, icon: "💬" },
    { module: "Campanha Expressa", count: 5, icon: "🚀" },
    { module: "Oferta DNA", count: 4, icon: "🧬" },
    { module: "Follow-up 3 dias", count: 2, icon: "📅" },
  ],
  topCTAs: [
    "Agende sua consulta gratuita",
    "Quero começar agora",
    "Falar com especialista",
    "Ver demonstração",
  ],
  topObjections: [
    "Preço muito alto",
    "Preciso pensar mais",
    "Não tenho tempo agora",
    "Vou decidir semana que vem",
  ],
  weeklySummary: [
    { day: "Seg", count: 6 },
    { day: "Ter", count: 4 },
    { day: "Qua", count: 8 },
    { day: "Qui", count: 3 },
    { day: "Sex", count: 5 },
    { day: "Sáb", count: 2 },
    { day: "Dom", count: 0 },
  ],
};

export default function AnalyticsPage() {
  const usagePercent = Math.round((MOCK_STATS.totalGenerations / MOCK_STATS.generationsLimit) * 100);
  const maxDay = Math.max(...MOCK_STATS.weeklySummary.map((d) => d.count));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Acompanhe seu uso e descubra o que está funcionando.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{MOCK_STATS.totalGenerations}</p>
                <p className="text-xs text-slate-500">Gerações este mês</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{MOCK_STATS.favorites}</p>
                <p className="text-xs text-slate-500">Favoritos salvos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{usagePercent}%</p>
                <p className="text-xs text-slate-500">Plano utilizado</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{MOCK_STATS.pendingFollowups}</p>
                <p className="text-xs text-slate-500">Follow-ups pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Atividade da semana</CardTitle>
          <CardDescription>Gerações por dia nos últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-32">
            {MOCK_STATS.weeklySummary.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-slate-600">{day.count}</span>
                <div
                  className="w-full rounded-t-md bg-green-500 min-h-[4px] transition-all"
                  style={{ height: `${maxDay > 0 ? (day.count / maxDay) * 80 : 4}px` }}
                />
                <span className="text-xs text-slate-400">{day.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Módulos mais usados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_STATS.topModules.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{item.module}</span>
                      <span className="text-sm font-bold text-green-600">{item.count}x</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full">
                      <div
                        className="h-1.5 bg-green-500 rounded-full"
                        style={{ width: `${(item.count / MOCK_STATS.topModules[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top CTAs & Objections */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                CTAs mais usados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MOCK_STATS.topCTAs.map((cta, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                    <Badge variant="secondary" className="text-xs font-normal flex-1 justify-start truncate">
                      {cta}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-red-500" />
                Objeções frequentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MOCK_STATS.topObjections.map((obj, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                    <Badge variant="outline" className="text-xs font-normal flex-1 justify-start border-red-200 text-red-600 truncate">
                      {obj}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Uso do plano</CardTitle>
          <CardDescription>
            {MOCK_STATS.totalGenerations} de {MOCK_STATS.generationsLimit} gerações utilizadas neste mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">{MOCK_STATS.totalGenerations} usadas</span>
              <span className="text-slate-400">{MOCK_STATS.generationsLimit - MOCK_STATS.totalGenerations} restantes</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${usagePercent > 80 ? "bg-red-500" : usagePercent > 60 ? "bg-amber-500" : "bg-green-500"}`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">{usagePercent}% do plano Básico utilizado</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
