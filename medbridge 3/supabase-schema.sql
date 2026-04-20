-- ============================================================
-- MedBridge — Schema SQL para Supabase
-- Pega esto en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- 1. Tabla de casos clínicos
create table public.cases (
  id           uuid default gen_random_uuid() primary key,
  patient_name text not null,
  age          integer,
  sex          text,
  location     text default '',
  condition    text default '',
  promotor_id  uuid references auth.users(id) on delete set null,
  promotor_name text not null,
  symptom      text not null,
  answers      jsonb default '[]',
  triage       text not null check (triage in ('URGENTE','MODERADO','BAJO')),
  report       jsonb not null default '{}',
  status       text not null default 'pendiente' check (status in ('pendiente','revisado')),
  doctor_note  text default '',
  reviewer     text default '',
  created_at   timestamptz default now()
);

-- 2. Índices para performance
create index cases_promotor_id_idx on public.cases(promotor_id);
create index cases_triage_idx      on public.cases(triage);
create index cases_status_idx      on public.cases(status);
create index cases_created_at_idx  on public.cases(created_at desc);

-- 3. Row Level Security — todos los usuarios autenticados pueden leer/escribir
alter table public.cases enable row level security;

create policy "Usuarios autenticados pueden leer todos los casos"
  on public.cases for select
  using (auth.role() = 'authenticated');

create policy "Usuarios autenticados pueden crear casos"
  on public.cases for insert
  with check (auth.role() = 'authenticated');

create policy "Usuarios autenticados pueden actualizar casos"
  on public.cases for update
  using (auth.role() = 'authenticated');

-- 4. Habilitar Realtime para la tabla cases
-- (En el Dashboard: Database → Replication → habilita cases)
alter publication supabase_realtime add table public.cases;
