# Portfolio admin

## URLs
- Public site: `/`
- Admin login: `/admin/login`
- Admin projects: `/admin`

## Environment
Set these in `.env.local` and Vercel (Production + Preview):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (reads published projects) |
| `ADMIN_PASSWORD` | `/admin` login password (must match `public.admin_secrets.secret`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Required for file uploads to Storage (Project Settings → API → `service_role`). Without it, paste image URLs instead. |

Uploads over ~4.5MB are rejected by Vercel before our API runs. The admin form compresses images in the browser first; prefer screenshots under ~4MB or paste a public URL / `/images/...` path.

If you change `ADMIN_PASSWORD`, also update the database:

```sql
update public.admin_secrets set secret = 'your-new-password' where id = 1;
```

## CVs
PDFs live in `public/cv/`:

- `software.pdf` — Software page + hero menu
- `ui-ux.pdf` — UI/UX page + hero menu
- `creative.pdf` — Graphic and Video pages + hero menu

## Projects
Published projects (`draft = false`) load from Supabase on the live site.
Use `/admin` to add, edit, or delete. Software projects with a Live / Preview URL show a Preview button on the software work page and in the project modal.
