"use client";

import { useState } from "react";
import { Sparkles, Copy, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const MESSAGE_TYPES = [
  { id: "first_contact", label: "Primeiro Contato", icon: "👋" },
  { id: "cold_lead", label: "Lead Frio", icon: "❄️" },
  { id: "undecided_lead", label: "Lead Indeciso", icon: "🤔" },
  { id: "followup_1d", label: "Follow-up 1 dia", icon: "⏰" },
  { id: "followup_3d", label: "Follow-up 3 dias", icon: "📅" },
  { id: "followup_7d", label: "Follow-up 7 dias", icon: "🗓️" },
  { id: "break_objection", label: "Quebra de Objeção", icon: "🔓" },
  { id: "close_urgency", label: "Fechamento com Urgência", icon: "🔥" },
  { id: "recover_lead", label: "Recuperar Lead Parado", icon: "♻️" },
];

export default function WhatsAppPage() {
  const [selectedType, setSelectedType] = useState("first_contact");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!context.trim()) {
      toast.error("Descreva sua oferta ou contexto.");
      return;
    }
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "whatsapp",
          data: { message_type: selectedType, context },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(Array.isArray(data.result) ? data.result : [data.result]);
      toast.success("Mensagens geradas!");
    } catch {
      toast.error("Erro ao gerar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">WhatsApp & Direct</h1>
        <p className="text-slate-500 mt-1">Mensagens prontas para cada etapa do seu atendimento.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipo de mensagem</CardTitle>
          <CardDescription>Para qual situação você precisa de uma mensagem?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MESSAGE_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                  selectedType === type.id
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <span className="text-lg">{type.icon}</span>
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contexto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="context">Descreva seu produto/serviço e o contexto do lead</Label>
            <Textarea
              id="context"
              placeholder="Ex: Vendo consultoria de emagrecimento online. Lead demonstrou interesse mas sumiu há 2 dias..."
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Gerando mensagens...</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" />Gerar Mensagens</>
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Mensagens geradas</h2>
          {results.map((result, index) => (
            <Card key={index} className="border-green-100">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {MESSAGE_TYPES.find((t) => t.id === selectedType)?.label}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => copyText(result)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{result}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
