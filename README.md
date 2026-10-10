<div align="center">

# 🎓 AcadOS: University Portal

**One place for the registrar's office, faculty and students.**
Courses, attendance, marks, fees and online payment, all on a real API.

[**Live Demo**](https://acados-frontend.vercel.app/) · [**Backend API**](https://acados-backend.vercel.app) · [**Backend Repo**](https://github.com/mmahadi-ahmedd/AcadOS-Backend) · [**Video Walkthrough**](https://drive.google.com/file/d/14PCTxSbUZqum-XE3q6cry-PN1VauCiC9/view?usp=sharing)

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-cached-ff4154)
![SSLCommerz](https://img.shields.io/badge/Payments-SSLCommerz-1e3a5f)

</div>

---

## Overview

AcadOS is the client for the [AcadOS API](https://github.com/mmahadi-ahmedd/AcadOS-Backend). It is built around three people who use a university every day, and each of them gets a different, role-checked experience:

| Role | Who | What they do |
|---|---|---|
| **Registrar's Office** (Admin) | Administration staff | Build the academic structure, manage accounts, raise fees, review the audit trail |
| **Faculty** (Instructor) | Teaching staff | Take attendance, set exams, enter marks, finalise grades |
| **Student** | Learners | Pay fees, enrol in courses, follow attendance, results and CGPA |

The interface has a quiet "academy" look (navy and gold, serif headings, ruled-paper details) so it reads like a university site rather than a generic dashboard.

## Try it in one click

Open the login page and use the **Demo Login** buttons, or sign in manually:

| Role | Email | Password |
|---|---|---|
| Registrar's Office | `admin@acados.com` | `Admin@123` |
| Faculty | `tanvir.instructor4@acados.com` | `Instructor@321` |
| Student | `nusrat.student4@acados.com` | `Student@321` |

## Features

### Public site
- Home, About, Services, Contact and a live **Programmes** catalogue (server-cached, filterable and paginated through the URL)
- Per-page metadata and Open Graph tags, custom 404 and global error page

### Authentication and access
- JWT sign-in with automatic token refresh
- Route protection in `proxy.ts`, plus role-aware navigation inside the app
- **Two-step registration wizard**: account details, then department, programme and intake year. Student and employee IDs are generated automatically
- Skipped the second step? A "Finish setting up your profile" card appears on the dashboard until it is done
- Signed-in header with an avatar menu (Dashboard, Profile, Sign out)

### Registrar's Office
- **Overview** with stat cards, a bar chart and an accounts-by-role donut
- **Academic setup**: departments, programmes, courses, terms and sections (create, edit, delete)
- **Manage accounts**: search, role filter, pagination, role changes, removal. All state lives in the URL
- **Fees**: generate a fee for one student or all students for a term; filter by status
- **Reports**: searchable audit trail of sensitive actions

### Faculty
- **My sections** with enrolment counts, an attendance sheet (Present, Late, Absent) and grade finalisation
- **Exams and marks**: create exams per section and enter marks with range validation
- **Teaching analytics** chart

### Student
- **My courses**: enrol and drop, with seat counts
- **Fees and payments**: pay securely through SSLCommerz. Enrolment asks for unpaid fees to be settled first
- **My progress**: attendance by course, exam results, CGPA and transcript
- **Profile** settings with validated form

## Payment flow (SSLCommerz, sandbox)

```
Student ── Pay now ──► POST /payments/initiate ──► gateway URL
                                                      │
                          SSLCommerz hosted payment page
                                                      │
          success / fail / cancel ──► /payment/{status}/[tranId]   (route handler)
                                                      │
                  confirms with the API, then 303-redirects to
                  /payment/success   or   /payment/cancel
```

Sandbox test card: `4111 1111 1111 1111`, any future expiry, CVV `111`, OTP `111111`.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js (App Router, Turbopack, Cache Components), TypeScript |
| Styling / UI | Tailwind CSS, shadcn/ui, Lucide icons |
| Server state | TanStack Query (caching, optimistic invalidation) |
| Client state | Zustand with persisted session |
| Forms | React Hook Form + Zod |
| HTTP | Axios with a refresh-token interceptor |
| Charts | Recharts |
| Notifications | Sonner |
| Payments | SSLCommerz (sandbox) |
| Hosting | Vercel |

## Architecture notes

- **Server components by default**; `"use client"` only where there is state, effects or events
- Every dashboard area has its own