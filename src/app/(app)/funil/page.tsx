"use client";

import { useState } from "react";
import { Plus, Phone, Tag, Calendar, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const COLUMNS = [
  { id: "new_lead", label: "Novo Lead", color: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
  { id: "responded", label: "Respondeu", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  { id: "interested", label: "Interessado", color: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
  { id: "followup_pending", label: "Follow-up Pendente", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  { id: "almost_closing", label: "Quase Fechando", color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  { id: "closed", label: "Fechado ✓", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  { id: "lost", label: "Perdido", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
];

interface Lead {
  id: string;
  name: string;
  contact: string;
  origin: string;
  status: string;
  observations: string;
  main_objection: string;
  next_step: string;
  next_followup_date: string;
}

const SAMPLE_LEADS: Lead[] = [
  { id: "1", name: "Ana Lima", contact: "@analima", origin: "Instagram", status: "new_lead", observations: "", main_objection: "", next_step: "Primeiro contato", next_followup_date: "" },
  { id: "2", name: "Carlos Melo", contact: "11 9xxxx-xxxx", origin: "WhatsApp", status: "interested", observations: "Gostou do serviço", main_objection: "Preço alto", next_step: "Enviar proposta", next_followup_date: "2026-04-01" },
  { id: "3", name: "Beatriz Souza", contact: "beatriz@email.com", origin: "Landing Page", status: "followup_pending", observations: "Pediu mais informações", main_objection: "Sem tempo", next_step: "Follow-up", next_followup_date: "2026-04-02" },
  { id: "4", name: "Rafael Nunes", contact: "@rafaelnunes", origin: "Indicação", status: "almost_closing", observations: "Quer fechar essa semana", main_objection: "", next_step: "Enviar contrato", next_followup_date: "2026-03-31" },
  { id: "5", name: "Marina Costa", contact: "11 9xxxx-xxxx", origin: "Instagram", status: "closed", observations: "Fechou plano mensal", main_objection: "", next_step: "Onboarding", next_followup_date: "" },
];

export default function FunilPage() {
  const [leads, setLeads] = useState<Lead[]>(SAMPLE_LEADS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newLead, setNewLead] = useState<Partial<Lead>>({ status: "new_lead" });

  const addLead = () => {
    if (!newLead.name) return;
    const lead: Lead = {
      id: Date.now().toString(),
      name: newLead.name || "",
      contact: newLead.contact || "",
      origin: newLead.origin || "",
      status: newLead.status || "new_lead",
      observations: newLead.observations || "",
      main_objection: newLead.main_objection || "",
      next_step: newLead.next_step || "",
      next_followup_date: newLead.next_followup_date || "",
    };
    setLeads([...leads, lead]);
    setShowAddModal(false);
    setNewLead({ status: "new_lead" });
  };

  const moveLeadToStatus = (leadId: string, newStatus: string) => {
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    setSelectedLead(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Funil de Leads</h1>
          <p className="text-slate-500 mt-1">Organize e acompanhe seus leads do primeiro contato ao fechamento.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="mr-2 h-4 w-4" />Novo Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
        {COLUMNS.map((col) => {
          const count = leads.filter((l) => l.status === col.id).length;
          return (
            <div key={col.id} className="text-center p-2 rounded-lg bg-white border border-slate-100">
              <div className="text-lg font-bold text-slate-800">{count}</div>
              <div className="text-xs text-slate-500 truncate">{col.label}</div>
            </div>
          );
        })}
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {COLUMNS.map((col) => {
            const colLeads = leads.filter((l) => l.status === col.id);
            return (
              <div key={col.id} className="w-64 flex-shrink-0">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${col.color}`}>
                  <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                  <span className="text-sm font-semibold">{col.label}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">{colLeads.length}</Badge>
                </div>
                <div className="space-y-2 min-h-24">
                  {colLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      className="cursor-pointer hover:shadow-md transition-shadow border-slate-200"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <CardContent className="p-3">
                        <p className="font-semibold text-sm text-slate-900">{lead.name}</p>
                        {lead.contact && (
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-500">{lead.contact}</span>
                          </div>
                        )}
                        {lead.origin && (
                          <div className="flex items-center gap-1 mt-1">
                            <Tag className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-500">{lead.origin}</span>
                          </div>
                        )}
                        {lead.main_objection && (
                          <Badge variant="outline" className="mt-2 text-xs text-red-600 border-red-200">
                            {lead.main_objection}
                          </Badge>
                        )}
                        {lead.next_followup_date && (
                          <div className="flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3 text-amber-500" />
                            <span className="text-xs text-amber-600">{lead.next_followup_date}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{selectedLead.name}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedLead(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-slate-400">Contato:</span><p className="font-medium">{selectedLead.contact || "—"}</p></div>
                <div><span className="text-slate-400">Origem:</span><p className="font-medium">{selectedLead.origin || "—"}</p></div>
                <div><span className="text-slate-400">Objeção:</span><p className="font-medium text-red-600">{selectedLead.main_objection || "—"}</p></div>
                <div><span className="text-slate-400">Próximo follow-up:</span><p className="font-medium text-amber-600">{selectedLead.next_followup_date || "—"}</p></div>
              </div>
              {selectedLead.next_step && (
                <div><span className="text-slate-400 text-sm">Próximo passo:</span><p className="text-sm font-medium mt-1">{selectedLead.next_step}</p></div>
              )}
              {selectedLead.observations && (
                <div><span className="text-slate-400 text-sm">Observações:</span><p className="text-sm mt-1">{selectedLead.observations}</p></div>
              )}
              <div>
                <Label className="text-sm font-medium">Mover para:</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {COLUMNS.filter((c) => c.id !== selectedLead.status).map((col) => (
                    <Button
                      key={col.id}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => moveLeadToStatus(selectedLead.id, col.id)}
                    >
                      <ChevronDown className="mr-1 h-3 w-3" />{col.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Novo Lead</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Nome *</Label>
                <Input placeholder="Nome do lead" value={newLead.name || ""} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Contato</Label>
                  <Input placeholder="WhatsApp ou @" value={newLead.contact || ""} onChange={(e) => setNewLead({ ...newLead, contact: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Origem</Label>
                  <Input placeholder="Instagram, WhatsApp..." value={newLead.origin || ""} onChange={(e) => setNewLead({ ...newLead, origin: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Observações</Label>
                <Textarea placeholder="Detalhes sobre o lead..." rows={2} value={newLead.observations || ""} onChange={(e) => setNewLead({ ...newLead, observations: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Objeção principal</Label>
                  <Input placeholder="Ex: Preço alto" value={newLead.main_objection || ""} onChange={(e) => setNewLead({ ...newLead, main_objection: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Próximo follow-up</Label>
                  <Input type="date" value={newLead.next_followup_date || ""} onChange={(e) => setNewLead({ ...newLead, next_followup_date: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={addLead} className="flex-1 bg-green-600 hover:bg-green-700 text-white">Adicionar Lead</Button>
                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
