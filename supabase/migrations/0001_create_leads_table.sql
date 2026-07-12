create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  track text not null check (track in ('attendee', 'organizer')),
  role text check (role in ('event_owner', 'location_owner', 'organizer', 'other')),
  source text not null default 'wap-landing',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Allow public inserts" on public.leads
  for insert
  to anon
  with check (true);
