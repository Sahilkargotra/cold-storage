# API Alignment Analysis: Cold-Chain vs Entity Platform V2

**Date:** 2026-05-29  
**Status:** Alignment Verification In Progress  
**Documents Compared:**
- `cold-chain-api-contract.md` (Cold-Chain API)
- `ENTITY_API_V2_REFERENCE.md` (Entity Platform API V2 Reference)

---

## Executive Summary

This document compares the Cold-Chain API contract against the Entity Platform API V2 reference to identify gaps and misalignments. The analysis covers base paths, field structures, headers, pagination, soft-delete patterns, and error handling.

### Overall Assessment

**Status:** ⚠️ **MAJOR MISALIGNMENTS FOUND**

The Cold-Chain API contract has significant structural differences from the Entity Platform V2 reference in several critical areas:

1. ❌ **Base path pattern** — Missing tenant path parameter
2. ❌ **Field structure** — Flat fields vs type/subtype/metadata pattern
3. ❌ **Header requirements** — Missing Idempotency-Key and If-Match headers
4. ❌ **Pagination** — Page-based vs cursor-based
5. ⚠️ **Response envelope** — Different success envelope structure
6. ✅ **Soft-delete** — Not yet documented in cold-chain contract

---

## 1. Base Path Pattern

### Entity Platform V2 Reference
```
/api/{tenant}/facilities
```
- Tenant is **part of the URL path**
- Must match tenant claim in bearer token
- Mismatch returns `401 TENANT_MISMATCH`

### Cold-Chain API Current
```
https://services-alpha.oneiot.io/tm/api/facilities
```
- **No tenant in path**
- Tenant appears only as response field `tenantId: 402`
- Base URL is environment-specific

### Gap Analysis

| Aspect | Reference | Current | Status |
|--------|-----------|---------|--------|
| Tenant in path | Required (`/api/{tenant}/...`) | Missing | ❌ |
| Base path format | `/api/{tenant}/facilities` | `/tm/api/facilities` | ❌ |
| Tenant isolation | Path-level (enforced by RLS) | Field-level only | ❌ |

### Recommendation

**CRITICAL:** Update base path to include tenant:
```diff
- POST https://services-alpha.oneiot.io/tm/api/facilities
+ POST https://services-alpha.oneiot.io/tm/api/402/facilities
```

This change enables:
- Path-level tenant isolation
- Postgres RLS enforcement
- Token/path tenant matching validation

---

## 2. Field Structure

### Entity Platform V2 Reference

Uses **type/subtype/metadata** pattern:

```json
{
  "facility_id": "CW-PUNE",
  "facility_type": "building",
  "subtype": "cold_warehouse",
  "display_name": "Cold Warehouse Pune",
  "metadata": {
    "maxCapacityKg": 50000,
    "targetTempC": 4,
    "operatingHours": "24x7"
  }
}
```

**Key characteristics:**
- `facility_type` + `subtype` registered in registry
- Domain-specific fields in `metadata` JSONB
- `display_name` for UI (localized via `Accept-Language`)
- `geometry` for spatial queries (GeoJSON)
- `path` auto-generated LTREE for hierarchy

### Cold-Chain API Current

Uses **flat field structure with type-based placement**:

```json
{
  "id": "FAC-uuid",
  "name": "Mysore Cold Storage",
  "type": "warehouse",
  "parentId": "RGN-uuid",
  "totalCapacity": "2000",
  "licenseNumber": "LIC-001",
  "managerId": "u1",
  "managerName": "John Doe"
}
```

**Key characteristics:**
- Single `type` field (string: `"hq"`, `"region"`, `"warehouse"`, `"zone"`)
- All fields at root level (flat)
- Backend determines field placement based on type
- No `subtype` distinction
- No structured `metadata` JSONB

### Gap Analysis

| Aspect | Reference | Current | Status |
|--------|-----------|---------|--------|
| Type field name | `facility_type` | `type` | ⚠️ |
| Subtype support | `subtype` required | No subtype | ❌ |
| Metadata pattern | JSONB `metadata` | Flat fields | ❌ |
| Display name | `display_name` | `name` | ⚠️ |
| Geometry | GeoJSON `geometry` | `latitude`/`longitude` strings | ⚠️ |
| Hierarchy path | Auto-generated LTREE `path` | Manual `parentId` only | ❌ |

### Field Mapping

**HQ:**
| Reference | Current | Notes |
|-----------|---------|-------|
| `facility_id` | `id` | ID field name |
| `facility_type: "hq"` | `type: "hq"` | Type field name differs |
| `display_name` | `name` | Name field differs |
| `metadata.description` | `description` | Flat vs nested |

**Region:**
| Reference | Current | Notes |
|-----------|---------|-------|
| `facility_type: "region"` | `type: "region"` | — |
| `metadata.code` | `code` | Should be in metadata |
| `metadata.states` | `states` | Should be in metadata |
| `metadata.headId` | `headId` | Should be in metadata |
| — | `headName`, `headEmail`, `headMobile` | Denormalized person data |

**Warehouse:**
| Reference | Current | Notes |
|-----------|---------|-------|
| `facility_type: "warehouse"` | `type: "warehouse"` | — |
| `subtype` | Missing | No subtype support |
| `geometry` (GeoJSON) | `latitude`, `longitude` (strings) | Spatial data format differs |
| `metadata.totalCapacity` | `totalCapacity` | Should be in metadata |
| `metadata.licenseNumber` | `licenseNumber` | Should be in metadata |
| `metadata.managerId` | `managerId` | Should be in metadata |
| — | `managerName`, `managerEmail`, `managerMobile` | Denormalized |

**Zone:**
| Reference | Current | Notes |
|-----------|---------|-------|
| `facility_type: "zone"` | `type: "zone"` | — |
| `metadata.zoneType` | `zoneType` | Should be in metadata |
| `metadata.capacity` | `capacity` | Should be in metadata |
| `metadata.tempMin/Max/Target` | `tempMin/Max/Target` | Should be in metadata |
| `metadata.pricing.*` | Flat pricing fields | Should be nested in metadata |

### Recommendation

**OPTION 1: Align to Reference (Recommended)**
```json
{
  "facility_id": "FAC-001",
  "facility_type": "building",
  "subtype": "cold_warehouse",
  "display_name": "Mysore Cold Storage",
  "parent_facility_id": "RGN-001",
  "geometry": {
    "type": "Point",
    "coordinates": [76.65, 12.31]
  },
  "metadata": {
    "totalCapacity": 2000,
    "licenseNumber": "LIC-001",
    "fssaiLicense": "12345678901234",
    "managerId": "u1",
    "managerName": "John Doe",
    "managerEmail": "john@example.com",
    "managerMobile": "9876543210"
  }
}
```

**OPTION 2: Document Current Pattern as Deviation**

If maintaining flat structure for frontend simplicity, document:
- Why `type` instead of `facility_type`
- Why flat fields instead of `metadata`
- Field placement rules by type
- Backward compatibility plan

---

## 3. Header Requirements

### Entity Platform V2 Reference

**Required headers:**
```http
Authorization: Bearer <jwt>              # Always
Idempotency-Key: <uuid-or-stable-id>     # POST + bulk POST (§12)
If-Match: <updated_at-iso>               # PATCH + DELETE (§12)
Accept-Language: en, hi;q=0.8            # Optional (localized display_name)
X-Request-Id: <uuid>                     # Optional (echoed in response)
```

**Idempotency-Key (POST):**
- **Required** on every POST
- TTL: 30 days
- Same key + same body → return original response
- Same key + different body → `409 IDEMPOTENCY_KEY_MISMATCH`
- Recommended IDs: `alert:{alert_id}`, `batch:{client-tx-id}`, UUIDv7

**If-Match (PATCH/DELETE):**
- Must equal resource's `updated_at`
- Mismatch → `409 PRECONDITION_FAILED` with `{ "current_updated_at": "..." }`
- Optimistic concurrency control

### Cold-Chain API Current

**Current headers:**
```http
Authorization: Bearer <token>   # Always
Content-Type: application/json  # Always
```

**Missing:**
- ❌ `Idempotency-Key` — No POST idempotency
- ❌ `If-Match` — No optimistic concurrency
- ❌ `Accept-Language` — No i18n support
- ❌ `X-Request-Id` — No request tracing

### Gap Analysis

| Header | Reference | Current | Status |
|--------|-----------|---------|--------|
| `Authorization` | Required | Required | ✅ |
| `Idempotency-Key` | Required (POST) | Missing | ❌ |
| `If-Match` | Required (PATCH/DELETE) | Missing | ❌ |
| `Accept-Language` | Optional | Missing | ⚠️ |
| `X-Request-Id` | Optional | Missing | ⚠️ |

### Recommendation

**CRITICAL:** Add idempotency and concurrency headers:

**1. Idempotency-Key for POST:**
```http
POST /facilities?workspace=904
Idempotency-Key: c3a4b5c6-d7e8-f9a0-b1c2-d3e4f5a6b7c8
Content-Type: application/json
Authorization: Bearer <token>
```

**2. If-Match for PATCH:**
```http
PATCH /facilities/FAC-001?workspace=904
If-Match: 2026-05-29T10:00:00.000Z
Content-Type: application/json
Authorization: Bearer <token>
```

**3. Error responses:**
```json
// Missing Idempotency-Key
{ "error": { "message": "Idempotency-Key header required", "statusCode": 400 } }

// If-Match mismatch
{ "error": { 
  "message": "Precondition failed: resource was modified", 
  "statusCode": 409,
  "current_updated_at": "2026-05-29T10:05:00.000Z" 
} }
```

---

## 4. Pagination Contract

### Entity Platform V2 Reference

**Cursor-based pagination:**
```http
GET /api/pharma_co/facilities?limit=50&cursor=eyJpZCI6IkNXLVBVTkUifQ
```

**Response envelope:**
```json
{
  "data": {
    "items": [ /* facilities */ ],
    "page": {
      "limit": 50,
      "next_cursor": "eyJpZCI6IkNXLU1VTUJBSSJ9",
      "has_more": true
    }
  }
}
```

**Characteristics:**
- Cursor is **opaque** (base64-encoded internal state)
- Default `limit`: 50, max: 200
- Keyset pagination (no OFFSET)
- Deterministic sort: `(path, facility_id)` ascending
- `has_more` boolean flag
- `next_cursor` null when done

### Cold-Chain API Current

**Page-based pagination:**
```http
GET /facilities?page=1&limit=25
```

**Response envelope:**
```json
{
  "status": "Success",
  "message": "Facilities retrieved successfully",
  "data": {
    "facilities": [ /* facilities */ ],
    "pages": 3
  }
}
```

**Characteristics:**
- Page numbers (`?page=1`)
- Default `limit`: 25
- Returns total `pages` count
- Likely uses OFFSET internally (not documented)

### Gap Analysis

| Aspect | Reference | Current | Status |
|--------|-----------|---------|--------|
| Pagination type | Cursor-based | Page-based | ❌ |
| Cursor format | Opaque base64 | Page number | ❌ |
| Default limit | 50 | 25 | ⚠️ |
| Max limit | 200 | Not specified | ⚠️ |
| Has-more flag | `has_more` boolean | `pages` count | ⚠️ |
| Results key | `items` | `facilities` | ⚠️ |

### Recommendation

**OPTION 1: Migrate to Cursor-Based (Recommended)**

Advantages:
- Consistent results during inserts/deletes
- Better performance at scale (no OFFSET)
- Standard pattern across Entity Platform

Example:
```http
GET /api/402/facilities?limit=50&cursor=eyJpZCI6IkZBQy0wMDEifQ
```

Response:
```json
{
  "data": {
    "items": [ /* facilities */ ],
    "page": {
      "limit": 50,
      "next_cursor": "eyJpZCI6IkZBQy0wMDIifQ",
      "has_more": true
    }
  }
}
```

**OPTION 2: Document Page-Based as Deviation**

If maintaining page-based for backward compatibility:
- Document max `limit`
- Add `has_more` or `total` count
- Clarify sort order
- Note OFFSET performance implications

---

## 5. Response Envelope

### Entity Platform V2 Reference

**Success:**
```json
{ "data": { /* resource */ } }
```

**Error:**
```json
{
  "error": {
    "code": "FACILITY_NOT_FOUND",
    "message": "Facility with ID 'CW-PUNE' not found in tenant 'pharma_co'",
    "details": { "facility_id": "CW-PUNE", "tenant": "pharma_co" }
  }
}
```

### Cold-Chain API Current

**Success:**
```json
{
  "status": "Success",
  "message": "Facility created successfully",
  "data": { /* resource */ }
}
```

**Error:**
```json
{
  "error": {
    "message": "Validation error: Name is required",
    "statusCode": 400
  }
}
```

### Gap Analysis

| Aspect | Reference | Current | Status |
|--------|-----------|---------|--------|
| Success envelope | `{ "data": {...} }` | `{ "status", "message", "data" }` | ⚠️ |
| Error code field | `error.code` | Missing | ❌ |
| Error details | `error.details` | Missing | ❌ |
| Status in response | Not present | `"status": "Success"` | ⚠️ |
| Message in success | Not present | Always present | ⚠️ |

### Recommendation

**OPTION 1: Align to Reference (Recommended)**

Simplify success envelope:
```json
{ "data": { "id": "FAC-001", /* ... */ } }
```

Enhance error envelope with codes:
```json
{
  "error": {
    "code": "FACILITY_EXISTS",
    "message": "Facility with ID 'FAC-001' already exists",
    "statusCode": 409,
    "details": { "facility_id": "FAC-001" }
  }
}
```

**OPTION 2: Keep Current Envelope**

If maintaining for compatibility:
- Document difference from reference
- Map reference error codes to messages
- Consider adding `error.code` field

---

## 6. Soft-Delete Pattern

### Entity Platform V2 Reference

**DELETE endpoint:**
```http
DELETE /api/{tenant}/facilities/{id}
DELETE /api/{tenant}/facilities/{id}?cascade=archive
```

**Default behavior:**
- Refuse if descendants exist → `409 FACILITY_HAS_DEPENDENTS`
- Refuse if active entities located in it
- Refuse if active transactions reference it

**With `?cascade=archive`:**
```json
{
  "data": {
    "facility_id": "CW-PUNE",
    "deleted_at": "2026-05-27T20:00:00Z",
    "status": "archived",
    "cascaded": {
      "descendant_facilities": 12,
      "delinked_relationships": 45,
      "participant_lefts": 8
    }
  }
}
```

**Pattern:**
- Sets `deleted_at` timestamp (soft-delete)
- Changes `status` to `"archived"`
- Returns cascade summary
- Row stays in table for audit

### Cold-Chain API Current

**Not documented.** No DELETE endpoint specified.

### Gap Analysis

| Aspect | Reference | Current | Status |
|--------|-----------|---------|--------|
| DELETE endpoint | Documented (F5) | Missing | ❌ |
| Soft-delete | `deleted_at` + `status='archived'` | Not specified | ❌ |
| Cascade options | `?cascade=archive` | Not specified | ❌ |
| Dependency check | Default behavior | Not specified | ❌ |

### Recommendation

**Add DELETE endpoint:**

```markdown
### 2.5 Delete Facility
**DELETE** `/facilities/:id?workspace=904`

**Default behavior:**
- Returns `409 FACILITY_HAS_DEPENDENTS` if:
  - Child facilities exist
  - Active zone assignments exist
  - Active bookings reference the facility

**With `?cascade=archive`:**
- All child facilities marked `isActive: false`, `deletedAt` set
- All zone assignments delinked
- All bookings participant `leftAt` set
- Facility marked `isActive: false`, `deletedAt` set

**Response 200:**
```json
{
  "status": "Success",
  "message": "Facility deleted successfully",
  "data": {
    "id": "FAC-001",
    "deletedAt": "2026-05-29T10:00:00.000Z",
    "isActive": false,
    "cascaded": {
      "childFacilities": 3,
      "delinkedAssignments": 12,
      "affectedBookings": 5
    }
  }
}
```

**Errors:**
- `404` — Facility not found
- `409` — Has dependents (without cascade)
```
```

---

## 7. Tenant & Workspace Context

### Entity Platform V2 Reference

**Tenant:**
- In URL path: `/api/{tenant}/facilities`
- Must match JWT claim
- Enforced by Postgres RLS

**Workspace:**
- Optional in JWT
- Can be in query: `?workspace=12`
- Defaults to tenant-level if null

### Cold-Chain API Current

**Tenant:**
- Not in path
- Response field: `"tenantId": 402`
- Fixed value (not multi-tenant)

**Workspace:**
- Query param: `?workspace=904`
- Required on mutating calls
- Response field: `"workspace": 904`

### Gap Analysis

| Aspect | Reference | Current | Status |
|--------|-----------|---------|--------|
| Tenant in path | Required | Missing | ❌ |
| Tenant isolation | Path + RLS | Field only | ❌ |
| Workspace param | Optional | Required on mutations | ⚠️ |
| Multi-tenancy | Supported | Single tenant | ⚠️ |

### Recommendation

**If multi-tenant:**
```diff
- POST /facilities?workspace=904
+ POST /api/402/facilities?workspace=904
```

**If single-tenant:**
- Document as single-tenant deployment
- Note deviation from multi-tenant reference
- Consider future migration path

---

## 8. Error Taxonomy

### Entity Platform V2 Reference

**Structured error codes (§14):**

```
Code                         Status  Meaning
──────────────────────────────────────────────────────────
FACILITY_NOT_FOUND           404     No such facility in tenant
FACILITY_EXISTS              409     facility_id already used
UNKNOWN_FACILITY_TYPE        422     (facility_type, subtype) not registered
INVALID_FACILITY_PARENT      422     Parent type disallowed
INVALID_GEOMETRY             422     Kind mismatch / malformed
FACILITY_HAS_DEPENDENTS      409     DELETE blocked
INVALID_METADATA             422     Fails JSON Schema
PRECONDITION_FAILED          409     If-Match mismatch
IDEMPOTENCY_KEY_REQUIRED     400     POST without header
IDEMPOTENCY_KEY_MISMATCH     409     Same key, different body
```

**Error response:**
```json
{
  "error": {
    "code": "INVALID_FACILITY_PARENT",
    "message": "Parent facility type 'zone' cannot contain 'warehouse'",
    "details": {
      "parent_facility_id": "ZNE-001",
      "parent_facility_type": "zone",
      "attempted_type": "warehouse"
    }
  }
}
```

### Cold-Chain API Current

**Current errors:**
```json
{ "error": { "message": "Validation error: Name is required", "statusCode": 400 } }
```

**Missing:**
- ❌ Machine-readable error codes
- ❌ Structured `details` object
- ❌ Standardized error taxonomy

### Recommendation

**Add error code taxonomy:**

```json
{
  "error": {
    "code": "FACILITY_NAME_REQUIRED",
    "message": "Validation error: Name is required",
    "statusCode": 400,
    "details": { "field": "name", "constraint": "required" }
  }
}
```

**Cold-Chain specific codes:**
```
Code                              Status  Meaning
────────────────────────────────────────────────────────────
FACILITY_NAME_REQUIRED            400     Name field missing
INVALID_FACILITY_TYPE             422     Type not in [hq, region, warehouse, zone]
PARENT_REQUIRED                   400     ParentId missing for non-HQ
INVALID_PARENT_HIERARCHY          422     Violates HQ→Region→Warehouse→Zone
MANAGER_REQUIRED                  400     ManagerId missing for warehouse
HEAD_REQUIRED                     400     HeadId missing for region
ZONE_TYPE_INVALID                 422     ZoneType not in [frozen, chill, dry]
CAPACITY_REQUIRED                 400     Capacity missing for zone
TEMP_RANGE_INVALID                422     TempMin >= TempMax
```

---

## Summary of Gaps

### Critical (Must Fix) ❌

1. **Base path** — Missing `/api/{tenant}/` prefix
2. **Idempotency-Key** — Required on all POSTs
3. **If-Match** — Required on PATCH/DELETE
4. **Field structure** — Flat vs type/subtype/metadata
5. **Pagination** — Page-based vs cursor-based
6. **Error codes** — Missing machine-readable codes
7. **Soft-delete** — No DELETE endpoint documented

### Important (Should Fix) ⚠️

8. **Response envelope** — Extra `status`/`message` fields
9. **Tenant isolation** — Path-level vs field-level
10. **Geometry** — Strings vs GeoJSON
11. **Subtypes** — No subtype support
12. **LTREE path** — Manual parentId vs auto-generated path

### Optional (Nice to Have) ℹ️

13. **Accept-Language** — i18n support
14. **X-Request-Id** — Request tracing
15. **Limit defaults** — 25 vs 50

---

## Recommended Action Plan

### Phase 1: Critical Headers & Path (Week 1)
1. ✅ Add `Idempotency-Key` validation on POST
2. ✅ Add `If-Match` validation on PATCH/DELETE
3. ✅ Update base path to `/api/{tenant}/facilities`
4. ✅ Add tenant/path matching validation

### Phase 2: Pagination & Errors (Week 2)
5. ✅ Migrate to cursor-based pagination
6. ✅ Add structured error code taxonomy
7. ✅ Add `error.code` and `error.details` fields

### Phase 3: Field Structure (Week 3-4)
8. ⚠️ Evaluate flat vs metadata tradeoff
9. ⚠️ Add subtype support (if needed)
10. ⚠️ Add GeoJSON geometry (if spatial queries needed)
11. ⚠️ Add auto-generated LTREE path

### Phase 4: Soft-Delete & Cleanup (Week 5)
12. ✅ Add DELETE endpoint with cascade
13. ✅ Document all deviations from reference
14. ✅ Update API contract with alignment notes

---

## Open Questions

1. **Multi-tenancy:** Is cold-chain single-tenant or multi-tenant?
2. **Spatial queries:** Are PostGIS queries needed, or is lat/lng sufficient?
3. **Subtypes:** Does cold-chain need warehouse subtypes (refrigerated, frozen, dry)?
4. **Backward compatibility:** Can we break existing clients, or need versioning?
5. **Registry:** Should facility types be in a registry, or hardcoded as `"hq"`/`"region"`/etc?

---

## Conclusion

The Cold-Chain API contract has **major structural misalignments** with the Entity Platform V2 reference. The critical gaps are:

1. Missing tenant in path
2. No idempotency/concurrency headers
3. Flat fields instead of type/subtype/metadata
4. Page-based instead of cursor pagination
5. No soft-delete pattern
6. No structured error codes

**Recommendation:** Prioritize fixing critical gaps (headers, path, pagination, errors) first. Field structure can be addressed in a later phase if backward compatibility is a concern.
