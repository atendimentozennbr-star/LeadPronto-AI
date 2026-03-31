"use client";

import { useState } from "react";
import { Sparkles, Copy, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const CONTENT_TYPES = [
  { id: "instagram_post", label: "Post Instagram", icon: "📸" },
  { id: "reels_script", label: "Roteiro de Reels", icon: "🎬" },
  { id: "stories_cta", label: "Stories com CTA", icon: "⚡" },
  { id: "short_ad", label: "Anúncio Curto", icon: "📢" },
  { id: "landing_text", label: "Texto para Landing Page", icon: "📄" },
  { id: "offer_title", label: "Título de Oferta", icon: "🎯" },
];

const VOICE_TONES = [
  { id: "direto", label: "Direto", description: "Objetivo e sem rodeios" },
  { id: "premium", label: "Premium", description: "Sofisticado e exclusivo" },
  { id: "emocional", label: "Emocional", description: "Conecta com sentimentos" },
  { id: "tecnico", label: "Técnico", description: "Usa dados e evidências" },
  { id: "agressivo", label: "Agressivo", description: "Urgente e incisivo" },
  { id: "amigavel", label: "Amigável", description: "Próximo e acolhedor" },
];

export default function ConteudoPage() {
  const [selectedType, setSelectedType] = useState("instagram_post");
  const [selectedTone, setSelectedTone] = useState("direto");
  const [offerDescription, setOfferDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!offerDescription.trim()) {
      toast.error("Descreva sua oferta antes de gerar o conteúdo.");
      return;
    }
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "content",
          data: {
            content_type: selectedType,
            voice_tone: selectedTone,
            offer: offerDescription,
          },
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(Array.isArray(data.result) ? data.result : [data.result]);
      toast.success("Conteúdo gerado com sucesso!");
    } catch {
      toast.error("Erro ao gerar conteúdo. Tente novamente.");
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
        <h1 className="text-2xl font-bold text-slate-900">Conteúdo que Vende</h1>
        <p className="text-slate-500 mt-1">
          Gere posts, roteiros e textos de vendas com IA no seu tom de voz.
        </p>
      </div>

      {/* Content Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipo de conteúdo</CardTitle>
          <CardDescription>Escolha o formato que você quer gerar.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                  selectedType === type.id
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
              >
                <span className="text-2xl">{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Voice Tone Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tom de voz</CardTitle>
          <CardDescription>Como você quer soar para o seu público?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VOICE_TONES.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setSelectedTone(tone.id)}
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 transition-all ${
                  selectedTone === tone.id
                    ? "border-green-500 bg-green-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className={`text-sm font-semibold ${selectedTone === tone.id ? "text-green-700" : "text-slate-700"}`}>
                  {tone.label}
                </span>
                <span className="text-xs text-slate-500">{tone.description}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Offer Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Descreva sua oferta</CardTitle>
          <CardDescription>
            O que você está vendendo? Para quem? Qual o benefício principal?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="offer">Oferta ou serviço</Label>
            <Textarea
              id="offer"
              placeholder="Ex: Consultoria de vendas pelo WhatsApp para prestadores de serviço. Ajudo a organizar o atendimento e aumentar as conversões em 30 dias..."
              rows={4}
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
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando conteúdo...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar{" "}
                {CONTENT_TYPES.find((t) => t.id === selectedType)?.label}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Conteúdos gerados</h2>
            <Badge variant="secondary">{results.length} versões</Badge>
          </div>
          {results.map((result, index) => (
            <Card key={index} className="border-green-100">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {CONTENT_TYPES.find((t) => t.id === selectedType)?.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {selectedTone}
                    </Badge>
                  </div>
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
                <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {result}
                </p>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={loading}
            className="w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Gerar mais variações
          </Button>
        </div>
      )}
    </div>
  );
}
