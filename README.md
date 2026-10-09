# AcadOS Frontend

A university portal for the registrar's office, faculty and students. It is the client for the
[AcadOS API](https://github.com/mmahadi-ahmedd/AcadOS-Backend).

**Live:** https://YOUR-FRONTEND.vercel.app

## What you can do
- **Students:** enrol and drop courses, see fees, pay through SSLCommerz, edit a profile
- **Faculty:** see assigned sections, take attendance, finalise grades, view teaching analytics
- **Registrar's office:** dashboard with charts, manage accounts and roles, read the audit trail
- **Visitors:** browse programmes and courses, read about the university, contact the registrar

## Stack
Next.js (App Router) · TypeScript · Tailwind · shadcn/ui · TanStack Query · Zustand ·
React Hook Form + Zod · Recharts · Sonner

## How it is put together
- Server components for the public pages; the course catalogue is cached on the server
- `proxy.ts` guards `/admin`, `/instructor` and `/student` by role
- Dashboards use `loading.tsx` skeletons, `error.tsx` boundaries and empty states
- Filters, search and pagination live in the URL so views can be shared
- Payments: the browser goes to SSLCommerz, which returns to `/payment/*/[tranId]`;
  those route handlers confirm with the API and redirect to the success or cancel page

## Demo logins
| Role | Email | Password |
|---|---|---|
| Registrar's Office | admin@acados.com | Admin@123 |
| Faculty | tanvir.instructor4@acados.com | Instructor@321 |
| Student | nusrat.student4@acados.com | Student@321 |

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```