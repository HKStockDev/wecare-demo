-- Donation RPC: record payment, bump campaign, notify all admins
create or replace function public.wecare_record_donation(
  p_campaign_id uuid,
  p_donor_name text,
  p_amount numeric
)
returns public.wecare_donations
language plpgsql
security definer
set search_path = public
as $$
declare
  rec public.wecare_donations;
  camp_title text;
  admin_row record;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select title into camp_title
  from public.wecare_campaigns
  where id = p_campaign_id;

  insert into public.wecare_donations (campaign_id, donor_id, donor_name, amount, status)
  values (p_campaign_id, auth.uid(), p_donor_name, p_amount, 'completed')
  returning * into rec;

  update public.wecare_campaigns
  set
    raised_amount = raised_amount + p_amount,
    donors_count = donors_count + 1
  where id = p_campaign_id;

  for admin_row in
    select id from public.wecare_profiles where role = 'admin'
  loop
    insert into public.wecare_notifications (user_id, title, body, read)
    values (
      admin_row.id,
      'New donation received',
      format(
        '%s donated $%s to %s',
        p_donor_name,
        trim(to_char(p_amount, 'FM999999990.00')),
        coalesce(camp_title, 'a campaign')
      ),
      false
    );
  end loop;

  return rec;
end;
$$;

grant execute on function public.wecare_record_donation(uuid, text, numeric) to authenticated;

-- Admins can mark notifications read
drop policy if exists "wecare notifications update" on public.wecare_notifications;
create policy "wecare notifications update"
  on public.wecare_notifications for update
  using (user_id = auth.uid() or public.wecare_is_admin());

grant update on public.wecare_notifications to authenticated;

-- Enable Realtime for donation + notification inserts
do $$
begin
  begin
    alter publication supabase_realtime add table public.wecare_donations;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.wecare_notifications;
  exception when duplicate_object then null;
  end;
end $$;
