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

create index if not exists ksc_app_launcher_apps_order_idx
  on public.ksc_app_launcher_apps(active, sort_order, title);

update public.ksc_app_launcher_apps set title='Shipping Claims & Resolution System' where title='Shipping Claims';
update public.ksc_app_launcher_apps set title='Finance & Payroll Hub' where title='Finance & Payroll';
update public.ksc_app_launcher_apps set title='Warehouse Shrink' where title='Warehouse Shrink App';
update public.ksc_app_launcher_apps set title='Purchase Request Form' where title='To-Order Request Form';

insert into public.ksc_app_launcher_apps(title, summary, app_url, icon, sort_order) values
('Shipping Claims & Resolution System','Submit missing, swapped, damaged and delivery claims. Track affected products, carriers, root causes and resolutions. Store claim activity and evidence workflows. Review KPIs and recurring shipping issues.','https://shipping-claims.vercel.app/','📦',10),
('Finance & Payroll Hub','Submit employee OT and temporary-worker timecards. Route records through supervisor approval and payroll review. Export CSV and generate PDF timecards. Keep an audit history for every payroll action.','https://ksc-finance-payroll.vercel.app/','💼',20),
('Warehouse Shrink','Record warehouse counts by location and product. Compare system quantity with physical counts. Track shrink patterns across inventory categories. Use the results to improve warehouse accuracy.','https://kscwarehouseshrinkapp.vercel.app/','📊',30),
('Purchase Request Form','Submit COGS and expense purchase requests. Route requests to the correct Slack channel. Track ordering and receiving progress in a dashboard. Export historical request data and PDFs.','https://order-reqeuest-form.vercel.app/','🛒',40),
('Quotation App','Create branded customer quotations and proposals. Manage product pricing, quantities and terms. Share proposal links with customers. Keep quote records organized for follow-up.','https://quotation-app-iota.vercel.app/','🧾',50),
('Inventory Monitoring & Restock Alerts','Monitor Shopify inventory across three storefronts. Detect variant-level restocks and new products with available inventory. Send real-time Slack alerts with product links. Review inventory changes and alert history.','https://ksc-inventory-monitor.vercel.app/','🔔',60)
on conflict (title) do update set summary=excluded.summary, app_url=excluded.app_url, icon=excluded.icon, sort_order=excluded.sort_order, updated_at=now();
