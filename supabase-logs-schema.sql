create table if not exists call_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  trigger_phrase text not null,
  phone_number text not null,
  message text not null,
  success boolean not null,
  created_at timestamptz default now()
);

alter table call_logs enable row level security;

create policy "Users can manage their own logs"
  on call_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
