# Mini “Buyer Lead Intake” App

A small app to **capture, list, and manage buyer leads** with validation, search/filter, and CSV import/export.

---

## Stack

- **Framework:** Next.js (App Router) + TypeScript  
- **Database:** SQLite + Drizzle ORM (with migrations)  
- **Validation:** Zod (client + server)  
- **Auth:** Magic link authentication  
- **Testing:** Jest + Testing Library  

---

## Quick Start

### Prerequisites
- Node.js 18+  
- npm / yarn / pnpm  

### Setup
```bash
git clone <your-repo-url>
cd buyer-lead-app
npm install
cp .env.example .env.local
# update DB, email, auth secrets
npm run db:push
npm run dev
## Data Model

### buyers
- `id` (uuid)  
- `fullName` (string, 2–80)  
- `email` (email, optional)  
- `phone` (string, 10–15; required)  
- `city` (`Chandigarh|Mohali|Zirakpur|Panchkula|Other`)  
- `propertyType` (`Apartment|Villa|Plot|Office|Retail`)  
- `bhk` (`1|2|3|4|Studio`; required if Apartment/Villa)  
- `purpose` (`Buy|Rent`)  
- `budgetMin` (int, optional)  
- `budgetMax` (int, optional, must ≥ `budgetMin`)  
- `timeline` (`0-3m|3-6m|>6m|Exploring`)  
- `source` (`Website|Referral|Walk-in|Call|Other`)  
- `status` (`New|Qualified|Contacted|Visited|Negotiation|Converted|Dropped`, default `New`)  
- `notes` (optional, ≤ 1000 chars)  
- `tags[]` (optional)  
- `ownerId` (user id)  
- `updatedAt` (timestamp)  

### buyer_history
- `id`  
- `buyerId`  
- `changedBy`  
- `changedAt`  
- `diff` (JSON of changed fields)  

---

## Pages & Flows

### 1) Create Lead – `/buyers/new`
- Fields: `fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags[]`  
- Validation: fullName ≥ 2, phone 10–15 digits, email valid if provided, budgetMax ≥ budgetMin, bhk required for Apartment/Villa  
- On submit: create record, assign `ownerId`, write history entry  

### 2) List & Search – `/buyers`
- SSR with pagination (10/page)  
- URL-synced filters: `city, propertyType, status, timeline`  
- Debounced search by `fullName|phone|email`  
- Sort: default `updatedAt` desc  
- Columns: Name, Phone, City, PropertyType, Budget, Timeline, Status, UpdatedAt  
- Row actions: View / Edit  

### 3) View & Edit – `/buyers/[id]`
- Edit with same validation rules  
- Concurrency: check `updatedAt` to prevent conflicts  
- Show last 5 changes from `buyer_history`  

### 4) Import / Export
- CSV import (max 200 rows) with validation and transaction  
- CSV export respects current filters/search/sort  

---

## Ownership & Auth
- Read: anyone logged in  
- Edit/Delete: only owner (`ownerId`)  
- Optional: admin can edit all  

---

## Nice-to-Haves Implemented
- Status quick-actions in table  
- Basic full-text search on `fullName,email,notes`  

---

## Quality Bar
- Unit test for CSV/budget validator  
- Rate limit on create/update  
- Error boundary + empty state  
- Accessibility basics  

---


---

## Scripts
- `npm run dev` → Dev server  
- `npm run build` → Build for production  
- `npm run start` → Start prod server  
- `npm run db:push` → Apply schema  
- `npm run test` → Run tests  

---

## Design Notes
- Validation: Zod in `src/lib/validations/buyer.ts`  
- SSR for list page; client for forms  
- Ownership enforced at UI + server + API  
- CSV import transactional; errors shown per row  

---

## Done vs Skipped
**Done:** CRUD, filters/search, URL sync, CSV import/export, concurrency checks, validation, basic accessibility  
**Skipped:** File upload, advanced typeahead tags, optimistic rollback (optional nice-to-haves)  
