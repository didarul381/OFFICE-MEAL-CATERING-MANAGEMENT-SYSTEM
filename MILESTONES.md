# Office Meal & Catering Management System — Milestones Tracker

This tracking document maintains the exact status of all 10 project milestones. Whenever a milestone is signed off, its checkboxes and status are marked as complete (`[x]`).

---

## Progress Overview

| Milestone | Title | Status | Completion Date |
| :--- | :--- | :---: | :---: |
| **M01** | [Foundation + Auth + Vendor Profile](#milestone-01-foundation--auth--vendor-profile) | **COMPLETED** | Oct 06, 2026 |
| **M02** | [Client / Organization Management](#milestone-02-client--organization-management) | **COMPLETED** | Oct 06, 2026 |
| **M03** | [Employee Management + Bulk CSV Import](#milestone-03-employee-management--bulk-csv-import) | **COMPLETED** | Oct 06, 2026 |
| **M04** | [Menu + Pricing Management](#milestone-04-menu--pricing-management) | **COMPLETED** | Oct 06, 2026 |
| **M05** | [Daily Meal Management](#milestone-05-daily-meal-management) | PENDING | — |
| **M06** | [Order + Rider + Delivery Management](#milestone-06-order--rider--delivery-management) | PENDING | — |
| **M07** | [Billing + Payments](#milestone-07-billing--payments) | PENDING | — |
| **M08** | [Reporting + Analytics](#milestone-08-reporting--analytics) | PENDING | — |
| **M09** | [Settings + Activity Log + System Polish](#milestone-09-settings--activity-log--system-polish) | PENDING | — |
| **M10** | [Final QA + Production Readiness](#milestone-10-final-qa--production-readiness) | PENDING | — |

---

### Milestone 01: Foundation + Auth + Vendor Profile
- [x] Modern application layout (sidebar, mobile header, drawer navigation, flash toasts)
- [x] User roles: `vendor_admin`, `vendor_staff`, `client_admin`, `rider`
- [x] Vendor Profile schema & model (`business_name`, `owner_name`, `phone`, `email`, `address`, `currency`, `service_time_lunch`, `service_time_dinner`, etc.)
- [x] Profile Controller with tabbed interface (Business Info, Operations, Billing Defaults)
- [x] Automated role enforcement middleware (`EnsureUserRole`)
- [x] Seeders for vendor credentials (`admin@officemeal.com`)
- [x] Automated tests passing

---

### Milestone 02: Client / Organization Management
- [x] Client schema & model (`clients` table with contact, cutoff times, address, employee counts, meal types, billing terms)
- [x] Client CRUD (Index, Create, Edit, Show)
- [x] Client isolation policies (`ClientPolicy`)
- [x] Client Admin user creation & role assignment linked to `client_id`
- [x] Client overview page with stats, recent contacts, and meal summaries
- [x] Desktop data table & mobile-first card views
- [x] Automated tests passing

---

### Milestone 03: Employee Management + Bulk CSV Import
- [x] Employee schema & model (`employees` table with `unique(client_id, employee_id)`)
- [x] Employee CRUD (Index, Create, Edit, Show, Toggle Active Status)
- [x] Multi-criteria filtering (search, client, department, meal preferences: Standard, Vegetarian, Halal, Non-Veg, Custom)
- [x] Shift toggles (Lunch enabled, Dinner enabled) & dietary constraint notes
- [x] Organization-level isolation (Client Admin only manages own employees; Vendor Admin manages all)
- [x] Bulk CSV Import modal with drag-and-drop, sample template download (`employees.sample-csv`), duplicate detection, and row-level error reporting
- [x] Client total employee count sync
- [x] Automated tests passing (65/65 suite passing)

---

### Milestone 04: Menu + Pricing Management
- [x] Menu Items schema & model (`menu_items` with item name, category, description, default price, status, image/icon)
- [x] Menu Categories (Main Course, Side Dish, Protein, Beverage, Dessert, Other)
- [x] Client-Specific Pricing schema & model (`client_menu_prices` with client_id, menu_item_id and client package rates)
- [x] Daily Menu schema & model (`daily_menus` and `daily_menu_items` with date, meal_type: Lunch / Dinner, items, price override)
- [x] Daily Menu duplicate/copy feature (duplicate previous day or template menu)
- [x] Menu Item CRUD & active/inactive toggle
- [x] Client Pricing matrix management (configure custom rate per client e.g. Client A Lunch = ৳120, Client B Lunch = ৳130)
- [x] Daily Menu calendar / date picker view
- [x] Client-specific pricing calculation verification tests (`PricingService`)
- [x] Automated tests passing (81/81 full suite passing) & responsive UI check

---

### Milestone 05: Daily Meal Management
- [ ] Daily meal entry interface (Date, Client, Meal Type: Lunch / Dinner)
- [ ] Simple YES/NO / Present/Not Required toggle per employee
- [ ] Bulk actions (Select All, Unselect All, Mark All Lunch, Mark All Dinner, Clear All)
- [ ] Automatic real-time quantity & financial calculation (Count × Client-specific price)
- [ ] Meal Cutoff enforcement (Lunch cutoff time, Dinner cutoff time, Vendor Admin override)
- [ ] Meal calendar view & meal history filters
- [ ] Mobile-first large touch target experience
- [ ] Duplicate meal entry prevention

---

### Milestone 06: Order + Rider + Delivery Management
- [ ] Automatic order generation upon meal confirmation
- [ ] Order schema & model (`orders` with order_number, client_id, date, meal_type, quantity, amount, status, rider_id, delivery_address)
- [ ] Order lifecycle statuses (Pending → Confirmed → Preparing → Ready → Assigned → Picked Up → On The Way → Delivered → Cancelled)
- [ ] Rider Management CRUD (`riders` table with phone, vehicle details, status)
- [ ] Rider assignment workflow
- [ ] Dedicated Rider mobile view (only assigned deliveries, addresses, meal quantities, no financial/other client data)
- [ ] Automated delivery status transition tests

---

### Milestone 07: Billing + Payments
- [ ] Billing calculation engine (Total meals consumed × Client-specific price)
- [ ] Bills schema & model (`bills` table with client_id, billing_period, total_meals, total_amount, paid_amount, due_amount, status)
- [ ] Payment recording (`payments` with date, amount, method: Cash, Bank, bKash, Nagad, reference, note)
- [ ] Partial payments, full settlement, due amount tracking
- [ ] Client billing statement view (balance, paid, due, history)
- [ ] Database transactions for financial safety & calculation tests

---

### Milestone 08: Reporting + Analytics
- [ ] One-click Daily Report (client breakdown, lunch/dinner count, revenue, delivery status)
- [ ] Monthly Report (monthly meals, revenue, paid, due)
- [ ] Client Report & Employee Report
- [ ] Menu Item popularity report & Rider performance report
- [ ] PDF & CSV/Excel export support
- [ ] Clean visual trend charts (meal consumption trend, client distribution)

---

### Milestone 09: Settings + Activity Log + System Polish
- [ ] Business settings & meal cutoffs configuration
- [ ] Activity log tracking (user, action, module, record, timestamp, IP)
- [ ] Security audit (CSRF, authorization, SQL injection, XSS, rate limiting)
- [ ] Query optimization (eager loading, N+1 fix, pagination, indexing)
- [ ] Comprehensive responsive viewport audit (320px, 375px, 390px, 430px, tablet, desktop)

---

### Milestone 10: Final QA + Production Readiness
- [ ] End-to-end multi-role functional QA
- [ ] Strict client data isolation verification
- [ ] Mathematical calculations audit (meals × rate = total, paid + due = total)
- [ ] Custom friendly error pages (403, 404, 419, 422, 500)
- [ ] Empty states & loading feedback across all forms/tables
- [ ] Dead code / console log cleanup & production build verification
