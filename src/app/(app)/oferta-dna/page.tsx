"use client";

import { useState } from "react";
import { Sparkles, Copy, Star, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface OfferDNA {
  value_proposition: string;
  headline: string;
  main_promise: string;
  benefits: string[];
  differentials: string[];
  main_cta: string;
  objections: string[];
  sales_angles: string[];
}

export default function OfertaDNAPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OfferDNA | null>(null);
  const [form, setForm] = useState({
    product: "",
    target: "",
    pain: "",
    transformation: "",
    price: "",
    differentials: "",
  });
  const [expandedSection, setExpandedSection] = useState<string | null>("benefits");

  const handleGenerate = async () => {
    if (!form.product || !form.target) {
      toast.error("Preencha pelo menos o produto/serviço e o público-alvo.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module: "offer_dna",
          data: form,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
      toast.success("DNA da Oferta gerado com sucesso!");
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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Oferta DNA</h1>
        <p className="text-slate-500 mt-1">
          Descreva seu produto ou serviço e receba a estrutura completa da sua oferta.
        </p>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Descreva sua oferta</CardTitle>
          <CardDescription>
            Quanto mais detalhes você der, mais preciso será o resultado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product">Produto ou Serviço *</Label>
              <Input
                id="product"
                placeholder="Ex: Consultoria de marketing digital para pequenos negócios"
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Público-alvo *</Label>
              <Input
                id="target"
                placeholder="Ex: Empreendedores que vendem pelo Instagram"
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pain">Principal Dor do Cliente</Label>
            <Textarea
              id="pain"
              placeholder="Ex: Não sabe o que postar, perde leads por demora nas respostas..."
              rows={2}
              value={form.pain}
              onChange={(e) => setForm({ ...form, pain: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transformation">Transformação Prometida</Label>
            <Textarea
              id="transformation"
              placeholder="Ex: Em 30 dias, o cliente terá um sistema de conteúdo funcionando sozinho..."
              rows={2}
              value={form.transformation}
              onChange={(e) => setForm({ ...form, transformation: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço / Ticket Médio</Label>
              <Input
                id="price"
                placeholder="Ex: R$ 1.500 / mês"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="differentials">Diferenciais (opcional)</Label>
              <Input
                id="differentials"
                placeholder="Ex: Atendimento 24h, resultado em 15 dias..."
                value={form.differentials}
                onChange={(e) => setForm({ ...form, differentials: e.target.value })}
              />
            </div>
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
                Gerando DNA da Oferta...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar DNA da Oferta
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Resultado</h2>

          {/* Headline & Promise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <p className="text-slate-900 font-medium">{result.headline}</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-amber-800">CTA Principal</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => copyText(result.main_cta)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-900 font-medium">{result.main_cta}</p>
              </CardContent>
            </Card>
          </div>

          {/* Value Proposition */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Proposta de Valor</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => copyText(result.value_proposition)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{result.value_proposition}</p>
            </CardContent>
          </Card>

          {/* Promise */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Promessa Principal</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => copyText(result.main_promise)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{result.main_promise}</p>
            </CardContent>
          </Card>

          {/* Expandable sections */}
          {[
            { key: "benefits", label: "Benefícios", items: result.benefits, color: "green" },
            { key: "differentials", label: "Diferenciais", items: result.differentials, color: "blue" },
            { key: "objections", label: "Objeções Prováveis", items: result.objections, color: "red" },
            { key: "sales_angles", label: "Ângulos de Venda", items: result.sales_angles, color: "purple" },
          ].map(({ key, label, items, color }) => (
            <Card key={key}>
              <CardHeader
                className="pb-2 cursor-pointer"
                onClick={() => toggleSection(key)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{label}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{items.length} itens</Badge>
                    {expandedSection === key ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              {expandedSection === key && (
                <CardContent>
                  <ul className="space-y-2">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                          color === "green" ? "bg-green-500" :
                          color === "blue" ? "bg-blue-500" :
                          color === "red" ? "bg-red-500" : "bg-purple-500"
                        }`} />
                        <span className="text-slate-700 text-sm">{item}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto flex-shrink-0 h-6 w-6 p-0"
                          onClick={() => copyText(item)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => copyText(items.join("\n"))}
                  >
                    <Copy className="mr-1 h-3 w-3" />
                    Copiar todos
                  </Button>
                </CardContent>
              )}
            </Card>
          ))}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const full = `HEADLINE: ${result.headline}\n\nPROMESSA: ${result.main_promise}\n\nPROPOSTA DE VALOR: ${result.value_proposition}\n\nBENEFÍCIOS:\n${result.benefits.join("\n")}\n\nDIFERENCIAIS:\n${result.differentials.join("\n")}\n\nCTA: ${result.main_cta}\n\nOBJEÇÕES:\n${result.objections.join("\n")}\n\nÂNGULOS DE VENDA:\n${result.sales_angles.join("\n")}`;
                copyText(full);
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar tudo
            </Button>
            <Button variant="outline">
              <Star className="mr-2 h-4 w-4" />
              Salvar nos favoritos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
