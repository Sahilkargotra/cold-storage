# Cold Chain Monitoring — Entity Relationship Diagram

**Version:** 1.0  
**Format:** Mermaid ERD (render in VS Code, Notion, GitHub, or [mermaid.live](https://mermaid.live))

---

## Full ER Diagram

```mermaid
erDiagram

  %% ──────────────────────────────────────────────
  %% CORE HIERARCHY
  %% ──────────────────────────────────────────────

  ENTITY {
    uuid    id          PK
    enum    type        "hq | region | facility | zone"
    string  name
    uuid    parent_id   FK
    ts      created_at
    ts      updated_at
  }

  ENTITY ||--o{ ENTITY : "parent_id → id (self-ref)"

  %% ──────────────────────────────────────────────
  %% TYPE-SPECIFIC METADATA
  %% ──────────────────────────────────────────────

  FACILITY_META {
    uuid    entity_id       PK_FK
    string  location
    float   latitude
    float   longitude
    float   total_capacity
    string  license_number
    string  contact_name
    string  contact_phone
  }

  ZONE_META {
    uuid    entity_id           PK_FK
    enum    zone_type           "ambient | chill | frozen | processing"
    float   capacity
    float   current_occupancy
    float   temp_target
    float   temp_min
    float   temp_max
    float   humidity_target
    float   nh3_threshold_ppm
    float   co2_threshold_ppm
    int     door_open_limit_min
  }

  ENTITY ||--o| FACILITY_META : "1 facility → 1 facility_meta"
  ENTITY ||--o| ZONE_META     : "1 zone → 1 zone_meta"

  %% ──────────────────────────────────────────────
  %% USERS & ROLES
  %% ──────────────────────────────────────────────

  USER {
    uuid    id           PK
    string  name
    string  email        UK
    string  password_hash
    enum    role         "hq_coo | regional_manager | facility_manager | operator | viewer"
    uuid    entity_id    FK
    enum    entity_type  "hq | region | facility"
    bool    is_active
    ts      last_login
    ts      created_at
  }

  ENTITY ||--o{ USER : "entity_id scopes user access"

  %% ──────────────────────────────────────────────
  %% DEVICES (IoT Sensors)
  %% ──────────────────────────────────────────────

  DEVICE {
    uuid    id           PK
    string  device_code  UK
    enum    type         "temp_sensor | door_sensor | compressor_monitor | energy_meter"
    uuid    zone_id      FK
    enum    status       "online | offline | maintenance"
    ts      last_ping
    ts      created_at
  }

  ENTITY ||--o{ DEVICE : "zone_id → entity.id (zone only)"

  %% ──────────────────────────────────────────────
  %% TELEMETRY
  %% ──────────────────────────────────────────────

  TELEMETRY {
    uuid    id          PK
    uuid    device_id   FK
    uuid    zone_id     FK
    enum    metric      "temperature | humidity | nh3 | co2 | door_status | energy_kwh"
    float   value
    string  unit
    ts      recorded_at
  }

  DEVICE  ||--o{ TELEMETRY : "device_id"
  ENTITY  ||--o{ TELEMETRY : "zone_id → entity.id"

  %% ──────────────────────────────────────────────
  %% PRODUCTS (SKU Catalog)
  %% ──────────────────────────────────────────────

  PRODUCT {
    uuid    id               PK
    string  sku              UK
    string  name
    enum    category         "fruits | vegetables | dairy | meat | poultry | seafood | frozen | pharma | other"
    float   temp_min
    float   temp_max
    float   humidity_min
    float   humidity_max
    int     shelf_life_days
    enum    unit_type        "kg | tonne | box | pallet | crate"
    float   storage_rate_per_tonne_per_day
    ts      created_at
  }

  %% ──────────────────────────────────────────────
  %% BOOKINGS
  %% ──────────────────────────────────────────────

  BOOKING {
    uuid    id              PK
    string  booking_code    UK
    uuid    zone_id         FK
    uuid    product_id      FK
    string  customer_name
    string  customer_contact
    float   qty_tonnes
    float   temp_min_required
    float   temp_max_required
    date    entry_date
    date    exit_date
    enum    status          "active | completed | cancelled | transferred"
    uuid    created_by      FK
    ts      created_at
    ts      updated_at
  }

  ENTITY  ||--o{ BOOKING : "zone_id → entity.id"
  PRODUCT ||--o{ BOOKING : "product_id"
  USER    ||--o{ BOOKING : "created_by"

  %% ──────────────────────────────────────────────
  %% TRANSFERS (cross-facility booking moves)
  %% ──────────────────────────────────────────────

  TRANSFER {
    uuid    id              PK
    uuid    booking_id      FK
    uuid    from_zone_id    FK
    uuid    to_zone_id      FK
    float   qty_tonnes
    string  reason
    enum    status          "pending | approved | rejected | completed"
    uuid    approved_by     FK
    ts      requested_at
    ts      resolved_at
  }

  BOOKING ||--o{ TRANSFER  : "booking_id"
  USER    ||--o{ TRANSFER  : "approved_by"

  %% ──────────────────────────────────────────────
  %% NOTIFICATION RULES (threshold config)
  %% ──────────────────────────────────────────────

  NOTIFICATION_RULE {
    uuid    id          PK
    uuid    zone_id     FK
    enum    metric      "temperature | humidity | nh3 | co2 | door_open_minutes | energy_kwh"
    enum    operator    "gt | lt | gte | lte"
    float   threshold
    enum    severity    "critical | warning | info"
    bool    is_active
    ts      created_at
  }

  ENTITY ||--o{ NOTIFICATION_RULE : "zone_id → entity.id"

  %% ──────────────────────────────────────────────
  %% NOTIFICATIONS (fired alerts)
  %% ──────────────────────────────────────────────

  NOTIFICATION {
    uuid    id              PK
    uuid    rule_id         FK
    uuid    entity_id       FK
    enum    entity_type     "zone | facility | region | hq"
    enum    severity        "critical | warning | info"
    string  title
    string  message
    float   financial_impact
    enum    status          "active | resolved | escalated | acknowledged"
    enum    escalated_to    "regional | hq"
    string  resolution_notes
    uuid    resolved_by     FK
    ts      fired_at
    ts      resolved_at
  }

  NOTIFICATION_RULE ||--o{ NOTIFICATION : "rule_id"
  ENTITY            ||--o{ NOTIFICATION : "entity_id"
  USER              ||--o{ NOTIFICATION : "resolved_by"

  %% ──────────────────────────────────────────────
  %% INSPECTIONS
  %% ──────────────────────────────────────────────

  INSPECTION {
    uuid    id              PK
    uuid    zone_id         FK
    enum    type            "temperature | full_audit | fssai | fda | eu_gdp"
    enum    status          "scheduled | in_progress | passed | failed | remediation"
    uuid    inspector_id    FK
    date    scheduled_date
    ts      started_at
    ts      completed_at
    string  notes
    string  evidence_url
    ts      created_at
  }

  ENTITY ||--o{ INSPECTION : "zone_id → entity.id"
  USER   ||--o{ INSPECTION : "inspector_id"

  INSPECTION_CHECKLIST_ITEM {
    uuid    id              PK
    uuid    inspection_id   FK
    string  label
    bool    is_checked
    string  notes
    int     sort_order
  }

  INSPECTION ||--o{ INSPECTION_CHECKLIST_ITEM : "inspection_id"

  %% ──────────────────────────────────────────────
  %% REPORTS
  %% ──────────────────────────────────────────────

  REPORT {
    uuid    id              PK
    uuid    facility_id     FK
    uuid    generated_by    FK
    enum    type            "fssai | fda | eu_gdp | temp_log | energy_summary | custom"
    enum    status          "pending | generating | done | failed"
    date    period_from
    date    period_to
    string  download_url
    ts      requested_at
    ts      completed_at
  }

  ENTITY ||--o{ REPORT : "facility_id → entity.id"
  USER   ||--o{ REPORT : "generated_by"

  %% ──────────────────────────────────────────────
  %% REVENUE (computed, stored as daily snapshots)
  %% ──────────────────────────────────────────────

  REVENUE_SNAPSHOT {
    uuid    id              PK
    uuid    facility_id     FK
    date    snapshot_date
    float   gross_revenue
    float   energy_cost
    float   labor_cost
    float   maintenance_cost
    float   net_profit
    float   occupancy_pct
    ts      computed_at
  }

  ENTITY ||--o{ REVENUE_SNAPSHOT : "facility_id → entity.id"
```

---

## Table Relationship Summary

| Table | Relates to | Via | Cardinality |
|---|---|---|---|
| ENTITY | ENTITY | `parent_id` | Self-referencing tree |
| ENTITY | FACILITY_META | `entity_id` | 1 facility → 1 meta |
| ENTITY | ZONE_META | `entity_id` | 1 zone → 1 meta |
| ENTITY | USER | `entity_id` | 1 entity → many users |
| ENTITY | DEVICE | `zone_id` | 1 zone → many devices |
| ENTITY | TELEMETRY | `zone_id` | 1 zone → many readings |
| ENTITY | BOOKING | `zone_id` | 1 zone → many bookings |
| ENTITY | NOTIFICATION_RULE | `zone_id` | 1 zone → many rules |
| ENTITY | NOTIFICATION | `entity_id` | 1 entity → many notifications |
| ENTITY | INSPECTION | `zone_id` | 1 zone → many inspections |
| ENTITY | REPORT | `facility_id` | 1 facility → many reports |
| ENTITY | REVENUE_SNAPSHOT | `facility_id` | 1 facility → many snapshots |
| DEVICE | TELEMETRY | `device_id` | 1 device → many readings |
| PRODUCT | BOOKING | `product_id` | 1 product → many bookings |
| BOOKING | TRANSFER | `booking_id` | 1 booking → many transfers |
| INSPECTION | INSPECTION_CHECKLIST_ITEM | `inspection_id` | 1 inspection → many items |
| NOTIFICATION_RULE | NOTIFICATION | `rule_id` | 1 rule → many fired notifications |
| USER | BOOKING | `created_by` | 1 user → many bookings |
| USER | TRANSFER | `approved_by` | 1 user → many approvals |
| USER | NOTIFICATION | `resolved_by` | 1 user → many resolutions |
| USER | INSPECTION | `inspector_id` | 1 user → many inspections |
| USER | REPORT | `generated_by` | 1 user → many reports |

---

## Storage Strategy Notes

| Table | Store in | Reason |
|---|---|---|
| ENTITY, FACILITY_META, ZONE_META | PostgreSQL | Relational, infrequently updated |
| USER, DEVICE, PRODUCT | PostgreSQL | CRUD, relational |
| BOOKING, TRANSFER | PostgreSQL | Transactional, needs ACID |
| INSPECTION, REPORT | PostgreSQL | Workflow state, relational |
| NOTIFICATION, NOTIFICATION_RULE | PostgreSQL | Relational, moderate volume |
| REVENUE_SNAPSHOT | PostgreSQL | Daily computed rows, small volume |
| TELEMETRY | TimescaleDB / InfluxDB | High-frequency time-series writes |
| Telemetry latest per zone | Redis | Sub-millisecond dashboard reads |
