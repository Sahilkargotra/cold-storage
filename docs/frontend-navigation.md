# Cold Chain — Frontend Navigation & Page Connection Map

**Version:** 1.0  
**Scope:** Frontend only — how every page connects to every other page

---

## 1. Application Shell

Every page lives inside a persistent shell that never unmounts:

```
┌─────────────────────────────────────────────────────────────────────┐
│  SHELL (always present)                                             │
│                                                                     │
│  ┌──────────┐  ┌───────────────────────────────────────────────┐   │
│  │          │  │  HEADER (sticky)                              │   │
│  │          │  │  [≡ Sidebar Toggle] | [Page Title]  [Role ▼] │   │
│  │ SIDEBAR  │  ├───────────────────────────────────────────────┤   │
│  │          │  │                                               │   │
│  │ Nav items│  │           PAGE CONTENT AREA                  │   │
│  │ (role-   │  │           (swaps on navigate)                │   │
│  │ filtered)│  │                                               │   │
│  │          │  │                                               │   │
│  │ ──────── │  │                                               │   │
│  │ Footer   │  │                                               │   │
│  │ Stats    │  │                                               │   │
│  │ Theme    │  │                                               │   │
│  └──────────┘  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

**Role Switcher** (header, always visible) → switching role:
- Resets current view to that role's default landing page
- Refilters sidebar nav items to show only role-permitted pages

---

## 2. Role → Default Landing Page

```
Role Switcher
     │
     ├── Facility Manager  ──────────────►  /facility
     ├── Regional Manager  ──────────────►  /regional
     └── HQ / COO          ──────────────►  /hq
```

---

## 3. Sidebar Nav — Which Role Sees Which Pages

```
Page                  Facility Manager   Regional Manager   HQ / COO
──────────────────────────────────────────────────────────────────────
Facility Monitor         ✓                  ✓                 ✓
Regional View            ✗                  ✓                 ✓
HQ Network               ✗                  ✗                 ✓
Bookings                 ✓                  ✗                 ✗
Inspection               ✓                  ✗                 ✗
Regions                  ✗                  ✓                 ✓
Facilities               ✗                  ✓                 ✓
Zones                    ✓                  ✓                 ✓
Alerts                   ✓                  ✓                 ✓
Reports                  ✓                  ✓                 ✓
Settings                 ✓                  ✓                 ✓
```

---

## 4. Full Page Connection Map

```
                         ┌─────────────────────────────┐
                         │        ROLE SWITCHER         │
                         └──────┬──────────┬────────────┘
                                │          │
               ┌────────────────┘          └──────────────────┐
               ▼                                              ▼
         ┌──────────┐                                  ┌──────────┐
         │ /facility│◄── Facility Manager default       │/regional │◄── Regional default
         │          │                                  │          │
         │ Facility │                                  │ Regional │
         │ Dashboard│                                  │ Dashboard│
         └────┬─────┘                                  └────┬─────┘
              │                                             │
    ┌─────────┼──────────┐                    ┌────────────┼────────────┐
    │         │          │                    │            │            │
    ▼         ▼          ▼                    ▼            ▼            ▼
[Zone     [Alerts    [Reports            [Facility     [Alerts      [Transfers
 Cards]    Sheet]     link]               Cards]        link]        Queue]
    │         │                               │
    ▼         ▼                               ▼
 /zones    /alerts                        /facility
    │                                     (facility-
    ▼                                      scoped)
 /zones/:id
(Zone Detail)
    │
    └──► Back → /zones


                         ┌──────────┐
                         │   /hq    │◄── HQ / COO default
                         │          │
                         │ HQ Dash  │
                         └────┬─────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
        [Facility         [Network          [Alerts
         Cards]            Alerts]           link]
              │               │
              ▼               ▼
          /facility         /alerts
```

---

## 5. Every Page — Entry Points & Exit Points

---

### /hq — HQ Network

```
ENTRY:
  • Role switch → HQ / COO
  • Sidebar → "HQ Network"

ON THIS PAGE:
  ┌─────────────────────────────────────────────────────────┐
  │  Facility pin on map  ──────────────────► /facility     │
  │  Facility health card "View" ───────────► /facility     │
  │  Active alert row "View Zone" ──────────► /alerts       │
  │  "View All Alerts" link ────────────────► /alerts       │
  └─────────────────────────────────────────────────────────┘
```

---

### /regional — Regional / Multi-Facility View

```
ENTRY:
  • Role switch → Regional Manager
  • Sidebar → "Regional View"

ON THIS PAGE:
  ┌─────────────────────────────────────────────────────────┐
  │  Facility pin on map  ──────────────────► /facility     │
  │  Facility status row "View" ────────────► /facility     │
  │  Transfer "Approve/Reject" ─────────────► (inline, no nav) │
  │  Aging item "View Booking" ─────────────► /bookings     │
  │  "View All Alerts" ─────────────────────► /alerts       │
  └─────────────────────────────────────────────────────────┘
```

---

### /facility — Facility Dashboard

```
ENTRY:
  • Role switch → Facility Manager
  • Sidebar → "Facility Monitor"
  • /hq → click facility card or map pin
  • /regional → click facility card or map pin
  • /zones → breadcrumb "Facility"

ON THIS PAGE:
  ┌─────────────────────────────────────────────────────────┐
  │  Alert banner "Resolve" ────────────────► (inline modal, no nav) │
  │  Alert banner "View Zone" ──────────────► /zones/:id    │
  │  Zone card "View Detail" ───────────────► /zones/:id    │
  │  "View All Zones" ──────────────────────► /zones        │
  │  Compliance "Generate Report" ──────────► (inline action) │
  │  "View Reports" ────────────────────────► /reports      │
  │  Header alert bell [🔴] ────────────────► Alert Sheet (slide-in) │
  └─────────────────────────────────────────────────────────┘
```

---

### /zones — Zone List

```
ENTRY:
  • Sidebar → "Zones"
  • /facility → "View All Zones"

ON THIS PAGE:
  ┌─────────────────────────────────────────────────────────┐
  │  Zone row / card "View" ────────────────► /zones/:id    │
  │  "Back to Facility" breadcrumb ─────────► /facility     │
  └─────────────────────────────────────────────────────────┘
```

---

### /zones/:id — Zone Detail

```
ENTRY:
  • /zones → click zone row
  • /facility → "View Detail" on zone card
  • /facility → alert banner "View Zone"
  • /alerts → "View Zone" action on alert

ON THIS PAGE:
  ┌─────────────────────────────────────────────────────────┐
  │  "← Back" button ───────────────────────► /zones        │
  │  Product row "View Booking" ────────────► /bookings     │
  │  Alert history row "View Alert" ────────► /alerts       │
  └─────────────────────────────────────────────────────────┘
```

---

### /bookings — Bookings

```
ENTRY:
  • Sidebar → "Bookings" (Facility Manager only)
  • /zones/:id → product "View Booking"
  • /regional → aging inventory "View Booking"

ON THIS PAGE:
  ┌─────────────────────────────────────────────────────────┐
  │  Booking row "View Zone" ───────────────► /zones/:id    │
  │  [+ New Booking] ───────────────────────► (inline side panel) │
  │  Edit booking ──────────────────────────► (inline side panel) │
  └─────────────────────────────────────────────────────────┘
```

---

### /inspection — Periodic Inspection

```
ENTRY:
  • Sidebar → "Inspection" (Facility Manager only)

ON THIS PAGE:
  ┌─────────────────────────────────────────────────────────┐
  │  Inspection row click ──────────────────► (inline detail panel) │
  │  "View Zone" link in detail ────────────► /zones/:id    │
  │  [+ Schedule Inspection] ───────────────► (inline form, no nav) │
  └─────────────────────────────────────────────────────────┘
```

---

### /alerts — Alerts

```
ENTRY:
  • Sidebar → "Alerts"
  • /hq → "View All Alerts"
  • /regional → "View All Alerts"
  • /facility → header alert bell (sheet) → "View All"
  • /zones/:id → alert history row

ON THIS PAGE:
  ┌─────────────────────────────────────────────────────────┐
  │  Alert row "View Zone" ─────────────────► /zones/:id    │
  │  Alert row "View Facility" ─────────────► /facility     │
  │  Escalate → Regional ───────────────────► (inline, updates status) │
  │  Escalate → HQ ─────────────────────────► (inline, updates status) │
  │  "Resolve" ─────────────────────────────► (inline modal, no nav) │
  └─────────────────────────────────────────────────────────┘
```

---

### /reports — Reports

```
ENTRY:
  • Sidebar → "Reports"
  • /facility → "View Reports" link

ON THIS PAGE:
  ┌─────────────────────────────────────────────────────────┐
  │  "Generate" button ─────────────────────► (async, stays on page) │
  │  "Download" ────────────────────────────► (file download, no nav) │
  │  "Share" ───────────────────────────────► (inline share modal) │
  └─────────────────────────────────────────────────────────┘
  No outbound page navigation — self-contained.
```

---

### /regions — Regions Setup

```
ENTRY:
  • Sidebar → "Regions" (Regional, HQ)

ON THIS PAGE:
  ┌─────────────────────────────────────────────────────────┐
  │  Region row "View Facilities" ──────────► /facilities   │
  │  [+ Add Region] ────────────────────────► (inline form) │
  └─────────────────────────────────────────────────────────┘
```

---

### /facilities — Facilities Setup

```
ENTRY:
  • Sidebar → "Facilities" (Regional, HQ)
  • /regions → "View Facilities"

ON THIS PAGE:
  ┌─────────────────────────────────────────────────────────┐
  │  Facility row "View Dashboard" ─────────► /facility     │
  │  Facility row "View Zones" ─────────────► /zones        │
  │  [+ Add Facility] ──────────────────────► (inline form) │
  └─────────────────────────────────────────────────────────┘
```

---

### /settings — Settings

```
ENTRY:
  • Sidebar → "Settings" (all roles)

SUB-NAVIGATION (left sidebar tabs, no page change):
  ┌─────────────────────────────────────────────────────────┐
  │  Revenue tab ───────────────────────────► (inline content swap) │
  │  Users tab ─────────────────────────────► (inline content swap) │
  │  User Management tab ───────────────────► (inline content swap) │
  │  White Labelling tab ───────────────────► (inline content swap) │
  │  Devices tab ───────────────────────────► (inline content swap) │
  │  Products tab ──────────────────────────► (inline content swap) │
  └─────────────────────────────────────────────────────────┘

  Devices tab "View Zone" ─────────────────► /zones/:id
  No other outbound navigation from Settings.
```

---

## 6. Complete Navigation Flow Diagram

```
                    ┌──────────────────────────────────────┐
                    │           ROLE SWITCHER               │
                    └───────┬──────────┬───────────┬────────┘
                            │          │           │
                     facility       regional       hq
                            │          │           │
                            ▼          ▼           ▼
┌───────────────────────────────────────────────────────────────────────┐
│                         SIDEBAR NAV                                   │
│                                                                       │
│   /facility   /regional   /hq   /bookings   /inspection              │
│   /regions    /facilities  /zones   /alerts   /reports   /settings   │
└───────────────────────────────────────────────────────────────────────┘
         │           │          │
         │           │          │
         ▼           ▼          ▼
   ┌─────────┐ ┌──────────┐ ┌──────┐
   │/facility│ │/regional │ │ /hq  │
   └────┬────┘ └────┬─────┘ └──┬───┘
        │           │          │
     zone         facility   facility
     card          card       card
        │           │          │
        ▼           ▼          ▼
   ┌─────────────────────────────────┐
   │           /zones                │
   └──────────────┬──────────────────┘
                  │
               zone row
                  │
                  ▼
   ┌─────────────────────────────────┐
   │         /zones/:id              │
   │         (Zone Detail)           │
   └──┬──────────┬───────────────────┘
      │          │
  booking     alert
   link        link
      │          │
      ▼          ▼
 /bookings    /alerts
      │          │
   zone         zone
   link         link
      │          │
      └────┬─────┘
           ▼
       /zones/:id  (back again — deep link)


 /regions ──► /facilities ──► /facility ──► /zones ──► /zones/:id

 /alerts ──────────────────────────────────► /zones/:id
         ──────────────────────────────────► /facility

 /inspection ──────────────────────────────► /zones/:id

 /settings (self-contained, tab switching only)
   └── devices tab ────────────────────────► /zones/:id
```

---

## 7. Inline Actions vs Page Navigations

Some interactions stay on the current page (modals, panels, sheets). This table clarifies what goes where:

| Interaction | Behaviour |
|---|---|
| Create / Edit Booking | Inline side panel on `/bookings` |
| Resolve Alert | Inline modal (no nav) |
| Escalate Alert | Inline state update (no nav) |
| Generate Report | Async action on `/reports` (no nav) |
| Schedule Inspection | Inline form on `/inspection` |
| Inspection detail | Inline expand panel on `/inspection` |
| Invite User (Settings) | Inline Dialog on `/settings` |
| Add Device (Settings) | Inline Dialog on `/settings` |
| Add Product (Settings) | Inline Dialog on `/settings` |
| Facility Alert Bell | Slide-in Sheet (overlay, no nav) |
| View All Alerts from Sheet | Navigates → `/alerts` |
| Zone threshold edit | Inline edit on `/zones/:id` |
| Transfer approve/reject | Inline on `/regional` (no nav) |

---

## 8. Back Navigation Rules

| From | Back goes to |
|---|---|
| `/zones/:id` | `/zones` |
| `/zones` | `/facility` (breadcrumb) |
| `/facilities` | `/regions` (breadcrumb, if entered from there) |
| All other pages | No back — sidebar nav used instead |

---

## 9. Deep Link Entry Points

Pages that can be entered from multiple sources (important for BE auth scoping):

| Page | Can be entered from |
|---|---|
| `/facility` | Sidebar · `/hq` · `/regional` · `/facilities` |
| `/zones` | Sidebar · `/facility` · `/facilities` |
| `/zones/:id` | `/zones` · `/facility` · `/alerts` · `/inspection` · `/bookings` |
| `/alerts` | Sidebar · `/hq` · `/regional` · `/facility` (alert sheet) |
| `/bookings` | Sidebar · `/zones/:id` · `/regional` |
