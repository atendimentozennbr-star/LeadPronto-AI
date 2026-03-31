"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Heart, Download, Check, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface ResultCardProps {
  title: string
  content: string
  module?: string
  contentType?: string
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onSave?: () => void
  className?: string
  metadata?: Record<string, string>
}

export function ResultCard({
  title,
  content,
  module,
  contentType,
  isFavorite = false,
  onToggleFavorite,
  onSave,
  className,
  metadata,
}: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success("Copiado para a área de transferência!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Arquivo baixado!")
  }

  return (
    <Card className={cn("border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[#0F172A]">{title}</h3>
            {module && <Badge variant="outline" className="text-xs">{module}</Badge>}
            {contentType && <Badge variant="secondary" className="text-xs">{contentType}</Badge>}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  isFavorite
                    ? "text-red-500 hover:text-red-600 bg-red-50"
                    : "text-[#94A3B8] hover:text-red-500 hover:bg-red-50"
                )}
              >
                <Heart className={cn("w-3.5 h-3.5", isFavorite && "fill-current")} />
              </button>
            )}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-md text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
          <p className="text-[#0F172A] text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
        </div>
        {metadata && Object.keys(metadata).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(metadata).map(([key, value]) => (
              <span key={key} className="text-xs text-[#64748B]">
                <span className="font-medium">{key}:</span> {value}
              </span>
            ))}
          </div>
        )}
        {onSave && (
          <div className="mt-3 flex justify-end">
            <Button size="sm" variant="outline" onClick={onSave} className="text-xs">
              <Share2 className="w-3 h-3 mr-1" />
              Salvar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
