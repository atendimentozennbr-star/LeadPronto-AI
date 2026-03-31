-- LeadPronto AI - Database Schema
-- Run this in the Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  phone         TEXT,
  role          TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'member')),
  onboarded     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================
-- WORKSPACES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workspaces (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  owner_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  logo_url      TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspaces_select_member" ON public.workspaces
  FOR SELECT USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_id = workspaces.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "workspaces_insert_owner" ON public.workspaces
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "workspaces_update_owner" ON public.workspaces
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "workspaces_delete_owner" ON public.workspaces
  FOR DELETE USING (owner_id = auth.uid());

-- ============================================================
-- WORKSPACE MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  invited_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, user_id)
);

ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace_members_select" ON public.workspace_members
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE id = workspace_members.workspace_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "workspace_members_insert_owner" ON public.workspace_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE id = workspace_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "workspace_members_delete_owner" ON public.workspace_members
  FOR DELETE USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE id = workspace_id AND owner_id = auth.uid()
    )
  );

-- ============================================================
-- BRANDS (Oferta DNA)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.brands (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id      UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  segment           TEXT,
  target_audience   TEXT,
  pain_points       TEXT[],
  differentials     TEXT[],
  tone_of_voice     TEXT CHECK (tone_of_voice IN ('formal', 'informal', 'técnico', 'inspiracional', 'divertido')),
  brand_colors      TEXT[],
  logo_url          TEXT,
  website           TEXT,
  social_media      JSONB DEFAULT '{}',
  extra_context     TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brands_workspace_access" ON public.brands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      LEFT JOIN public.workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = auth.uid()
      WHERE w.id = brands.workspace_id
        AND (w.owner_id = auth.uid() OR wm.user_id = auth.uid())
    )
  );

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id          UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  stripe_customer_id    TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id       TEXT,
  plan                  TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro')),
  status                TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  cancel_at_period_end  BOOLEAN NOT NULL DEFAULT FALSE,
  trial_end             TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id)
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_workspace_owner" ON public.subscriptions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE id = subscriptions.workspace_id AND owner_id = auth.uid()
    )
  );

-- ============================================================
-- USAGE LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  feature       TEXT NOT NULL CHECK (feature IN ('content', 'whatsapp', 'campaign', 'offer_dna', 'funnel', 'analytics')),
  tokens_used   INTEGER NOT NULL DEFAULT 0,
  model         TEXT,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_logs_workspace_access" ON public.usage_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      LEFT JOIN public.workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = auth.uid()
      WHERE w.id = usage_logs.workspace_id
        AND (w.owner_id = auth.uid() OR wm.user_id = auth.uid())
    )
  );

CREATE POLICY "usage_logs_insert_authenticated" ON public.usage_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================
-- OFFERS (Oferta DNA - saved offer profiles)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.offers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id      UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  brand_id          UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  name              TEXT NOT NULL,
  description       TEXT,
  price             NUMERIC(10, 2),
  original_price    NUMERIC(10, 2),
  category          TEXT,
  benefits          TEXT[],
  objections        TEXT[],
  cta               TEXT,
  urgency_trigger   TEXT,
  social_proof      TEXT,
  guarantee         TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "offers_workspace_access" ON public.offers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      LEFT JOIN public.workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = auth.uid()
      WHERE w.id = offers.workspace_id
        AND (w.owner_id = auth.uid() OR wm.user_id = auth.uid())
    )
  );

-- ============================================================
-- GENERATED CONTENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.generated_contents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_id      UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  offer_id      UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  type          TEXT NOT NULL CHECK (type IN ('post', 'story', 'reel', 'email', 'whatsapp', 'ad', 'blog', 'caption')),
  platform      TEXT CHECK (platform IN ('instagram', 'facebook', 'linkedin', 'twitter', 'tiktok', 'whatsapp', 'email', 'google_ads', 'generic')),
  title         TEXT,
  content       TEXT NOT NULL,
  prompt        TEXT,
  tone          TEXT,
  hashtags      TEXT[],
  is_favorite   BOOLEAN NOT NULL DEFAULT FALSE,
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  published_at  TIMESTAMPTZ,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.generated_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "generated_contents_workspace_access" ON public.generated_contents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      LEFT JOIN public.workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = auth.uid()
      WHERE w.id = generated_contents.workspace_id
        AND (w.owner_id = auth.uid() OR wm.user_id = auth.uid())
    )
  );

-- ============================================================
-- CAMPAIGNS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.campaigns (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  brand_id      UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  offer_id      UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  objective     TEXT,
  start_date    DATE,
  end_date      DATE,
  budget        NUMERIC(10, 2),
  channels      TEXT[],
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  description   TEXT,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "campaigns_workspace_access" ON public.campaigns
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      LEFT JOIN public.workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = auth.uid()
      WHERE w.id = campaigns.workspace_id
        AND (w.owner_id = auth.uid() OR wm.user_id = auth.uid())
    )
  );

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leads (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  campaign_id   UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  email         TEXT,
  phone         TEXT,
  source        TEXT CHECK (source IN ('manual', 'landing_page', 'whatsapp', 'instagram', 'facebook', 'google_ads', 'referral', 'organic', 'other')),
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'negotiating', 'won', 'lost', 'unqualified')),
  score         INTEGER DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  tags          TEXT[],
  notes         TEXT,
  last_contact  TIMESTAMPTZ,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_workspace_access" ON public.leads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      LEFT JOIN public.workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = auth.uid()
      WHERE w.id = leads.workspace_id
        AND (w.owner_id = auth.uid() OR wm.user_id = auth.uid())
    )
  );

-- ============================================================
-- LEAD FOLLOWUPS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lead_followups (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id       UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('call', 'email', 'whatsapp', 'meeting', 'note', 'task')),
  content       TEXT,
  outcome       TEXT,
  scheduled_at  TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  is_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.lead_followups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lead_followups_workspace_access" ON public.lead_followups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      LEFT JOIN public.workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = auth.uid()
      WHERE w.id = lead_followups.workspace_id
        AND (w.owner_id = auth.uid() OR wm.user_id = auth.uid())
    )
  );

-- ============================================================
-- SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.settings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  key           TEXT NOT NULL,
  value         JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, key)
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_workspace_owner" ON public.settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces
      WHERE id = settings.workspace_id AND owner_id = auth.uid()
    )
  );

-- ============================================================
-- WHATSAPP SCRIPTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_scripts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  brand_id      UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  offer_id      UUID REFERENCES public.offers(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  stage         TEXT NOT NULL CHECK (stage IN ('prospecting', 'first_contact', 'follow_up', 'objection_handling', 'closing', 'post_sale', 'reactivation')),
  content       TEXT NOT NULL,
  variables     TEXT[],
  is_favorite   BOOLEAN NOT NULL DEFAULT FALSE,
  tags          TEXT[],
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.whatsapp_scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "whatsapp_scripts_workspace_access" ON public.whatsapp_scripts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workspaces w
      LEFT JOIN public.workspace_members wm ON wm.workspace_id = w.id AND wm.user_id = auth.uid()
      WHERE w.id = whatsapp_scripts.workspace_id
        AND (w.owner_id = auth.uid() OR wm.user_id = auth.uid())
    )
  );

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'workspaces', 'brands', 'subscriptions',
    'offers', 'generated_contents', 'campaigns', 'leads',
    'lead_followups', 'settings', 'whatsapp_scripts'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at
       BEFORE UPDATE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();',
      t
    );
  END LOOP;
END;
$$;

-- ============================================================
-- NEW USER REGISTRATION TRIGGER
-- Creates a profile and a default workspace when a user signs up
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_workspace_id UUID;
  v_slug         TEXT;
  v_full_name    TEXT;
BEGIN
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  -- Insert profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    v_full_name,
    NEW.raw_user_meta_data->>'avatar_url'
  );

  -- Generate a unique workspace slug
  v_slug := lower(regexp_replace(v_full_name, '[^a-zA-Z0-9]', '-', 'g'));
  v_slug := regexp_replace(v_slug, '-+', '-', 'g');
  v_slug := regexp_replace(v_slug, '^-|-$', '', 'g');
  v_slug := v_slug || '-' || substr(gen_random_uuid()::TEXT, 1, 8);

  -- Create default workspace
  INSERT INTO public.workspaces (name, slug, owner_id)
  VALUES (v_full_name || '''s Workspace', v_slug, NEW.id)
  RETURNING id INTO v_workspace_id;

  -- Create free subscription for new workspace
  INSERT INTO public.subscriptions (workspace_id, plan, status)
  VALUES (v_workspace_id, 'free', 'active');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_brands_workspace ON public.brands(workspace_id);
CREATE INDEX IF NOT EXISTS idx_offers_workspace ON public.offers(workspace_id);
CREATE INDEX IF NOT EXISTS idx_generated_contents_workspace ON public.generated_contents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_generated_contents_type ON public.generated_contents(type);
CREATE INDEX IF NOT EXISTS idx_campaigns_workspace ON public.campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_workspace ON public.leads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_lead_followups_lead ON public.lead_followups(lead_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_workspace ON public.usage_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON public.usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_scripts_workspace ON public.whatsapp_scripts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_scripts_stage ON public.whatsapp_scripts(stage);
