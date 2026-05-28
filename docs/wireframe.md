# Cold Chain Monitoring — Full Stack Wireframe

**Version:** 1.0  
**Scope:** Frontend screens · Data flows · API contracts · BE entity model

---

## 1. Entity Hierarchy (Single Table, Type-Discriminated)

```
HQ  (type: hq)
 └── Region  (type: region, parent_id → HQ)
      └── Facility  (type: facility, parent_id → Region)
           └── Zone  (type: zone, parent_id → Facility)
```

### 1.1 Core Entity Table

```
entities
───────────────────────────────────────────────
id            UUID  PK
type          ENUM  hq | region | facility | zone
name          TEXT
parent_id     UUID  FK → entities.id  (NULL for HQ)
created_at    TIMESTAMPTZ
updated_at    TIMESTAMPTZ
```

### 1.2 Type-Specific Metadata (separate tables, joined on demand)

```
facility_meta
───────────────────────────────────────
entity_id       UUID FK → entities.id
location        TEXT
latitude        FLOAT
longitude       FLOAT
total_capacity  FLOAT  (tonnes)
license_number  TEXT
contact_name    TEXT
contact_phone   TEXT

zone_meta
───────────────────────────────────────
entity_id          UUID FK → entities.id
zone_type          ENUM  ambient | chill | frozen | processing
capacity           FLOAT  (tonnes)
temp_target        FLOAT
temp_min           FLOAT
temp_max           FLOAT
humidity_target    FLOAT
nh3_threshold_ppm  FLOAT
```

### 1.3 Create Payload (with children)

```json
POST /api/v1/entities
{
  "type": "facility",
  "name": "Chennai Cold Storage",
  "parent_id": "region-uuid",
  "meta": {
    "location": "Chennai, TN",
    "latitude": 13.0827,
    "longitude": 80.2707,
    "total_capacity": 500
  },
  "children": [
    {
      "type": "zone",
      "name": "Zone A – Chilled",
      "meta": {
        "zone_type": "chill",
        "capacity": 120,
        "temp_target": 3,
        "temp_min": 0,
        "temp_max": 5
      }
    },
    {
      "type": "zone",
      "name": "Zone B – Frozen",
      "meta": {
        "zone_type": "frozen",
        "capacity": 200,
        "temp_target": -18,
        "temp_min": -22,
        "temp_max": -15
      }
    }
  ]
}
```

---

## 2. Frontend Screen Map

```
App
├── /hq                      → HQ Dashboard
├── /regional                → Regional / Multi-Facility View
├── /facility                → Facility Dashboard
│    └── /zones              → Zone List
│         └── /zones/:id     → Zone Detail
├── /bookings                → Bookings (CRUD)
├── /inspection              → Inspection Workflow
├── /alerts                  → Notification / Alert Feed
├── /reports                 → Reports
└── /settings
     ├── revenue             → Revenue Analytics
     ├── users               → Team Members
     ├── user-management     → Roles & Permissions
     ├── white-labelling     → Brand Config
     ├── devices             → Device Registry
     └── products            → Product Catalog
```

---

## 3. Screen-by-Screen Wireframe

---

### 3.1 HQ Dashboard  `/hq`

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER: HQ Network  ·  Role: HQ / COO  ·  [Role Switcher]      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [KPI Strip — 4 cards]                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Capacity  │ │Shrinkage │ │Energy    │ │Compliance│           │
│  │Used 78%  │ │Loss 1.9% │ │₹1,850/T  │ │94%       │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                  │
│  [Network Map]  ──────────────  [Facility Health List]          │
│  ┌──────────────────────┐       ┌────────────────────────┐      │
│  │ MapLibre             │       │ Chennai    ████ 94%     │      │
│  │ · Facility pins      │       │ Bangalore  ███  88%     │      │
│  │ · Color = health     │       │ Hyderabad  ██   71%     │      │
│  │ · Click → /facility  │       │ Mumbai     █    52% ⚠   │      │
│  └──────────────────────┘       └────────────────────────┘      │
│                                                                  │
│  [Active Network Alerts]                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🔴 Mumbai Facility — Compressor Fault  ₹1.2L at risk     │   │
│  │ 🟡 Hyderabad — Door Open > 10min       ₹40K at risk      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Facility Cards Grid — 2 col]                                   │
│  ┌───────────────────────┐ ┌───────────────────────┐            │
│  │ Chennai               │ │ Bangalore             │            │
│  │ Capacity: 78%         │ │ Capacity: 65%         │            │
│  │ Temp OK · Alerts: 1   │ │ Temp OK · Alerts: 0   │            │
│  │ Revenue: ₹2.4L/day    │ │ Revenue: ₹1.8L/day    │            │
│  └───────────────────────┘ └───────────────────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

**API calls this screen makes:**

| Data | Endpoint | Notes |
|------|----------|-------|
| KPI strip | `GET /api/v1/entities?type=hq&include=stats` | Aggregated from all children |
| Map pins | `GET /api/v1/entities?type=facility&include=location,health` | Lat/lng + health score |
| Facility health list | `GET /api/v1/entities?type=facility&include=health,alerts` | Sorted by health score |
| Active alerts | `GET /api/v1/notifications?scope=hq&status=active` | Top 5 critical |
| Facility cards | `GET /api/v1/entities?type=facility&include=stats,alerts` | Full card data |

---

### 3.2 Regional / Multi-Facility View  `/regional`

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER: Regional View  ·  South India Region                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [KPI Strip — 4 cards]                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Facilities│ │Total Cap │ │Avg Occup │ │Alerts    │           │
│  │4 Active  │ │1,200T    │ │82%       │ │3 Critical│           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                  │
│  [Regional Map]  ─────────────  [Facility Status List]          │
│  ┌──────────────────────┐       ┌────────────────────────┐      │
│  │ MapLibre             │       │ Rank  Facility  Score  │      │
│  │ Region-scoped pins   │       │  1    Chennai   94%    │      │
│  │ Heatmap overlay      │       │  2    Coimbatore 88%   │      │
│  └──────────────────────┘       │  3    Kochi     76%    │      │
│                                 │  4    Bengaluru 61% ⚠  │      │
│                                 └────────────────────────┘      │
│                                                                  │
│  [Cross-Facility Transfer Queue]                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ AI Suggestion: Move 5T Mangoes Chennai→Bengaluru ₹40K    │   │
│  │ [Approve] [Reject]                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Aging Inventory Alerts]  ──  [Demand Forecast]                │
│  ┌────────────────────────┐    ┌──────────────────────────┐     │
│  │ Potato 90 days → exp   │    │ Mango demand ↑ Chennai   │     │
│  │ Milk 2 days → exp      │    │ Potato surplus → transfer│     │
│  └────────────────────────┘    └──────────────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

**API calls this screen makes:**

| Data | Endpoint | Notes |
|------|----------|-------|
| KPI strip | `GET /api/v1/entities?type=region&id=:regionId&include=stats` | |
| Facility list + ranks | `GET /api/v1/entities?type=facility&parent_id=:regionId&include=health,stats` | |
| Transfer queue | `GET /api/v1/bookings/transfers?region_id=:regionId&status=pending` | |
| Aging inventory | `GET /api/v1/bookings?region_id=:regionId&expiry_within_days=7` | |
| Demand forecast | `GET /api/v1/reports/forecast?region_id=:regionId` | |

---

### 3.3 Facility Dashboard  `/facility`

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER: Facility Monitor  ·  Chennai Cold Storage  [Alerts 🔴3] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Critical Alerts Banner — above fold]                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🔴 Zone B Compressor Fault — ₹45K at risk  [Resolve]     │   │
│  │ 🟡 Zone A Door Open 8 min  — ₹12K at risk  [Resolve]     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Operational Metrics — 6 cards]                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Occ % │ │Temp  │ │Humid │ │NH3   │ │Energy│ │Alerts│        │
│  │ 86%  │ │ 3°C  │ │ 82%  │ │ 4ppm │ │₹18K  │ │  3   │        │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘        │
│                                                                  │
│  [Zone Cards Grid]                                               │
│  ┌───────────────────────┐ ┌───────────────────────┐            │
│  │ Zone A – Chilled      │ │ Zone B – Frozen        │           │
│  │ Temp: 3.2°C ✓         │ │ Temp: -17.8°C ⚠        │           │
│  │ Occ: 78%              │ │ Occ: 91%               │           │
│  │ [View Detail]         │ │ [View Detail]           │           │
│  └───────────────────────┘ └───────────────────────┘            │
│                                                                  │
│  [Batch Aging Heatmap]  ─────  [Compliance Docs]               │
│  ┌────────────────────────┐    ┌──────────────────────────┐     │
│  │ SKU × Days grid        │    │ FSSAI  [Generate]        │     │
│  │ Green/Yellow/Red cells │    │ FDA    [Generate]         │     │
│  │ Click → product detail │    │ EU GDP [Generate]         │     │
│  └────────────────────────┘    └──────────────────────────┘     │
│                                                                  │
│  [Energy & Sustainability Trend — 6 month chart]                │
└──────────────────────────────────────────────────────────────────┘
```

**API calls this screen makes:**

| Data | Endpoint | Notes |
|------|----------|-------|
| Facility stats | `GET /api/v1/entities/:facilityId?include=stats,meta` | |
| Active alerts | `GET /api/v1/notifications?entity_id=:facilityId&status=active` | |
| Zone list | `GET /api/v1/entities?type=zone&parent_id=:facilityId&include=telemetry_latest` | Joins last sensor reading |
| Batch aging | `GET /api/v1/bookings?facility_id=:facilityId&include=aging` | |
| Energy trend | `GET /api/v1/reports/energy?facility_id=:facilityId&period=6m` | |
| Compliance docs | `GET /api/v1/reports?facility_id=:facilityId&type=compliance` | |

---

### 3.4 Zone Detail  `/zones/:id`

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back  |  Zone A – Chilled  ·  Chennai Cold Storage           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Live Sensor Strip]                                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                 │
│  │Temp  │ │Humid │ │NH3   │ │CO2   │ │Door  │                 │
│  │3.2°C │ │82%   │ │4ppm  │ │420ppm│ │Closed│                 │
│  │● live│ │● live│ │✓ safe│ │✓ safe│ │● OK  │                 │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘                 │
│                                                                  │
│  [Temp + Humidity Chart — 24h sparkline]                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ~~~temp line~~~  ~~~humidity line~~~                     │   │
│  │  Min: 2.8  Max: 3.6  Target: 3.0                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Products in Zone]                                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SKU      Product       Qty    Entry     Expiry   Status  │   │
│  │ FRT-001  Alphonso Mango 5T   01-May    15-May    ⚠ 3 days│  │
│  │ DAI-001  Fresh Milk     2T   05-May    08-May    🔴 today │  │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Threshold Settings]  ──────  [Alert History]                 │
│  ┌────────────────────────┐    ┌──────────────────────────┐     │
│  │ Temp Max:  [5  °C] ✏   │    │ 10:42  Door open 3min    │     │
│  │ Temp Min:  [0  °C] ✏   │    │ 09:15  Temp spike +0.8°C │     │
│  │ NH3 Max:   [25ppm] ✏   │    │ Yesterday: Compressor OK │     │
│  │ Door Limit:[5 min] ✏   │    └──────────────────────────┘     │
│  └────────────────────────┘                                      │
└──────────────────────────────────────────────────────────────────┘
```

**API calls this screen makes:**

| Data | Endpoint | Notes |
|------|----------|-------|
| Zone metadata + thresholds | `GET /api/v1/entities/:zoneId?include=meta` | |
| Live sensor readings | `GET /api/v1/telemetry/:zoneId/latest` | Last reading per sensor type |
| Sensor history chart | `GET /api/v1/telemetry/:zoneId?period=24h&resolution=5m` | Time-series |
| Products in zone | `GET /api/v1/bookings?zone_id=:zoneId&status=active` | |
| Alert history | `GET /api/v1/notifications?entity_id=:zoneId&limit=20` | |
| Update thresholds | `PATCH /api/v1/entities/:zoneId` `{ "meta": { "temp_max": 5 } }` | |

---

### 3.5 Bookings  `/bookings`

```
┌──────────────────────────────────────────────────────────────────┐
│  Bookings  ·  [+ New Booking]  [Filters: Zone / Status / Date]   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Booking Table]                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ID     Customer   Product    Zone    Qty   In      Out   │   │
│  │ BK-001 Reliance   Mangoes   Zone A   5T   01-May  30-May │   │
│  │ BK-002 BigBasket  Milk      Zone A   2T   05-May  08-May │   │
│  │ BK-003 Metro Cash Potato   Zone B   10T  10-May  10-Aug │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Create / Edit Booking — side panel]                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Customer Name  [____________]                            │   │
│  │ Product        [____________]  SKU [______]              │   │
│  │ Zone           [Zone A ▼]      Qty [____] T             │   │
│  │ Entry Date     [📅]            Exit Date [📅]           │   │
│  │ Temp Required  [Min: __] [Max: __] °C                   │   │
│  │ Notes          [________________________]                │   │
│  │                              [Cancel] [Save Booking]     │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**API contract:**

| Action | Endpoint | Payload |
|--------|----------|---------|
| List bookings | `GET /api/v1/bookings?facility_id=:id&status=active` | |
| Create booking | `POST /api/v1/bookings` | `{ customer, product_sku, zone_id, qty_tonnes, entry_date, exit_date, temp_min, temp_max }` |
| Update booking | `PATCH /api/v1/bookings/:id` | Partial fields |
| Cancel booking | `DELETE /api/v1/bookings/:id` | Soft delete → status: cancelled |
| Check capacity | `GET /api/v1/entities/:zoneId/capacity?from=date&to=date` | Returns available_tonnes |

**Booking → Zone link (BE must enforce):**
- On `POST /bookings`: check `zone.capacity - current_occupancy >= qty_tonnes` 
- If yes → create booking, update `zone_meta.current_occupancy += qty_tonnes`
- If no → return `409 Conflict` with `available_tonnes` in body

---

### 3.6 Inspection  `/inspection`

```
┌──────────────────────────────────────────────────────────────────┐
│  Periodic Inspection  ·  [+ Schedule Inspection]                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Status Tabs: Scheduled | In Progress | Passed | Failed]        │
│                                                                  │
│  [Inspection List]                                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ID      Zone    Type        Scheduled   Inspector  Status│   │
│  │ INS-001 Zone A  Temperature 15-May      Ravi K.    🟡Scheduled│
│  │ INS-002 Zone B  Full Audit  10-May      Priya N.   🟢Passed  │
│  │ INS-003 Zone C  FSSAI       08-May      —          🔴Failed  │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Inspection Detail Panel — click row to expand]                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Zone: A  Type: Temperature  Date: 15-May                 │   │
│  │ Checklist:                                               │   │
│  │  ☑ Thermometer calibrated                               │   │
│  │  ☑ Log book updated                                      │   │
│  │  ☐ Cold chain continuity verified                        │   │
│  │                                                          │   │
│  │ Status: [Scheduled → In Progress → Pass/Fail]           │   │
│  │                    [Mark In Progress] [Pass] [Fail]      │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**API contract:**

| Action | Endpoint | Payload |
|--------|----------|---------|
| List inspections | `GET /api/v1/inspections?facility_id=:id&status=:status` | |
| Create inspection | `POST /api/v1/inspections` | `{ zone_id, type, scheduled_date, inspector_id, checklist[] }` |
| Transition state | `PATCH /api/v1/inspections/:id/status` | `{ status: "in_progress" \| "passed" \| "failed", notes, evidence_url }` |
| Get checklist | `GET /api/v1/inspections/:id/checklist` | |
| Update checklist item | `PATCH /api/v1/inspections/:id/checklist/:itemId` | `{ checked: true }` |

**State machine:**
```
scheduled → in_progress → passed
                       → failed → remediation_scheduled → in_progress (loop)
```

---

### 3.7 Alerts / Notifications  `/alerts`

```
┌──────────────────────────────────────────────────────────────────┐
│  Alerts  ·  [Filters: Severity / Entity / Status / Date]         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Summary Strip]                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Critical  │ │Warning   │ │Info      │ │Resolved  │           │
│  │   3      │ │   7      │ │  12      │ │  48      │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                  │
│  [Alert Feed]                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🔴 CRITICAL  Zone B Compressor Fault  Chennai  10:42am   │   │
│  │   ₹45,000 at risk  [Resolve] [Escalate] [View Zone]      │   │
│  │                                                          │   │
│  │ 🟡 WARNING  Door Open > 5min  Zone A  Chennai  09:15am   │   │
│  │   ₹12,000 at risk  [Resolve] [Escalate] [View Zone]      │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**API contract:**

| Action | Endpoint | Payload |
|--------|----------|---------|
| List alerts | `GET /api/v1/notifications?scope=facility&entity_id=:id&status=active` | Scoped by role JWT |
| Resolve alert | `PATCH /api/v1/notifications/:id` | `{ status: "resolved", resolution_notes, resolved_by }` |
| Escalate alert | `POST /api/v1/notifications/:id/escalate` | `{ escalate_to: "regional" \| "hq", notes }` |
| Alert rules | `GET /api/v1/notifications/rules?entity_id=:zoneId` | Threshold rules per zone |
| Create rule | `POST /api/v1/notifications/rules` | `{ zone_id, metric, operator, threshold, severity }` |

**Trigger engine (BE):**
```
Telemetry ingest
      │
      ▼
Rule evaluation loop (per zone)
  FOR each active rule of zone:
    IF telemetry[metric] operator threshold:
      IF no active notification for this rule+zone:
        CREATE notification
        PUSH to notification stack (WebSocket / FCM)
```

---

### 3.8 Reports  `/reports`

```
┌──────────────────────────────────────────────────────────────────┐
│  Reports  ·  [Facility: Chennai ▼]  [Date Range: 📅]            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Report Types]                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ FSSAI Audit  │ │ FDA Cold     │ │ EU GDP       │            │
│  │ [Generate]   │ │ Chain        │ │ Compliance   │            │
│  │              │ │ [Generate]   │ │ [Generate]   │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│  ┌──────────────┐ ┌──────────────┐                              │
│  │ Temp Log     │ │ Energy       │                              │
│  │ [Generate]   │ │ Summary      │                              │
│  │              │ │ [Generate]   │                              │
│  └──────────────┘ └──────────────┘                              │
│                                                                  │
│  [Generated Reports History]                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ FSSAI-May-2026.pdf   Generated 10-May  [Download] [Share]│   │
│  │ TempLog-Apr-2026.pdf Generated 01-May  [Download] [Share]│   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

**API contract:**

| Action | Endpoint | Notes |
|--------|----------|-------|
| List report types | `GET /api/v1/reports/types` | Static catalogue |
| Generate report | `POST /api/v1/reports/generate` | `{ type, facility_id, from_date, to_date }` → returns `job_id` (async) |
| Poll job status | `GET /api/v1/reports/jobs/:jobId` | `{ status: "pending\|done", download_url }` |
| List generated | `GET /api/v1/reports?facility_id=:id` | History list |
| Download | `GET /api/v1/reports/:id/download` | Signed S3 URL redirect |

---

### 3.9 Settings — Revenue  `/settings → revenue`

```
┌──────────────────────────────────────────────────────────────────┐
│  Settings → Revenue Analytics                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [KPIs: Revenue/Tonne · Net Profit · Monthly Revenue]           │
│  [Weekly Revenue vs Target — bar chart]                          │
│  [Cost Breakdown — donut]                                        │
│  [Revenue by Zone — progress bars]                               │
│  [P&L Summary]                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**API contract:**

| Data | Endpoint |
|------|----------|
| Revenue summary | `GET /api/v1/revenue?facility_id=:id&period=today` |
| Weekly trend | `GET /api/v1/revenue?facility_id=:id&period=7d&group_by=day` |
| Revenue by zone | `GET /api/v1/revenue?facility_id=:id&group_by=zone` |
| Cost breakdown | `GET /api/v1/revenue/costs?facility_id=:id&period=today` |

**Revenue derivation rule (BE):**
```
revenue.today = SUM(booking.qty_tonnes × product.storage_rate_per_tonne_per_day)
               WHERE booking.zone.facility_id = :facilityId
               AND booking.entry_date <= today
               AND booking.exit_date >= today

cost.energy    = facility_meta.energy_kwh_today × energy_rate
cost.labor     = revenue.today × labor_cost_ratio     (configurable)
cost.maintenance = revenue.today × maintenance_ratio  (configurable)
net_profit     = revenue.today - cost.energy - cost.labor - cost.maintenance
```

---

## 4. Telemetry (Sensor Data) Flow

```
IoT Device / Sensor
      │
      │  POST /api/v1/telemetry  (high-frequency, unauthenticated internal)
      ▼
Telemetry Ingestion Service
      │
      ├──► Time-Series DB (InfluxDB / TimescaleDB)
      │         stores: entity_id, metric, value, timestamp
      │
      ├──► Redis Cache
      │         key: telemetry:latest:{zoneId}:{metric}
      │         TTL: 60s (stale if device offline)
      │
      └──► Rule Engine
                evaluates thresholds → creates notifications
```

**Telemetry payload:**
```json
POST /api/v1/telemetry
{
  "device_id": "TEMP-Z1-01",
  "zone_id": "zone-uuid",
  "readings": [
    { "metric": "temperature", "value": 3.2, "unit": "celsius" },
    { "metric": "humidity",    "value": 82,  "unit": "percent" },
    { "metric": "nh3",         "value": 4,   "unit": "ppm" }
  ],
  "timestamp": "2026-05-27T10:42:00Z"
}
```

**Dashboard read flow:**
```
Frontend → GET /api/v1/telemetry/:zoneId/latest
                │
                ▼
           Redis Cache hit → return immediately
                │ (miss)
                ▼
           Time-Series DB → last record → populate cache → return
```

---

## 5. Complete API Surface Summary

```
/api/v1/
│
├── entities/                  ← Core hierarchy (HQ/Region/Facility/Zone)
│   ├── GET    /               ← List with filters (type, parent_id)
│   ├── POST   /               ← Create with optional children[]
│   ├── GET    /:id            ← Single entity + include= stats/meta/alerts
│   ├── PATCH  /:id            ← Update entity or meta
│   ├── DELETE /:id            ← Soft delete
│   └── GET    /:id/capacity   ← Available capacity for a zone in date range
│
├── telemetry/                 ← Sensor data
│   ├── POST   /               ← Ingest (device → server)
│   ├── GET    /:zoneId/latest ← Current readings (Redis)
│   └── GET    /:zoneId        ← Historical (time-series, period + resolution)
│
├── notifications/             ← Alerts & notification stack
│   ├── GET    /               ← List (scoped by JWT role + entity)
│   ├── PATCH  /:id            ← Resolve / acknowledge
│   ├── POST   /:id/escalate   ← Escalate to higher role
│   ├── GET    /rules          ← Threshold rules
│   └── POST   /rules          ← Create threshold rule
│
├── bookings/                  ← CRUD + capacity check
│   ├── GET    /               ← List (filters: facility, zone, status, date)
│   ├── POST   /               ← Create (enforces capacity check)
│   ├── PATCH  /:id            ← Update
│   ├── DELETE /:id            ← Cancel (soft delete)
│   └── GET    /transfers      ← Cross-facility transfer queue
│
├── inspections/               ← State-machine workflow
│   ├── GET    /               ← List (filters: facility, status)
│   ├── POST   /               ← Schedule new inspection
│   ├── GET    /:id            ← Detail + checklist
│   ├── PATCH  /:id/status     ← Transition state
│   └── PATCH  /:id/checklist/:itemId ← Update checklist item
│
├── revenue/                   ← Computed analytics
│   ├── GET    /               ← Summary (facility, period, group_by)
│   └── GET    /costs          ← Cost breakdown
│
└── reports/                   ← Async report generation
    ├── GET    /types           ← Report catalogue
    ├── POST   /generate        ← Kick off async job → job_id
    ├── GET    /jobs/:jobId     ← Poll job status
    ├── GET    /                ← History list
    ├── GET    /:id/download    ← Signed download URL
    └── GET    /forecast        ← Demand forecast (regional)
```

---

## 6. Auth & Role Scoping

### JWT Claims Shape
```json
{
  "sub": "user-uuid",
  "role": "facility_manager",
  "entity_id": "facility-uuid",
  "entity_type": "facility"
}
```

### Role → Scope Matrix

| Role | Can read | Can write |
|------|----------|-----------|
| `hq_coo` | All entities | Entity config, rules |
| `regional_manager` | Own region + children | Transfers, inspections |
| `facility_manager` | Own facility + zones | Bookings, alerts, inspections |
| `operator` | Own facility zones | Alert resolve only |
| `viewer` | Own facility | Nothing |

### Row-Level Security Rule (BE)
```
Every API endpoint must:
  1. Extract entity_id + entity_type from JWT
  2. Verify requested resource is a descendant of JWT entity_id
     (walk entities.parent_id chain)
  3. Return 403 if not in scope
```

---

## 7. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                                                                 │
│  HQ View    Regional View    Facility View    Zone Detail       │
│     │            │                │               │            │
│     └────────────┴────────────────┴───────────────┘            │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │  HTTPS REST + WebSocket (alerts)
┌────────────────────────────┼────────────────────────────────────┐
│                         BACKEND                                 │
│                            │                                    │
│              ┌─────────────▼─────────────┐                     │
│              │       API Gateway          │                     │
│              │  Auth · Rate Limit · RBAC  │                     │
│              └──────────────┬────────────┘                     │
│                             │                                   │
│        ┌──────────┬─────────┼──────────┬──────────┐            │
│        ▼          ▼         ▼          ▼          ▼            │
│   Entities   Bookings   Inspections  Revenue   Reports          │
│   Service    Service    Service      Service   Service          │
│      │                                            │             │
│      │    ┌───────────────────────┐               │             │
│      │    │   Telemetry Service   │               │             │
│      │    │  Ingest → Rule Engine │               │             │
│      │    └──────────┬────────────┘               │             │
│      │               │                            │             │
│  ┌───▼──┐  ┌────────▼────────┐  ┌─────▼──────┐  │             │
│  │Postgres│ │  TimescaleDB/   │  │   Redis    │  │             │
│  │Entities│ │  InfluxDB       │  │  (latest   │  │             │
│  │Bookings│ │  (telemetry)    │  │   cache)   │  │             │
│  │etc.    │ └─────────────────┘  └────────────┘  │             │
│  └────────┘                                       │             │
│                              ┌────────────────────┘             │
│                              ▼                                  │
│                        Notification                             │
│                        Stack (Push/                             │
│                        WebSocket/FCM)                           │
└─────────────────────────────────────────────────────────────────┘
                             │
                    IoT Devices / Sensors
                    POST /telemetry (internal)
```

---

## 8. Open Items for BE Team

| # | Question | Impact |
|---|----------|--------|
| 1 | What is the telemetry push interval? (5s? 30s?) | Redis TTL + chart resolution |
| 2 | Is revenue rate per booking or per product SKU in a rate card? | Revenue API derivation logic |
| 3 | WebSocket for real-time alerts or polling? | Frontend connection strategy |
| 4 | Where are report files stored? (S3 / GCS / local) | Reports download URL shape |
| 5 | Is the rule engine configurable per zone or global defaults? | Notifications/rules API scope |
| 6 | Multi-tenancy: is one DB per org or shared with row-level security? | All query scoping |
