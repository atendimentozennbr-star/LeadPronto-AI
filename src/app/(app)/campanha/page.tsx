"use client";

import { useState } from "react";
import { Sparkles, Copy, Star, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const OBJECTIVES = [
  { id: "sell_service", label: "Vender Serviço", icon: "💼" },
  { id: "capture_leads", label: "Captar Leads", icon: "🎯" },
  { id: "promote_offer", label: "Divulgar Promoção", icon: "🏷️" },
  { id: "launch_product", label: "Lançar Produto", icon: "🚀" },
  { id: "fill_schedule", label: "Encher Agenda", icon: "📅" },
];

interface CampaignResult {
  headline: string;
  copies: string[];
  ctas: string[];
  direct_messages: string[];
  followups: string[];
  content_ideas: string[];
  video_script: string;
}

export default function CampanhaPage() {
  const [selectedObjective, setSelectedObjective] = useState("sell_service");
  const [offerDescription, setOfferDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [expanded, setExpanded] = useState<string | null>("copies");

  const handleGenerate = async () => {
    if (!offerDescription.trim()) {
      toast.error("Descreva sua oferta.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "campaign",
          data: { objective: selectedObjective, offer: offerDescription },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
      toast.success("Campanha gerada!");
    } catch {
      toast.error("Erro ao gerar campanha.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  const toggle = (section: string) => setExpanded(expanded === section ? null : section);

  const sections = result
    ? [
        { key: "copies", label: "3 Copies", items: result.copies },
        { key: "ctas", label: "5 CTAs", items: result.ctas },
        { key: "direct_messages", label: "3 Mensagens de Direct", items: result.direct_messages },
        { key: "followups", label: "3 Follow-ups", items: result.followups },
        { key: "content_ideas", label: "7 Ideias de Conteúdo", items: result.content_ideas },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Campanha Expressa</h1>
        <p className="text-slate-500 mt-1">Gere uma campanha completa com copies, CTAs, mensagens e ideias em segundos.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Objetivo da campanha</CardTitle>
          <CardDescription>O que você quer alcançar com essa campanha?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {OBJECTIVES.map((obj) => (
              <button
                key={obj.id}
                onClick={() => setSelectedObjective(obj.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedObjective === obj.id
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <span className="text-2xl">{obj.icon}</span>
                <span className="text-xs font-medium text-center">{obj.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Descreva sua oferta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offer">O que você está promovendo?</Label>
            <Textarea
              id="offer"
              placeholder="Ex: Mentoria de vendas pelo WhatsApp para autônomos. Valor: R$497. Garanto mais fechamentos em 21 dias..."
              rows={3}
              value={offerDescription}
              onChange={(e) => setOfferDescription(e.target.value)}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Montando campanha...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" />Gerar Campanha Completa</>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Campanha gerada</h2>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-green-800">Headline Principal</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => copyText(result.headline)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-900 font-semibold text-lg">{result.headline}</p>
            </CardContent>
          </Card>

          {sections.map(({ key, label, items }) => (
            <Card key={key}>
              <CardHeader className="pb-2 cursor-pointer" onClick={() => toggle(key)}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{label}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{items.length}</Badge>
                    {expanded === key ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </div>
              </CardHeader>
              {expanded === key && (
                <CardContent>
                  <div className="space-y-3">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg">
                        <span className="text-xs font-bold text-slate-400 mt-0.5 w-4 flex-shrink-0">{i + 1}</span>
                        <p className="text-slate-700 text-sm flex-1">{item}</p>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0" onClick={() => copyText(item)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          <Card>
            <CardHeader className="pb-2 cursor-pointer" onClick={() => toggle("video_script")}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Script de Vídeo Curto</CardTitle>
                {expanded === "video_script" ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </div>
            </CardHeader>
            {expanded === "video_script" && (
              <CardContent>
                <p className="text-slate-700 text-sm whitespace-pre-wrap">{result.video_script}</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={() => copyText(result.video_script)}>
                  <Copy className="mr-1 h-3 w-3" />Copiar script
                </Button>
              </CardContent>
            )}
          </Card>

          <Button variant="outline" onClick={() => {
            const all = `HEADLINE: ${result.headline}\n\nCOPIES:\n${result.copies.join("\n\n")}\n\nCTAs:\n${result.ctas.join("\n")}\n\nMENSAGENS DIRECT:\n${result.direct_messages.join("\n\n")}\n\nFOLLOW-UPS:\n${result.followups.join("\n\n")}\n\nIDEIAS DE CONTEÚDO:\n${result.content_ideas.join("\n")}\n\nSCRIPT DE VÍDEO:\n${result.video_script}`;
            copyText(all);
          }}>
            <Copy className="mr-2 h-4 w-4" />Copiar campanha completa
          </Button>
          <Button variant="outline">
            <Star className="mr-2 h-4 w-4" />Salvar nos favoritos
          </Button>
        </div>
      )}
    </div>
  );
}
