create extension if not exists pgcrypto;

create table if not exists public.ksc_app_launcher_apps (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  summary text not null default '',
  app_url text not null,
  icon text not null default '✨',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ksc_app_launcher_apps_order_idx on public.ksc_app_launcher_apps(active, sort_order, title);

insert into public.ksc_app_launcher_apps(title, summary, app_url, icon, sort_order) values
('Shipping Claims','Shipping claims, resolutions, evidence and KPI reporting.','https://shipping-claims.vercel.app/','📦',10),
('Finance & Payroll','OT submissions, temp timecards, approvals and payroll processing.','https://ksc-finance-payroll.vercel.app/','💼',20),
('Warehouse Shrink','Warehouse inventory counts and shrink monitoring.','https://kscwarehouseshrinkapp.vercel.app/','📊',30),
('Purchase Request Form','COGS and expense purchase requests with dashboard tracking.','https://order-reqeuest-form.vercel.app/','🛒',40)
on conflict (title) do nothing;
