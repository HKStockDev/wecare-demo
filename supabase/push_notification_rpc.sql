-- Admin push notifications: insert one row per end-user so RLS + Realtime work
create or replace function public.wecare_push_notification(
  p_title text,
  p_body text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not public.wecare_is_admin() then
    raise exception 'Only admins can push notifications';
  end if;

  if coalesce(trim(p_title), '') = '' or coalesce(trim(p_body), '') = '' then
    raise exception 'Title and body are required';
  end if;

  insert into public.wecare_notifications (user_id, title, body, read)
  select id, trim(p_title), trim(p_body), false
  from public.wecare_profiles
  where role = 'user';

  get diagnostics inserted_count = row_count;
  return inserted_count;
end;
$$;

grant execute on function public.wecare_push_notification(text, text) to authenticated;

-- Ensure Realtime includes notifications (idempotent)
do $$
begin
  begin
    alter publication supabase_realtime add table public.wecare_notifications;
  exception when duplicate_object then null;
  end;
end $$;
