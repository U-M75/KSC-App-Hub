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
APP_HUB_ADMIN_PASSWORD=
APP_HUB_SESSION_SECRET=
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

The public page only shows the app cards. Add, edit and remove controls are available on `/admin`, which is protected by `APP_HUB_ADMIN_PASSWORD`.

Use a strong password and keep `APP_HUB_SESSION_SECRET` private. The public launcher does not require a password.
