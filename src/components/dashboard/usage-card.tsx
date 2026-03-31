import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usageColour } from "@/lib/utils"

interface UsageCardProps {
  used: number
  limit: number
  plan: string
  resetDate?: string
}

export function UsageCard({ used, limit, plan, resetDate }: UsageCardProps) {
  const percent = Math.round((used / limit) * 100)
  const remaining = limit - used

  return (
    <Card className="border-[#E2E8F0] shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#F59E0B]" />
            Uso de Gerações
          </CardTitle>
          <Badge variant={plan === "pro" ? "success" : "default"} className="capitalize">
            {plan}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-[#0F172A]">{used}</span>
          <span className="text-[#64748B] text-sm">/ {limit} gerações</span>
        </div>
        <Progress value={percent} className="h-2 mb-2" indicatorClassName={usageColour(percent)} />
        <div className="flex items-center justify-between">
          <p className="text-[#64748B] text-xs">{remaining} restantes este mês</p>
          {percent >= 80 && (
            <Link href="/configuracoes">
              <Button size="sm" variant="accent" className="h-6 text-xs px-2">
                Upgrade
              </Button>
            </Link>
          )}
        </div>
        {resetDate && (
          <p className="text-[#94A3B8] text-xs mt-1">Renova em {resetDate}</p>
        )}
      </CardContent>
    </Card>
  )
}
