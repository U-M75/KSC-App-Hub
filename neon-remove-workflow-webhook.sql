-- Run this once if the workflow_webhook_url column was already added.
alter table public.ksc_app_launcher_apps drop column if exists workflow_webhook_url;
