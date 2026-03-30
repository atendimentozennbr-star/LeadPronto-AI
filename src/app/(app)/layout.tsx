import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"

const PLAN_LIMITS: Record<string, number> = { free: 10, basic: 40, pro: 200 }

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ data: workspace }, { data: profile }] = await Promise.all([
    supabase.from("workspaces").select("id, name").eq("owner_id", user.id).single(),
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
  ])

  let plan = "free"
  let generationsUsed = 0

  if (workspace) {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    const [{ data: subscription }, { count }] = await Promise.all([
      supabase.from("subscriptions").select("plan").eq("workspace_id", workspace.id).single(),
      supabase
        .from("usage_logs")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspace.id)
        .gte("created_at", startOfMonth),
    ])
    plan = subscription?.plan ?? "free"
    generationsUsed = count ?? 0
  }

  const generationsLimit = PLAN_LIMITS[plan] ?? 40

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar
        generationsUsed={generationsUsed}
        generationsLimit={generationsLimit}
        userEmail={user.email ?? ""}
        userName={profile?.full_name ?? ""}
        plan={plan}
      />
      <main className="flex-1 md:ml-60 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
