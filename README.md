# Buyer Lead  App

a small app to capture, list, and manage buyer leads with sane validation, search/filter, and CSV import/export , built with Next.js, TypeScript, and SQLite.

## Features

- **Lead Management** – Effortlessly create, view, update, and delete buyer leads.  
- **Smart Search & Filters** – Quickly find leads by name, phone, or email with URL-synced filtering.  
- **Status Tracking** – Monitor lead progress from New to Converted with instant updates.  
- **CSV Import & Export** – Bulk import leads or export filtered data for easy reporting.  
- **Real-time Updates** – Experience seamless UI updates with robust error handling.  
- **Concurrency Control** – Avoid conflicts with timestamp-based locking mechanisms.  
- **Rate Limiting** – Safeguard your app with per-user/IP request limits.  
- **Responsive Design** – Enjoy a modern, mobile-friendly interface on any device.  


## Tech Stack

- **Framework** – Next.js 15 (App Router) with TypeScript  
- **Database** – SQLite powered by Drizzle ORM  
- **Validation** – Zod for both client-side and server-side validation  
- **Authentication** – Simple magic link authentication  
- **UI** – Tailwind CSS with Radix UI components  
- **Testing** – Jest and Testing Library  


##  Data Model

### Buyers (Leads)
- Personal info: `fullName`, `email`, `phone`
- Location: `city` (Chandigarh, Mohali, Zirakpur, Panchkula, Other)
- Property: `propertyType`, `bhk`, `purpose` (Buy/Rent)
- Budget: `budgetMin`, `budgetMax` (INR)
- Timeline: `0-3m`, `3-6m`, `>6m`, `Exploring`
- Source: `Website`, `Referral`, `Walk-in`, `Call`, `Other`
- Status: `New`, `Qualified`, `Contacted`, `Visited`, `Negotiation`, `Converted`, `Dropped`
- Additional: `notes`, `tags[]`, `ownerId`, `createdAt`, `updatedAt`

### Buyer History
- Tracks all changes with `diff` JSON, `changedBy`, `changedAt`

##  Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd buyer-lead-app
   ```

2. **Install dependencies**
```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   touch .env.local
   ```
   
   Configure your environment variables in `.env.local`:
   ```env
   # Database
   DATABASE_URL="file:./sqlite.db"
   
   # Auth (for production)
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Email (for magic link auth)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="your-email@gmail.com"
   ```

4. **Set up the database**
   ```bash
   # Generate migrations (if schema changes)
   npm run db:generate
   
   # Apply migrations to create tables
   npm run db:push
   
   # (Optional) Open Drizzle Studio to view data
   npm run db:studio
   ```
   
   **Note**: The database file `sqlite.db` will be created automatically on first run.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)


## 🎯 Key Features Explained

### Validation & Safety
- **Zod Validation**: Client and server-side validation with detailed error messages
- **Ownership Checks**: Users can only edit their own leads
- **Rate Limiting**: 10 creates, 20 updates per minute per user/IP
- **Concurrency Control**: Timestamp-based conflict detection

### Data & SSR
- **Real Pagination**: Server-side pagination with 10 items per page
- **URL-synced Filters**: All filters and search terms in URL
- **Debounced Search**: 300ms delay for smooth UX
- **Server Actions**: Form submissions handled server-side
- **Scroll Preservation**: Filters and pagination maintain scroll position

### Import/Export
- **CSV Import**: Max 200 rows with validation and error reporting
- **Transactional Import**: Only valid rows are inserted
- **Filtered Export**: Export respects current filters/search/sort
- **Error Handling**: Detailed row-by-row error messages

### Polish & Extras
- **Unit Tests**: Validation logic tested (phone, budget, BHK requirements)
- **Error Boundaries**: Graceful error handling with fallback UI
- **Accessibility**: Proper labels, keyboard navigation, ARIA attributes
- **Status Quick Actions**: Dropdown in table for instant status updates

## 🎯 Key Features Explained

### Validation & Safety
- **Zod Validation** – Client and server-side validation with detailed error messages.  
- **Ownership Checks** – Users can only edit their own leads.  
- **Rate Limiting** – 10 creates and 20 updates per minute per user/IP.  
- **Concurrency Control** – Timestamp-based conflict detection to prevent conflicts.  

### Data & SSR
- **Real Pagination** – Server-side pagination with 10 items per page.  
- **URL-synced Filters** – Filters and search terms are reflected in the URL.  
- **Debounced Search** – 300ms delay for a smooth user experience.  
- **Server Actions** – Form submissions handled server-side.  
- **Scroll Preservation** – Filters and pagination maintain scroll position.  

### Import & Export
- **CSV Import** – Up to 200 rows with validation and error reporting.  
- **Transactional Import** – Only valid rows are inserted; invalid rows are skipped.  
- **Filtered Export** – Exports respect current filters, search, and sorting.  
- **Error Handling** – Detailed row-by-row error messages for easy debugging.  

### Polish & Extras
- **Unit Tests** – Validation logic thoroughly tested (phone, budget, BHK requirements).  
- **Error Boundaries** – Graceful error handling with fallback UI.  
- **Accessibility** – Proper labels, keyboard navigation, and ARIA attributes.  
- **Status Quick Actions** – Dropdown in table for instant lead status updates.  


## ✅ Implementation Status

### **Core Requirements (100% Complete)**

#### **✅ Data Model**
- **Buyers Table**: All required fields implemented
- **Buyer History**: Change tracking with diff JSON
- **Relationships**: Proper foreign key constraints
- **Validation**: Comprehensive Zod schemas

#### **✅ Pages & Flows**
- **List Page**: `/buyers` with search, filters, pagination
- **Detail Page**: `/buyers/[id]` with full lead information
- **Create Page**: `/buyers/new` with comprehensive form
- **Edit Page**: `/buyers/[id]/edit` with pre-populated data
- **Auth Pages**: Login with magic link authentication

#### **✅ Ownership & Auth**
- **Read Access**: All logged-in users can read all buyers
- **Edit/Delete**: Users can only modify their own leads
- **Server Validation**: Ownership checks in all server actions
- **UI Protection**: Edit/delete buttons only for owners

#### **✅ Quality Bar**
- **Validation**: Client and server-side with Zod
- **Error Handling**: Comprehensive error boundaries
- **Rate Limiting**: 10 creates, 20 updates per minute
- **Concurrency**: Timestamp-based conflict detection
- **Accessibility**: ARIA labels, keyboard navigation
- **Testing**: Unit tests for validation logic

### **Nice-to-Have Features (2/5 Implemented)**

#### **✅ Implemented**
1. **Basic Full-Text Search**: Searches `fullName`, `phone`, `email` fields
2. **Status Quick-Actions**: Dropdown filtering in the filters section

#### **❌ Not Implemented**
1. **Tag Chips with Typeahead**: Currently simple comma-separated input
2. **Optimistic Edit with Rollback**: Standard form submission
3. **File Upload for attachmentUrl**: No file upload functionality

##  Implementation Status

### Core Requirements (100% Complete)

####  Data Model
- **Buyers Table** – All required fields implemented.  
- **Buyer History** – Change tracking with diff JSON.  
- **Relationships** – Proper foreign key constraints.  
- **Validation** – Comprehensive Zod schemas.  

#### Pages & Flows
- **List Page** – `/buyers` with search, filters, and pagination.  
- **Detail Page** – `/buyers/[id]` showing full lead information.  
- **Create Page** – `/buyers/new` with comprehensive form.  
- **Edit Page** – `/buyers/[id]/edit` with pre-populated data.  
- **Auth Pages** – Login using magic link authentication.  

####  Ownership & Auth
- **Read Access** – All logged-in users can view all buyers.  
- **Edit/Delete** – Users can only modify their own leads.  
- **Server Validation** – Ownership checks in all server actions.  
- **UI Protection** – Edit/delete buttons visible only to owners.  

####  Quality Bar
- **Validation** – Client and server-side using Zod.  
- **Error Handling** – Comprehensive error boundaries.  
- **Rate Limiting** – 10 creates, 20 updates per minute.  
- **Concurrency** – Timestamp-based conflict detection.  
- **Accessibility** – ARIA labels, keyboard navigation.  
- **Testing** – Unit tests for validation logic.  

### Nice-to-Have Features (2/5 Implemented)

####  Implemented
1. **Basic Full-Text Search** – Searches `fullName`, `phone`, `email` fields.  
2. **Status Quick-Actions** – Dropdown filtering in the filters section.  

####  Not Implemented
1. **Tag Chips with Typeahead** – Currently a simple comma-separated input.  
2. **Optimistic Edit with Rollback** – Standard form submission used.  
3. **File Upload for `attachmentUrl`** – No file upload functionality yet.  
