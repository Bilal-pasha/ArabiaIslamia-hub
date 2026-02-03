# Main Website – Jamia Arabia Islamia

Next.js 16 main marketing website for Jamia Arabia Islamia (Scout Colony). Built with the same tech stack as the arabiaIslamia monorepo: **Next.js**, **Tailwind CSS v4**, **shadcn-style UI** (`@arabiaaislamia/ui`), **framer-motion** (`@arabiaaislamia/animations`), **react-hook-form**, and **zod**.

## Architecture

- **Atomic design**: components are split into:
  - **atoms**: Logo, Button, Input, Label, Card, Badge (from shared UI package)
  - **molecules**: NavLink, NavDropdown, FacultyCard, StatCard, NewsCard, FormField
  - **organisms**: Navbar, Footer, HeroCarousel, WhiteSection, FacultiesSection, StatisticSection, NewsSection, DonateFormSection
  - **templates**: MainLayout (Navbar + main + Footer)

- **Routes** (App Router):
  - `/` – Home (hero, white section, faculties, statistics, news, donate form)
  - `/about` – About (hero, who we are, map, news)
  - `/contact` – Contact + donate form
  - `/faculties` – Faculties (Tahfeez, Darse Nizami, Mahad ul Arabia, Schooling System)
  - `/more` – More (Admissions, Scholarships, Downloads, Results)
  - `/forms` – Embedded Google Form (Scouts Camping Registration)

## Run

From monorepo root:

```bash
pnpm install
pnpm --filter main-website dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Assets

Images are in `public/images/` (copied from the original Arabia-Website `src/Assets`). Update paths in components and `app/globals.css` if you add or move assets.
