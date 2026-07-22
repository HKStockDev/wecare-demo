-- Record donation + bump campaign totals (security definer)
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
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.wecare_donations (campaign_id, donor_id, donor_name, amount, status)
  values (p_campaign_id, auth.uid(), p_donor_name, p_amount, 'completed')
  returning * into rec;

  update public.wecare_campaigns
  set
    raised_amount = raised_amount + p_amount,
    donors_count = donors_count + 1
  where id = p_campaign_id;

  return rec;
end;
$$;

grant execute on function public.wecare_record_donation(uuid, text, numeric) to authenticated;
