# KSC App Hub

A Kawaii Slime Company branded internal app launcher. There is intentionally no login/password in this version.

## Features

- KSC logo, Quicksand and Nunito fonts, and pink/brown/blue storefront colors
- App cards with icon, title and summary
- Title is the only visible clickable link; the raw URL is not displayed
- Add, edit and remove apps through the UI
- Supabase-backed app directory
- Search

## Setup

Run `supabase-app-launcher-schema.sql` in a new Supabase project, then set in Vercel:

```text
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
APP_BASE_URL=https://your-launcher.vercel.app
```

Deploy the extracted project files to Vercel.

## Important security note

Because this version has no password, anyone who can open the app can add, edit or remove app cards. Add authentication before using it outside the trusted internal team.
