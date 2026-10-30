# Mintesnot Leliso — Bio-Digital Atelier & Content Management System

A bespoke, editorial portfolio website and private administration dashboard for **Mintesnot Leliso** (*Medicine × Design × Technology*).

Reimagined with a **"Clinical-Meets-Creative"** design language: architectural specimen grids, precision metadata indexing, smart multi-image collages, fluid typography, real-time telemetry, and a secure content management system.

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and a flexible **Supabase / Local Data Layer** with instant ISR on-demand revalidation.

---

## 🌟 Creative Concept & Distinctive Features

1. **"Medicine × Design × Technology" Visual Language**:
   - Technical specimen stamps (`[SPECIMEN-01]`, `[MD-01]`, `[DS-02]`), coordinate marks, and crosshair corners (`+`) reflecting surgical precision and creative mastery.
   - Microscopic architectural dot grid background with high contrast readability.
   - **Live Addis Ababa Time Chip**: Real-time heartbeat indicator and local clock (`GMT+3`).
   - **Reading Scroll Progress Bar**: Gradient indicator tracking article depth.
   - **Custom Precision Cursor**: Smooth trailing ring with magnetic interaction (desktop only, hidden on touch screens).

2. **Smart Multi-Image Collages**:
   - Single image projects display in a framed hero exhibition tile.
   - **Multi-image projects automatically compose into polished editorial collages**:
     - **2 Images**: 50/50 Dual comparison split.
     - **3 Images**: 1 Prominent hero tile + 2 stacked companion tiles.
     - **4 Images**: 2×2 Balanced grid collage.
     - **5–6 Images**: Bento mosaic arrangement.
     - **7+ Images**: Mosaic with an interactive `+N` view-all badge.
   - **Immersive Project Lightbox**: Fullscreen modal with hero spotlight, interactive gallery thumbnail strip, deep linking (`?project=proj-id`), keyboard navigation (Arrow keys, Esc), and touch swipe gestures.

3. **Command Palette (`⌘K` / `Ctrl+K`)**:
   - Jump to any section, filter portfolio categories, toggle Day/Night theme, copy your email address, or download the CV.

4. **100% Private & Hidden Admin Dashboard (`/admin`)**:
   - **Zero Public Visibility**: No public "Add", "Edit", or "Delete" buttons. No "Admin" link anywhere in the public header or footer.
   - **Route Protection**: Next.js `middleware.ts` guards all `/admin` routes with cryptographically signed JWT cookies (`admin_session`).
   - **Brute-Force Rate Limiting**: Max 5 login attempts per 15 minutes.
   - **Multi-Image Collage Composer in Admin**: Upload multiple images, add image URLs, reorder collage tiles, set cover photos, choose collage layout modes (`Auto`, `Split`, `Grid`, `Bento`, `Mosaic`), and view a **live collage preview** right in the editor!
   - **Privacy-Friendly Visitor Telemetry**: View specimen impression stats and traffic referral channels.

5. **Strict Content Preservation**:
   - 100% of all original headings, project descriptions, roles, certificates, education history, skills, theological citation (*Colossians 3:17*), stats, contact details, and links have been preserved without any rewriting.

---

## 📁 Repository Architecture

```text
mntsnt.github.io/
├── public/
│   ├── doc/resume-mntsnt.pdf       # Verified downloadable CV
│   ├── img/                        # All 26 original project assets & certificates
│   └── uploads/                    # Assets uploaded via admin
├── src/
│   ├── app/
│   │   ├── admin/                  # Secure private dashboard & login
│   │   │   ├── login/page.tsx      # Minimal login screen with rate limit
│   │   │   ├── page.tsx            # Protected dashboard server wrapper
│   │   │   └── AdminDashboardClient.tsx # Full dashboard client + collage composer
│   │   ├── api/
│   │   │   ├── admin/auth/         # Secure session login & logout
│   │   │   ├── admin/portfolio/    # Portfolio CRUD + instant ISR revalidation
│   │   │   ├── admin/upload/       # Multi-asset file upload handler
│   │   │   ├── admin/messages/     # Inbound message inbox API
│   │   │   └── contact/            # Contact form endpoint (honeypot + Formspree/Resend)
│   │   ├── globals.css             # Architectural tokens, fonts, crosshairs
│   │   ├── layout.tsx              # Root layout, theme script, JSON-LD, custom cursor
│   │   ├── page.tsx                # Homepage (Server Component + ISR)
│   │   ├── robots.ts               # Robots.txt (blocks /admin from search engines)
│   │   └── sitemap.ts              # Sitemap generator
│   ├── components/
│   │   ├── CommandPalette.tsx      # Cmd+K quick launcher modal
│   │   ├── CustomCursor.tsx        # Trailing desktop cursor with spring physics
│   │   ├── Header.tsx              # Sticky header with Addis Ababa clock & scroll progress
│   │   ├── Footer.tsx              # Refined footer with return-to-summit button
│   │   ├── SmartCollage.tsx        # Dynamic multi-image collage renderer
│   │   ├── ThemeToggle.tsx         # Sun / Moon icon toggle
│   │   ├── ThemeProvider.tsx       # Zero-flash theme context
│   │   └── sections/
│   │       ├── Hero.tsx            # 01 Kinetic identity
│   │       ├── About.tsx           # 02 Caliper frame, story, illuminated Colossians 3:17
│   │       ├── Practice.tsx        # 03 Interactive trio (Design, Build, Medicine)
│   │       ├── Currently.tsx       # 04 Live telemetry dashboard
│   │       ├── Work.tsx            # 05 Smart collages + filter + immersive viewer
│   │       ├── Certificates.tsx    # 06 Verified credential deck + PDF preview
│   │       ├── Lab.tsx             # 07 Bio-digital experiments
│   │       ├── Education.tsx       # 08 Academic chronology + CV dossier
│   │       ├── Skills.tsx          # 09 Capability pods matrix
│   │       ├── Contact.tsx         # 10 Consultation terminal
│   │       └── CustomSections.tsx  # Dynamic custom sections
│   ├── data/
│   │   └── initialData.ts          # Seed data with all 26 projects
│   ├── lib/
│   │   ├── auth.ts                 # JWT signing, verification & rate limiting
│   │   ├── db.ts                   # Hybrid DB layer (Supabase + Local fallback)
│   │   └── supabase/               # Supabase client helpers
│   └── types/
│       └── portfolio.ts            # Complete TypeScript schema
├── supabase/
│   └── migrations/20261030_init.sql # SQL migration for Supabase Postgres & Storage
├── legacy/                         # Backup of original static HTML/CSS
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Default credentials in `.env.local`:
- **Admin Email**: `mintesnoh@gmail.com`
- **Admin Password**: `mintesnot2026!` *(Change this in your `.env.local`)*

### 3. Start local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 How to Use the Private Admin Dashboard (`/admin`)

The admin dashboard is completely inaccessible to the general public. To manage your site:

1. Navigate directly to: `http://localhost:3000/admin` (or `https://your-domain.com/admin`).
2. Log in with your email and password.

### Adding a Multi-Image Project (Smart Collage)
1. In `/admin`, click the **Projects** tab.
2. Click **+ Add Project** or edit an existing one.
3. In the **Specimen Images Gallery** section:
   - Click **Upload File** to upload image files from your computer or phone.
   - Or paste an existing URL / path (e.g. `/img/summer camp.png`) and click **Add URL**.
   - As you add images, the **Live Collage Tile Preview** updates immediately!
   - Select your preferred layout mode (`Auto`, `Split`, `Grid`, `Bento`, or `Mosaic`).
4. Enter the Project Full Title, Card Display Title, Category Label, Role, Badge (`NEW` / `1st place`), and Description.
5. Click **Save Specimen**, then click **Save All** in the top bar. Changes appear on the live site within seconds!

### Adding or Updating Certificates
1. In `/admin`, click the **Certificates** tab.
2. Click **+ Add Certificate** or modify existing records.
3. Fill in the Title, Issuer, and Year, and click **Upload PDF** to attach your PDF document.
4. On the live site, clicking a certificate opens an in-page PDF inspector with a direct download button.

### Managing Skills, Education & CV
- **Skills**: Update group names and items (`Design`, `Development`, `Workflow`, `Learning`).
- **Education**: Add degrees or program timeline entries (`In progress` / `Completed`).
- **CV**: Click **Upload New CV** in the Education tab to replace `/doc/resume-mntsnt.pdf`.

### Adding Custom Sections
If you want to add an entirely new section to the site (e.g. "Research Papers", "Exhibitions", or "Volunteering"):
1. Click the **Custom Sections** tab.
2. Click **+ Add Section**.
3. Name your section and add items with optional images and external links.
4. It will automatically render on the public site!

### Inbound Inquiries Inbox
- Any transmission submitted through the consultation terminal is recorded under the **Inquiries** tab.
- Click **Reply via Email** to launch your email client pre-addressed with the subject line.
- Mark transmissions as read or delete them when completed.

---

## ☁️ Deployment to Vercel

1. Commit and push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Completely reimagine portfolio with clinical-meets-creative design and smart collages"
   git push origin main
   ```
2. In your [Vercel Dashboard](https://vercel.com):
   - Go to your project settings (`mintesnot-leliso`).
   - Under **Settings > Environment Variables**, add:
     - `ADMIN_EMAIL`: `mintesnoh@gmail.com`
     - `ADMIN_PASSWORD`: `<your-secure-password>`
     - `AUTH_SECRET`: `<any-random-32-character-secret>`
     - `NEXT_PUBLIC_SITE_URL`: `https://mintesnot-leliso.vercel.app`
     - `FORMSPREE_ENDPOINT`: `https://formspree.io/f/xzzrnwrk` (or set `RESEND_API_KEY`)
   - (Optional) If connecting **Supabase**: Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. Run the SQL script from `supabase/migrations/20261030_init.sql` in the Supabase SQL editor.
3. Vercel will trigger a build and deploy automatically.

---

## 📄 License
This project is for personal use by Mintesnot Leliso. All rights reserved.
