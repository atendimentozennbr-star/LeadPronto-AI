"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const passwordsMatch = confirmPassword === "" || password === confirmPassword
  const passwordStrong = password.length >= 8

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!passwordStrong) {
      setError("A senha deve ter pelo menos 8 caracteres.")
      return
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }
    if (!acceptTerms) {
      setError("Você precisa aceitar os termos de uso para continuar.")
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      })

      if (authError) {
        if (authError.message.includes("User already registered")) {
          setError("Este email já está cadastrado. Tente fazer login.")
        } else if (authError.message.includes("Password should be")) {
          setError("A senha deve ter pelo menos 6 caracteres.")
        } else {
          setError(authError.message)
        }
        return
      }

      setSuccess(true)
      setTimeout(() => router.push("/onboarding"), 2000)
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-2xl font-bold">Crie sua conta grátis</CardTitle>
        <CardDescription className="text-[#94A3B8]">
          7 dias grátis, sem cartão de crédito. Cancele quando quiser.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {success ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#16A34A]/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#16A34A]" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg mb-1">Conta criada com sucesso!</p>
              <p className="text-slate-400 text-sm">Redirecionando para a configuração inicial...</p>
            </div>
            <Loader2 className="w-5 h-5 text-[#16A34A] animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-300 text-sm font-medium">
                Nome completo
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Seu nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                disabled={loading}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus:border-[#16A34A] focus:ring-[#16A34A]/20 h-11"
              />
            </div>

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
              <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
              {password && (
                <p className={`text-xs mt-1 ${passwordStrong ? "text-[#16A34A]" : "text-amber-400"}`}>
                  {passwordStrong ? "✓ Senha forte o suficiente" : "A senha deve ter pelo menos 8 caracteres"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300 text-sm font-medium">
                Confirmar senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                  className={`bg-white/10 border-white/20 text-white placeholder:text-slate-500 h-11 pr-10 focus:ring-[#16A34A]/20 ${
                    !passwordsMatch ? "border-red-500/50 focus:border-red-500" : "focus:border-[#16A34A]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!passwordsMatch && (
                <p className="text-xs text-red-400 mt-1">As senhas não coincidem</p>
              )}
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={loading}
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/10 text-[#16A34A] focus:ring-[#16A34A]/20 cursor-pointer flex-shrink-0"
              />
              <label htmlFor="terms" className="text-slate-400 text-sm leading-relaxed cursor-pointer">
                Li e aceito os{" "}
                <a href="#" className="text-[#16A34A] hover:text-green-400 transition-colors">
                  Termos de Uso
                </a>{" "}
                e a{" "}
                <a href="#" className="text-[#16A34A] hover:text-green-400 transition-colors">
                  Política de Privacidade
                </a>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !password || !confirmPassword || !acceptTerms || !passwordsMatch}
              className="w-full bg-[#16A34A] hover:bg-green-600 text-white font-semibold h-11 rounded-lg transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta grátis"
              )}
            </Button>

            <p className="text-center text-slate-400 text-sm">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-[#16A34A] hover:text-green-400 font-medium transition-colors">
                Fazer login
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
