# KSC App Hub

A Kawaii Slime Company branded internal app launcher. There is intentionally no login/password in this version.

## Features

- KSC logo, Quicksand and Nunito fonts, and pink/brown/blue storefront colors
- App cards with icon, title and summary
- Title is the only visible clickable link; the raw URL is not displayed
- Add, edit and remove apps through the UI
- Neon PostgreSQL-backed app directory
- Search

## Setup

Run `neon-app-launcher-schema.sql` in the Neon SQL Editor, then set in Vercel:

```text
DATABASE_URL=
APP_BASE_URL=https://your-launcher.vercel.app
```

Deploy the extracted project files to Vercel.

## Pages

Public launcher:

```text
/
```

Backend app manager:

```text
/admin
```

The public page only shows the app cards. Add, edit and remove controls are available on `/admin`.

## Important security note

Because this version has no password, anyone who can open `/admin` can add, edit or remove app cards. Add authentication before using it outside the trusted internal team.
