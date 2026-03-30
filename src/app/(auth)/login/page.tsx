"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Email ou senha incorretos. Verifique seus dados e tente novamente.")
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Confirme seu email antes de entrar. Verifique sua caixa de entrada.")
        } else {
          setError(authError.message)
        }
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-2xl font-bold">Bem-vindo de volta</CardTitle>
        <CardDescription className="text-[#94A3B8]">
          Entre na sua conta para continuar gerando conteúdo
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-3 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-[#16A34A] focus:ring-[#16A34A]/20 h-11"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                Senha
              </Label>
              <Link href="/forgot-password" className="text-[#16A34A] hover:text-green-400 text-xs transition-colors">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-[#16A34A] focus:ring-[#16A34A]/20 h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-[#16A34A] hover:bg-green-600 text-white font-semibold h-11 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>

          <p className="text-center text-slate-400 text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-[#16A34A] hover:text-green-400 font-medium transition-colors">
              Criar conta grátis
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
