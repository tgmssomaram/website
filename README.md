# TGMS Somaram | Telangana Model School & Junior College
> **తెలంగాణ మోడల్ స్కూల్ & జూనియర్ కళాశాల, సోమారం**  
> Somaram (Village), Saidapur Mandal, Karimnagar District, Telangana – 505490  
> UDISE+ Code: `36131100206` | College Code: `15124`

Official web portal and administrative management platform for **Telangana Model School & Junior College, Somaram**, built for deployment on **Vercel** with **Supabase** as the database.

---

## 📁 Clean & Professional Project Architecture

```
tgms-somaram/
├── api/                       # Vercel Serverless Functions (Supabase Backend)
│   ├── lib/
│   │   └── supabase.js        # Supabase client initializer & config helper
│   ├── admin/
│   │   ├── login.js           # Admin authentication handler
│   │   ├── session.js         # Admin session verification
│   │   └── enrollment-ui.js   # Admin UI integration
│   ├── content.js             # GET/PUT school profile with Supabase & fallback
│   ├── feedback.js            # POST contact & admission inquiries to Supabase
│   ├── notices.js             # GET/POST flash news & announcements
│   └── privacy-ui.js          # School privacy policies
├── css/                       # Modular Stylesheets
│   ├── style.css              # Core typography and branding
│   ├── admission-seats.css    # Seat breakdown matrix styling
│   ├── final-model-centered-22.css # Campus hero & navigation styling
│   ├── school-sections.css    # Facilities & academic components
│   └── ... (22 modular CSS files)
├── data/                      # Educational & School Datasets
│   ├── school-data.json       # Core school profile, faculty & contacts
│   ├── academic-calendar.json # 2026–27 academic schedule
│   ├── books.json             # Downloadable textbooks (Classes VI–XII)
│   ├── home-banners.json      # Learning platform cards (Khan Academy, PW)
│   ├── learning-resources.json# Curated educational links
│   ├── neet-papers.json       # Competitive exam papers
│   └── school-directory.json  # Directory of 194 Telangana Model Schools
├── images/                    # Official Emblems, Dignitaries & Visual Media
│   ├── telangana-emblem-trimmed.svg
│   ├── rmsa-logo-trimmed.svg
│   ├── cm-revanth-reddy.png
│   └── ... (school activity photos & campus imagery)
├── js/                        # Client-Side Application Modules
│   ├── app.js                 # SPA routing and multi-language controller
│   ├── features-news-15.js    # News ticker, maps & academic pages
│   ├── final-model-mandal-20.js # Mandal branding & hero components
│   ├── school-footer.js       # Official footer & policy modals
│   └── ... (interactive widgets & UI helpers)
├── index.html                 # Main website entry point
├── vercel.json                # Vercel deployment & routing configuration
├── package.json               # Node.js project definition & @supabase/supabase-js
├── supabase_schema.sql        # Complete Supabase database schema & seed data
├── .env.example               # Environment variables template
├── robots.txt                 # SEO crawler rules
├── sitemap.xml                # Search engine sitemap
├── manifest.json              # Web app manifest
└── .gitignore                 # Git ignore configuration
```

---

## 🗄️ Supabase Setup (Database)

1. Create a free project at [supabase.com](https://supabase.com/).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open the file [supabase_schema.sql](supabase_schema.sql), copy its contents, paste them into the SQL editor, and click **Run**.
4. This script automatically creates:
   - `school_profiles` — Stores school content, principal details, faculty, and coordinates.
   - `notices` — Stores flash news, circulars, and announcements.
   - `feedback` — Receives contact messages and admission inquiries.
   - `admin_users` — Manages administrator credentials.
   - Pre-seeds the database with Somaram's verified school data!
5. In your Supabase Dashboard, go to **Project Settings** > **API** and copy:
   - **Project URL**
   - **anon / public key**
   - **service_role key** (secret)

---

## ▲ Deploying to Vercel

### Step 1: Push & Import
1. Push this repository to your GitHub account (`tgmssomaram/website`).
2. Go to [vercel.com](https://vercel.com/) and click **Add New** > **Project**.
3. Import the `tgmssomaram/website` repository.

### Step 2: Configure Environment Variables
In the Vercel project configuration, add the following Environment Variables (from your `.env`):
* `SUPABASE_URL` = `https://your-project.supabase.co`
* `SUPABASE_ANON_KEY` = `your-anon-key`
* `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`
* `ADMIN_EMAIL` = `tgmssomaram.knr@gmail.com`
* `ADMIN_PASSWORD` = `your-chosen-admin-password`

### Step 3: Deploy
Click **Deploy**. Your website will be live worldwide on Vercel with high-speed CDN caching and serverless API endpoints connected to your Supabase database!

---

## 🔐 Next Phase: Admin Login & Management Features

The backend API is pre-wired for admin features:
* `/api/admin/login` — Authenticates against Supabase or environment credentials.
* `/api/admin/session` — Manages HTTP-only session cookies.
* `/api/content` — Allows administrators to edit school details, staff, and photos directly from the browser.
* `/api/notices` — Allows publishing and managing flash news ticker items in real-time.
