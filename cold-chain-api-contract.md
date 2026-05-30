# Cold Chain API Contract

**Version:** 2.0 (aligned with Entity Platform API V2)  
**Base URL:** `https://services-alpha.oneiot.io/tm/api`  
**Path Pattern:** `/api/{tenant}/...` where `{tenant}` = `402` (current deployment)  
**Auth:** `Authorization: Bearer <token>` · Role: `WORKSPACE_SUPPORT`  
**Currency:** INR (₹) · **Dates:** ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)

---


## Architecture Notes

### Field Structure

## 1. Facility Types

**Note:** Types can be simple strings (`"hq"`, `"region"`, `"warehouse"`, `"zone"`) or references to created type IDs. The following endpoints allow creating custom facility types, but using hardcoded strings is also supported.

### 1.1 Create
**POST** `/api/{tenant}/facilities/types`

**Headers:**
```http
Authorization: Bearer <token>
Idempotency-Key: <uuid>
Content-Type: application/json
```

```json
// Request
{ "name": "Frozen Zone", "description": "Sub-zero storage" }

// Response 200
{
  "status": "Success",
  "message": "Facility type created successfully",
  "data": {
    "id": "uuid",
    "tenantId": 402,
    "workspace": null,
    "name": "frozen_zone",
    "description": "Sub-zero storage",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

### 1.2 List
**GET** `/api/{tenant}/facilities/types?search=&page=1&limit=25`

```json
// Response 200
{
  "status": "Success",
  "message": "Facility types retrieved successfully",
  "data": {
    "types": [
      {
        "id": "uuid",
        "tenantId": 402,
        "workspace": null,
        "name": "frozen_zone",
        "description": "Sub-zero storage",
        "createdAt": "2026-05-29T10:00:00.000Z",
        "updatedAt": "2026-05-29T10:00:00.000Z"
      }
    ],
    "pages": 1
  }
}
```

### 1.3 Get
**GET** `/api/{tenant}/facilities/types/:id`

```json
// Response 200
{
  "status": "Success",
  "message": "Facility type details retrieved successfully",
  "data": {
    "id": "uuid", "tenantId": 402, "workspace": null,
    "name": "frozen_zone", "description": "Sub-zero storage",
    "createdAt": "2026-05-29T10:00:00.000Z", "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

### 1.4 Update
**PUT** `/api/{tenant}/facilities/types/:id`

**Headers:**
```http
Authorization: Bearer <token>
If-Match: 2026-05-29T10:00:00.000Z
Content-Type: application/json
```

```json
// Request (all optional)
{ "name": "Chilled Zone", "description": "2–8°C storage" }

// Response 200
{
  "status": "Success",
  "message": "Facility type updated successfully",
  "data": { "id": "uuid", "tenantId": 402, "workspace": null, "name": "chilled_zone", "description": "2–8°C storage", "..." : "..." }
}
```

### 1.5 Delete
**DELETE** `/api/{tenant}/facilities/types/:id`

**Headers:**
```http
Authorization: Bearer <token>
If-Match: 2026-05-29T10:00:00.000Z
```

```json
// Response 200
{
  "status": "Success",
  "message": "Facility type deleted successfully",
  "data": { "id": "uuid" }
}
```

---

## 2. Facilities (Unified for HQ, Region, Warehouse, Zone)

**Hierarchy:** `HQ (parentId: null)` → `Region (parentId: HQ_ID)` → `Warehouse (parentId: REGION_ID)` → `Zone (parentId: WAREHOUSE_ID)`

**Type values:** `"hq"` · `"region"` · `"warehouse"` · `"zone"`

All facility types use the same `/api/{tenant}/facilities` endpoint. Backend determines field placement (root vs meta) based on the type.

### 2.1 Create Facility
**POST** `/api/{tenant}/facilities?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
Idempotency-Key: <uuid>
Content-Type: application/json
```

The request structure varies by type. Below are examples for each facility type:

#### Create HQ
**POST** `/api/{tenant}/facilities?workspace=904`

```json
// Request
{
  "name": "Cold Guard India HQ",
  "type": "hq",
  "parentId": null,
  "isActive": true,
  "description": "National headquarters"
}
// Required: name, type

// Response 200
{
  "status": "Success",
  "message": "Facility created successfully",
  "data": {
    "id": "HQ-uuid",
    "tenantId": 402,
    "workspace": 904,
    "name": "Cold Guard India HQ",
    "type": "hq",
    "parentId": null,
    "isActive": true,
    "description": "National headquarters",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

#### Create Region
**POST** `/api/{tenant}/facilities?workspace=904`

```json
// Request
{
  "name": "South India",
  "type": "region",
  "parentId": "HQ-uuid",
  "isActive": true,
  "code": "SOUTH",
  "states": "Tamil Nadu, Karnataka, Kerala, Andhra Pradesh",
  "headId": "u2",
  "headName": "Priya Nair",
  "headEmail": "priya.nair@coldguard.in",
  "headMobile": "9876543210"
}
// Required: name, type, parentId (HQ ID), code, headId

// Response 200
{
  "status": "Success",
  "message": "Facility created successfully",
  "data": {
    "id": "RGN-uuid",
    "tenantId": 402,
    "workspace": 904,
    "name": "South India",
    "type": "region",
    "parentId": "HQ-uuid",
    "isActive": true,
    "code": "SOUTH",
    "states": "Tamil Nadu, Karnataka, Kerala, Andhra Pradesh",
    "headId": "u2",
    "headName": "Priya Nair",
    "headEmail": "priya.nair@coldguard.in",
    "headMobile": "9876543210",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

#### Create Warehouse/Facility
**POST** `/api/{tenant}/facilities?workspace=904`

```json
// Request
{
  "name": "Mysore Cold Storage",
  "type": "warehouse",
  "parentId": "RGN-uuid",
  "isActive": true,
  "description": "Main cold storage hub",
  "location": "Mysore, Karnataka",
  "address": {
    "street": "123 Industrial Area",
    "city": "Mysore",
    "state": "Karnataka",
    "country": "India",
    "zipCode": "570001"
  },
  "latitude": "12.31",
  "longitude": "76.65",
  "totalCapacity": "2000",
  "licenseNumber": "LIC-001",
  "fssaiLicense": "12345678901234",
  "managerId": "u1",
  "managerName": "John Doe",
  "managerEmail": "john@agristore.demo",
  "managerMobile": "9876543210"
}
// Required: name, type, parentId (Region ID), managerId

// Response 200
{
  "status": "Success",
  "message": "Facility created successfully",
  "data": {
    "id": "FAC-uuid",
    "tenantId": 402,
    "workspace": 904,
    "name": "Mysore Cold Storage",
    "type": "warehouse",
    "parentId": "RGN-uuid",
    "isActive": true,
    "description": "Main cold storage hub",
    "location": "Mysore, Karnataka",
    "address": {
      "street": "123 Industrial Area",
      "city": "Mysore",
      "state": "Karnataka",
      "country": "India",
      "zipCode": "570001"
    },
    "latitude": "12.31",
    "longitude": "76.65",
    "totalCapacity": "2000",
    "licenseNumber": "LIC-001",
    "fssaiLicense": "12345678901234",
    "managerId": "u1",
    "managerName": "John Doe",
    "managerEmail": "john@agristore.demo",
    "managerMobile": "9876543210",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

#### Create Zone
**POST** `/api/{tenant}/facilities?workspace=904`

```json
// Request
{
  "name": "Chill Zone A",
  "type": "zone",
  "parentId": "FAC-uuid",
  "isActive": true,
  "zoneType": "chill",
  "capacity": "500",
  "tempMin": "0",
  "tempMax": "8",
  "tempTarget": "4",
  "humidityTarget": "85",
  "ratePerTonnePerDay": "12",
  "minimumChargeableTonnes": "10",
  "billingCycle": "daily",
  "handlingChargePerEntry": "500",
  "coldChainSurcharge": "5"
}
// Required: name, type, parentId (Warehouse ID), zoneType

// Response 200
{
  "status": "Success",
  "message": "Facility created successfully",
  "data": {
    "id": "ZNE-uuid",
    "tenantId": 402,
    "workspace": 904,
    "name": "Chill Zone A",
    "type": "zone",
    "parentId": "FAC-uuid",
    "isActive": true,
    "zoneType": "chill",
    "capacity": "500",
    "tempMin": "0",
    "tempMax": "8",
    "tempTarget": "4",
    "humidityTarget": "85",
    "ratePerTonnePerDay": "12",
    "minimumChargeableTonnes": "10",
    "billingCycle": "daily",
    "handlingChargePerEntry": "500",
    "coldChainSurcharge": "5",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

### 2.2 List Facilities
**GET** `/api/{tenant}/facilities?type=&parentId=&isActive=true&search=&page=1&limit=25&workspace=904`

```json
// Response 200
{
  "status": "Success",
  "message": "Facilities retrieved successfully",
  "data": {
    "facilities": [
      {
        "id": "FAC-uuid",
        "tenantId": 402,
        "workspace": 904,
        "name": "Mysore Cold Storage",
        "type": "warehouse",
        "parentId": "RGN-uuid",
        "isActive": true,
        "address": { "city": "Mysore", "state": "Karnataka", "country": "India" },
        "latitude": "12.31",
        "longitude": "76.65",
        "meta": {
          "capacity":      { "total": 2000, "unit": "tonne", "available": 1600, "currentUtilization": 400 },
          "managerId":     "u1",
          "managerName":   "John Doe",
          "managerEmail":  "john@agristore.demo",
          "managerMobile": "9876543210"
        },
        "createdAt": "2026-05-29T10:00:00.000Z",
        "updatedAt": "2026-05-29T10:00:00.000Z"
      }
    ],
    "pages": 1
  }
}
```

### 2.3 Get Facility
**GET** `/api/{tenant}/facilities/:id?workspace=904`

```json
// Response 200
{
  "status": "Success",
  "message": "Facility details retrieved successfully",
  "data": {
    "id": "FAC-uuid",
    "tenantId": 402,
    "workspace": 904,
    "name": "Mysore Cold Storage",
    "type": "warehouse",
    "parentId": "RGN-uuid",
    "isActive": true,
    "description": "Main cold storage hub",
    "address": {
      "street": "123 Industrial Area",
      "city": "Mysore",
      "state": "Karnataka",
      "country": "India",
      "zipCode": "570001"
    },
    "latitude": "12.31",
    "longitude": "76.65",
    "meta": {
      "capacity":      { "total": 2000, "unit": "tonne", "available": 1600, "currentUtilization": 400 },
      "licenseNumber": "LIC-001",
      "fssaiLicense":  "12345678901234",
      "managerId":     "u1",
      "managerName":   "John Doe",
      "managerEmail":  "john@agristore.demo",
      "managerMobile": "9876543210"
    },
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

### 2.4 Update Facility
**PUT** `/api/{tenant}/facilities/:id?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
If-Match: 2026-05-29T10:00:00.000Z
Content-Type: application/json
```

```json
// Request (all optional)
{
  "name": "Mysore Cold Storage – Phase 2",
  "isActive": true,
  "meta": {
    "capacity":      { "total": 3000, "unit": "tonne", "available": 2800, "currentUtilization": 200 },
    "managerId":     "u2",
    "managerName":   "Priya Sharma",
    "managerEmail":  "priya@agristore.demo",
    "managerMobile": "9000000001"
  }
}

// Response 200
{
  "status": "Success",
  "message": "Facility updated successfully",
  "data": { "id": "FAC-uuid", "tenantId": 402, "workspace": 904, "name": "Mysore Cold Storage – Phase 2", "..." : "..." }
}
```

### 2.5 Delete Facility (Soft-Delete)
**DELETE** `/api/{tenant}/facilities/:id?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
If-Match: 2026-05-29T10:00:00.000Z
```

**Default behavior:**
- Returns `409 FACILITY_HAS_DEPENDENTS` if:
  - Child facilities exist (regions with zones, warehouses with zones, etc.)
  - Active zone assignments reference this facility
  - Active bookings reference this facility

**Soft-delete with cascade:**
Add `?cascade=archive` to soft-delete the facility and all dependents:
```http
DELETE /api/{tenant}/facilities/:id?workspace=904&cascade=archive
```

**Response 200 (without cascade):**
```json
{
  "status": "Success",
  "message": "Facility deleted successfully",
  "data": {
    "id": "FAC-uuid",
    "deletedAt": "2026-05-29T10:00:00.000Z",
    "isActive": false
  }
}
```

**Response 200 (with cascade):**
```json
{
  "status": "Success",
  "message": "Facility and dependents archived successfully",
  "data": {
    "id": "FAC-uuid",
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
- `404 FACILITY_NOT_FOUND` — Facility does not exist
- `409 FACILITY_HAS_DEPENDENTS` — Cannot delete without cascade flag
- `409 PRECONDITION_FAILED` — If-Match header mismatch

**Note:** Soft-delete sets `deletedAt` and `isActive: false` but preserves the record for audit. Soft-deleted facilities are excluded from list queries by default.

### 2.6 Facility Hierarchy
**GET** `/api/{tenant}/facilities/:id/hierarchy?workspace=904`

Returns the facility and its full children tree (recursive).

```json
// Response 200
{
  "status": "Success",
  "message": "Facility hierarchy retrieved successfully",
  "data": {
    "facility": {
      "id": "FAC-uuid",
      "tenantId": 402,
      "workspace": 904,
      "name": "Mysore Cold Storage",
      "type": "warehouse",
      "isActive": true,
      "parentId": "RGN-uuid",
      "meta": { "capacity": { "total": 2000, "unit": "tonne", "available": 1600, "currentUtilization": 400 } }
    },
    "children": [
      {
        "id": "ZNE-uuid-1",
        "tenantId": 402,
        "workspace": 904,
        "name": "Chill Zone A",
        "type": "zone",
        "isActive": true,
        "parentId": "FAC-uuid",
        "meta": {
          "zoneType":    "chill",
          "capacity":    { "total": 500, "unit": "tonne", "available": 300, "currentUtilization": 200 },
          "temperature": { "min": 0, "max": 8, "target": 4, "unit": "celsius" },
          "humidity":    { "target": 85, "unit": "percent" },
          "pricing":     { "ratePerTonnePerDay": 12, "minimumChargeableTonnes": 10, "billingCycle": "daily", "handlingChargePerEntry": 500, "coldChainSurcharge": 5 }
        },
        "children": []
      },
      {
        "id": "ZNE-uuid-2",
        "tenantId": 402,
        "workspace": 904,
        "name": "Frozen Zone B",
        "type": "zone",
        "isActive": true,
        "parentId": "FAC-uuid",
        "meta": {
          "zoneType":    "frozen",
          "capacity":    { "total": 300, "unit": "tonne", "available": 300, "currentUtilization": 0 },
          "temperature": { "min": -25, "max": -18, "target": -22, "unit": "celsius" },
          "humidity":    { "target": 70, "unit": "percent" },
          "pricing":     { "ratePerTonnePerDay": 20, "minimumChargeableTonnes": 5, "billingCycle": "daily", "handlingChargePerEntry": 800, "coldChainSurcharge": 8 }
        },
        "children": []
      }
    ]
  }
}
```

---

## 3. Assignments (Device → Zone)

### 3.1 Assign Device
**POST** `/api/{tenant}/facilities/assignments?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
Idempotency-Key: <uuid>
Content-Type: application/json
```

```json
// Request
{
  "thingName": "TEMP-SENSOR-01",
  "facilityId": "<zoneId>",
  "assignedAt": "2026-05-29T10:00:00.000Z"
}
// Required: thingName, facilityId

// Response 200
{
  "status": "Success",
  "message": "Thing assigned to facility successfully",
  "data": {
    "id": "uuid",
    "tenantId": 402,
    "workspace": 904,
    "thingName": "TEMP-SENSOR-01",
    "facilityId": "<zoneId>",
    "assignedAt": "2026-05-29T10:00:00.000Z",
    "unassignedAt": null,
    "isActive": true,
    "createdAt": "2026-05-29T10:00:00.000Z",
    "updatedAt": "2026-05-29T10:00:00.000Z"
  }
}
```

### 3.2 List Assignments
**GET** `/api/{tenant}/facilities/assignments?thingName=&facilityId=&isActive=true&page=1&limit=25`

```json
// Response 200
{
  "status": "Success",
  "message": "Assignments retrieved successfully",
  "data": {
    "assignments": [
      {
        "id": "uuid",
        "tenantId": 402,
        "workspace": 904,
        "thingName": "TEMP-SENSOR-01",
        "facilityName": "Chill Zone A",
        "facilityId": "<zoneId>",
        "assignedAt": "2026-05-29T10:00:00.000Z",
        "unassignedAt": null,
        "isActive": true,
        "createdAt": "2026-05-29T10:00:00.000Z",
        "updatedAt": "2026-05-29T10:00:00.000Z"
      }
    ],
    "pages": 1
  }
}
```

### 3.3 Get Assignment
**GET** `/api/{tenant}/facilities/assignments/:id`

```json
// Response 200
{
  "status": "Success",
  "message": "Assignment details retrieved successfully",
  "data": { "id": "uuid", "tenantId": 402, "workspace": 904, "thingName": "TEMP-SENSOR-01", "facilityId": "<zoneId>", "assignedAt": "ISO8601", "unassignedAt": null, "isActive": true }
}
```

### 3.4 Update Assignment
**PUT** `/api/{tenant}/facilities/assignments/:id?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
If-Match: 2026-05-29T10:00:00.000Z
Content-Type: application/json
```

```json
// Request (all optional)
{ "isActive": false, "unassignedAt": "2026-05-29T18:00:00.000Z" }

// Response 200
{
  "status": "Success",
  "message": "Assignment updated successfully",
  "data": { "id": "uuid", "tenantId": 402, "workspace": 904, "isActive": false, "unassignedAt": "2026-05-29T18:00:00.000Z", "..." : "..." }
}
```

### 3.5 Remove Assignment
**DELETE** `/api/{tenant}/facilities/assignments/:id?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
If-Match: 2026-05-29T10:00:00.000Z
```

```json
// Response 200
{
  "status": "Success",
  "message": "Thing unassigned successfully",
  "data": { "id": "uuid" }
}
```

### 3.6 Device Assignment History
**GET** `/api/{tenant}/facilities/things/:thingName/assignments?page=1&limit=25`

```json
// Response 200
{
  "status": "Success",
  "message": "Assignment history retrieved successfully",
  "data": {
    "assignments": [
      {
        "id": "uuid",
        "tenantId": 402,
        "workspace": 904,
        "thingName": "TEMP-SENSOR-01",
        "facilityId": "<zoneId>",
        "assignedAt": "2026-05-01T10:00:00.000Z",
        "unassignedAt": "2026-05-15T10:00:00.000Z",
        "isActive": false
      }
    ],
    "pages": 1
  }
}
```

---

## 4. Bookings (Transactions)

`type` enum: `rental` · `lease` · `shipment` (default: `rental`)
`status` enum: `pending` · `confirmed` · `cancelled` · `completed` (default: `pending`)
`productCategory` enum: `fruits` · `vegetables` · `dairy` · `meat` · `poultry` · `seafood` · `frozen-foods` · `pharma` · `other`

All booking-specific form data lives inside `meta`. The `inward` object carries inward gate entry fields; `releaseEvents` is an array that grows with each stock release.

### 4.1 Create Active Booking
**POST** `/api/{tenant}/facilities/transactions?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
Idempotency-Key: <uuid>
Content-Type: application/json
```

```json
// Request
{
  "email": "client@agristore.demo",
  "facilityId": "<zoneId>",
  "bookedStartDate": "2026-05-10T09:30:00.000Z",
  "bookedEndDate":   "2026-06-10T00:00:00.000Z",
  "type":   "rental",
  "status": "confirmed",
  "meta": {
    "bookingNumber": "BK-2026-0451",
    "inward": {
      "entryDateTime":      "2026-05-10T09:30:00.000Z",
      "supplierName":       "Sharma Agro Pvt. Ltd.",
      "vehicleNumber":      "TN-01-AB-1234",
      "driverName":         "Ravi Kumar",
      "driverMobile":       "9876543210",
      "productCategory":    "fruits",
      "productName":        "Alphonso Mangoes",
      "batchNumber":        "LOT-2026-0451",
      "quantityUnits":      "80",
      "quantityWeight":     "3200",
      "expiryDate":         "2026-06-10",
      "arrivalTemperature": "4.2",
      "visualCondition":    "Pass",
      "zoneAssignment":     "Chill Zone A",
      "remarks":            "Premium export quality"
    },
    "capacityBooked":  { "value": 3.2, "unit": "tonne" },
    "pricing":         { "finalRate": 5000 },
    "releaseEvents":   []
  }
}
// Required: email, facilityId, bookedStartDate, bookedEndDate

// Response 200
{
  "status": "Success",
  "message": "Booking created successfully",
  "data": {
    "id": "uuid",
    "tenantId": 402,
    "workspace": 904,
    "email": "client@agristore.demo",
    "facilityId": "<zoneId>",
    "type": "rental",
    "status": "confirmed",
    "bookedStartDate": "2026-05-10T09:30:00.000Z",
    "bookedEndDate":   "2026-06-10T00:00:00.000Z",
    "meta": {
      "bookingNumber": "BK-2026-0451",
      "inward": {
        "entryDateTime":      "2026-05-10T09:30:00.000Z",
        "supplierName":       "Sharma Agro Pvt. Ltd.",
        "vehicleNumber":      "TN-01-AB-1234",
        "driverName":         "Ravi Kumar",
        "driverMobile":       "9876543210",
        "productCategory":    "fruits",
        "productName":        "Alphonso Mangoes",
        "batchNumber":        "LOT-2026-0451",
        "quantityUnits":      "80",
        "quantityWeight":     "3200",
        "expiryDate":         "2026-06-10",
        "arrivalTemperature": "4.2",
        "visualCondition":    "Pass",
        "zoneAssignment":     "Chill Zone A",
        "remarks":            "Premium export quality"
      },
      "capacityBooked": { "value": 3.2, "unit": "tonne" },
      "pricing":        { "finalRate": 5000 },
      "releaseEvents":  []
    },
    "createdAt": "2026-05-10T09:30:00.000Z",
    "updatedAt": "2026-05-10T09:30:00.000Z"
  }
}

// Error 409
{ "error": { "message": "Facility is not available for the selected dates. Conflicting bookings exist.", "statusCode": 409 } }
```

### 4.2 Schedule Upcoming Arrival
**POST** `/api/{tenant}/facilities/transactions?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
Idempotency-Key: <uuid>
Content-Type: application/json
```

```json
// Request
{
  "email": "client@agristore.demo",
  "facilityId": "<zoneId>",
  "bookedStartDate": "2026-05-28T00:00:00.000Z",
  "bookedEndDate":   "2026-06-28T00:00:00.000Z",
  "type":   "rental",
  "status": "pending",
  "meta": {
    "bookingNumber": "BK-2026-0452",
    "upcoming": {
      "expectedArrivalDate": "2026-05-28",
      "supplierName":        "Bangalore Organics",
      "vehicleNumber":       "KA-05-MN-7890",
      "productCategory":     "vegetables",
      "productName":         "Baby Spinach",
      "quantityWeight":      "600",
      "zoneAssignment":      "Chill Zone A",
      "remarks":             "Organic certified"
    },
    "capacityBooked": { "value": 0.6, "unit": "tonne" },
    "pricing":        { "finalRate": 0 },
    "releaseEvents":  []
  }
}

// Response 200 — same envelope as 6.1, status: "pending"
```

### 4.3 List Bookings
**GET** `/api/{tenant}/facilities/transactions?facilityId=&email=&status=&startDate=&endDate=&page=1&limit=25`

```json
// Response 200
{
  "status": "Success",
  "message": "Transactions retrieved successfully",
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "tenantId": 402,
        "workspace": 904,
        "email": "client@agristore.demo",
        "facilityId": "<zoneId>",
        "type": "rental",
        "status": "confirmed",
        "bookedStartDate": "2026-05-10T09:30:00.000Z",
        "bookedEndDate":   "2026-06-10T00:00:00.000Z",
        "meta": {
          "bookingNumber": "BK-2026-0451",
          "inward": {
            "supplierName":       "Sharma Agro Pvt. Ltd.",
            "vehicleNumber":      "TN-01-AB-1234",
            "driverName":         "Ravi Kumar",
            "driverMobile":       "9876543210",
            "productCategory":    "fruits",
            "productName":        "Alphonso Mangoes",
            "batchNumber":        "LOT-2026-0451",
            "quantityUnits":      "80",
            "quantityWeight":     "3200",
            "expiryDate":         "2026-06-10",
            "entryDateTime":      "2026-05-10T09:30:00.000Z",
            "arrivalTemperature": "4.2",
            "visualCondition":    "Pass",
            "zoneAssignment":     "Chill Zone A",
            "remarks":            "Premium export quality"
          },
          "capacityBooked": { "value": 3.2, "unit": "tonne" },
          "pricing":        { "finalRate": 5000 },
          "releaseEvents":  []
        },
        "createdAt": "2026-05-10T09:30:00.000Z",
        "updatedAt": "2026-05-10T09:30:00.000Z"
      }
    ],
    "pages": 1
  }
}
```

### 4.4 Get Booking
**GET** `/api/{tenant}/facilities/transactions/:id`

```json
// Response 200
{
  "status": "Success",
  "message": "Transaction details retrieved successfully",
  "data": { "...": "same shape as single item in 6.3" }
}
```

### 4.5 Mark Arrived (Upcoming → Active)
**PUT** `/api/{tenant}/facilities/transactions/:id?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
If-Match: 2026-05-29T10:00:00.000Z
Content-Type: application/json
```

```json
// Request
{
  "status": "confirmed",
  "meta": {
    "inward": {
      "entryDateTime":      "2026-05-28T10:15:00.000Z",
      "driverName":         "Suresh Nair",
      "driverMobile":       "9123456780",
      "batchNumber":        "LOT-2026-0528",
      "quantityUnits":      "120",
      "expiryDate":         "2026-06-28",
      "arrivalTemperature": "4.5",
      "visualCondition":    "Pass"
    }
  }
}

// Response 200
{
  "status": "Success",
  "message": "Booking updated successfully",
  "data": { "id": "uuid", "tenantId": 402, "workspace": 904, "status": "confirmed", "..." : "..." }
}
```

### 4.6 Release Stock
**PUT** `/api/{tenant}/facilities/transactions/:id?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
If-Match: 2026-05-29T10:00:00.000Z
Content-Type: application/json
```

Appends a new entry to `meta.releaseEvents`.

```json
// Request
{
  "meta": {
    "releaseEvents": [
      {
        "eventId":          "REL-uuid",
        "exitDateTime":     "2026-05-20T10:00:00.000Z",
        "vehicleNumber":    "TN-03-BC-2211",
        "recipientName":    "Freshmart Exports",
        "recipientMobile":  "9001234567",
        "quantityReleased": "1000",
        "remarks":          "First partial dispatch",
        "releasedAt":       "2026-05-20T10:00:00.000Z"
      }
    ]
  }
}

// Response 200
{
  "status": "Success",
  "message": "Booking updated successfully",
  "data": {
    "id": "uuid",
    "tenantId": 402,
    "workspace": 904,
    "meta": {
      "bookingNumber": "BK-2026-0451",
      "inward":        { "...": "..." },
      "releaseEvents": [
        {
          "eventId":          "REL-uuid",
          "exitDateTime":     "2026-05-20T10:00:00.000Z",
          "vehicleNumber":    "TN-03-BC-2211",
          "recipientName":    "Freshmart Exports",
          "recipientMobile":  "9001234567",
          "quantityReleased": "1000",
          "remarks":          "First partial dispatch",
          "releasedAt":       "2026-05-20T10:00:00.000Z"
        }
      ]
    }
  }
}
```

### 4.7 Cancel Booking
**POST** `/api/{tenant}/facilities/transactions/:id/cancel?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
Idempotency-Key: <uuid>
Content-Type: application/json
```

```json
// Response 200
{
  "status": "Success",
  "message": "Booking cancelled successfully",
  "data": { "id": "uuid", "status": "cancelled" }
}
```

### 4.8 Check Availability 🆕
**GET** `/api/{tenant}/facilities/transactions/availability?facilityId=&startDate=&endDate=&workspace=904`

```
Query params:
  facilityId : warehouse or zone ID
  startDate  : ISO8601
  endDate    : ISO8601 (max 14 days from startDate)
```

```json
// Response 200
{
  "status": "Success",
  "message": "Availability retrieved successfully",
  "data": {
    "facilityId": "<warehouseId>",
    "tenantId":   402,
    "workspace":  904,
    "startDate":  "2026-06-01T00:00:00.000Z",
    "endDate":    "2026-06-14T23:59:59.000Z",
    "zones": [
      {
        "zoneId":   "ZNE-uuid-1",
        "zoneName": "Chill Zone A",
        "zoneType": "chill",
        "capacity": { "total": 500, "booked": 325, "available": 175, "unit": "tonne" },
        "status":   "partial"
      },
      {
        "zoneId":   "ZNE-uuid-2",
        "zoneName": "Frozen Zone B",
        "zoneType": "frozen",
        "capacity": { "total": 300, "booked": 0, "available": 300, "unit": "tonne" },
        "status":   "available"
      }
    ]
  }
}
// status enum: available (< 65% booked) | partial (65–95%) | full (≥ 95%)
```

---

## 5. Alerts

`type` enum: `temperature` · `door` · `compressor` · `inventory` · `staff`
`severity` enum: `critical` · `warning` · `info`
`status` enum: `open` · `in_progress` · `resolved` · `escalated`

### 5.1 List Alerts
**GET** `/api/{tenant}/alerts?facilityId=&zoneId=&severity=&status=&page=1&limit=25&workspace=904`

```json
// Response 200
{
  "status": "Success",
  "message": "Alerts retrieved successfully",
  "data": {
    "alerts": [
      {
        "id": "ALT-uuid",
        "tenantId": 402,
        "workspace": 904,
        "type":            "temperature",
        "severity":        "critical",
        "message":         "Zone A temp exceeded 8°C — currently 9.4°C",
        "zone":            "Chill Zone A",
        "zoneId":          "ZNE-uuid",
        "facility":        "Mysore Cold Storage",
        "facilityId":      "FAC-uuid",
        "status":          "open",
        "financialImpact": 45000,
        "time":            "2026-05-29T08:00:00.000Z",
        "resolutionNotes": null,
        "resolvedBy":      null,
        "resolvedAt":      null,
        "escalatedTo":     null,
        "escalationTime":  null,
        "createdAt":       "2026-05-29T08:00:00.000Z",
        "updatedAt":       "2026-05-29T08:00:00.000Z"
      }
    ],
    "pages": 1
  }
}
```

### 5.2 Resolve Alert
**POST** `/api/{tenant}/alerts/:alertId/resolve?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
Idempotency-Key: <uuid>
Content-Type: application/json
```

```json
// Request
{
  "notes": "Technician dispatched, compressor recalibrated",
  "actor": "John Doe"
}
// Required: actor

// Response 200
{
  "status": "Success",
  "message": "Alert resolved successfully",
  "data": {
    "id": "ALT-uuid",
    "tenantId": 402,
    "workspace": 904,
    "status":          "resolved",
    "resolutionNotes": "Technician dispatched, compressor recalibrated",
    "resolvedBy":      "John Doe",
    "resolvedAt":      "2026-05-29T10:00:00.000Z",
    "updatedAt":       "2026-05-29T10:00:00.000Z"
  }
}
```

### 5.3 Escalate Alert
**POST** `/api/{tenant}/alerts/:alertId/escalate?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
Idempotency-Key: <uuid>
Content-Type: application/json
```

```json
// Request
{
  "escalateTo": "regional",
  "actor":      "John Doe"
}
// escalateTo enum: regional | hq

// Response 200
{
  "status": "Success",
  "message": "Alert escalated successfully",
  "data": {
    "id": "ALT-uuid",
    "tenantId": 402,
    "workspace": 904,
    "status":         "escalated",
    "escalatedTo":    "regional",
    "escalatedBy":    "John Doe",
    "escalationTime": "2026-05-29T10:00:00.000Z",
    "updatedAt":      "2026-05-29T10:00:00.000Z"
  }
}
```

---

## 6. Transfer Requests

`status` enum: `pending` · `approved` · `rejected` · `in_transit` · `completed`

### 6.1 List Transfers
**GET** `/api/{tenant}/transfers?status=&facilityId=&page=1&limit=25&workspace=904`

```json
// Response 200
{
  "status": "Success",
  "message": "Transfers retrieved successfully",
  "data": {
    "transfers": [
      {
        "id": "TR-uuid",
        "tenantId": 402,
        "workspace": 904,
        "product":          "Alphonso Mangoes",
        "fromFacility":     "Chennai Cold Storage",
        "fromFacilityId":   "FAC-uuid-1",
        "toFacility":       "Mysore Cold Storage",
        "toFacilityId":     "FAC-uuid-2",
        "quantity":         500,
        "unit":             "tonne",
        "reason":           "Capacity optimisation",
        "savings":          12000,
        "status":           "pending",
        "approvedBy":       null,
        "approvedAt":       null,
        "rejectedBy":       null,
        "rejectedAt":       null,
        "rejectionReason":  null,
        "estimatedArrival": null,
        "createdAt":        "2026-05-29T10:00:00.000Z",
        "updatedAt":        "2026-05-29T10:00:00.000Z"
      }
    ],
    "pages": 1
  }
}
```

### 6.2 Approve Transfer
**POST** `/api/{tenant}/transfers/:transferId/approve?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
Idempotency-Key: <uuid>
Content-Type: application/json
```

```json
// Request
{ "actor": "Rajesh Kumar" }

// Response 200
{
  "status": "Success",
  "message": "Transfer approved successfully",
  "data": {
    "id": "TR-uuid",
    "tenantId": 402,
    "workspace": 904,
    "status":           "approved",
    "approvedBy":       "Rajesh Kumar",
    "approvedAt":       "2026-05-29T10:00:00.000Z",
    "estimatedArrival": "2026-05-31T10:00:00.000Z",
    "updatedAt":        "2026-05-29T10:00:00.000Z"
  }
}
```

### 6.3 Reject Transfer
**POST** `/api/{tenant}/transfers/:transferId/reject?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
Idempotency-Key: <uuid>
Content-Type: application/json
```

```json
// Request
{ "actor": "Rajesh Kumar", "reason": "Insufficient destination capacity" }

// Response 200
{
  "status": "Success",
  "message": "Transfer rejected successfully",
  "data": {
    "id": "TR-uuid",
    "tenantId": 402,
    "workspace": 904,
    "status":          "rejected",
    "rejectedBy":      "Rajesh Kumar",
    "rejectedAt":      "2026-05-29T10:00:00.000Z",
    "rejectionReason": "Insufficient destination capacity",
    "updatedAt":       "2026-05-29T10:00:00.000Z"
  }
}
```

---

## 7. Compliance Reports

`type` enum: `FSSAI` · `FDA` · `EU-GDP` · `Temperature-Log` · `Cleaning-Log` · `Incident-Report`
`status` enum: `valid` · `expiring` · `expired`

### 7.1 List Reports
**GET** `/api/{tenant}/reports?facilityId=&type=&status=&page=1&limit=25&workspace=904`

```json
// Response 200
{
  "status": "Success",
  "message": "Reports retrieved successfully",
  "data": {
    "reports": [
      {
        "id": "RPT-uuid",
        "tenantId": 402,
        "workspace": 904,
        "type":        "FSSAI",
        "facility":    "Mysore Cold Storage",
        "facilityId":  "FAC-uuid",
        "generatedAt": "2026-05-29T10:00:00.000Z",
        "validUntil":  "2027-05-29T10:00:00.000Z",
        "status":      "valid",
        "generatedBy": "John Doe",
        "downloadUrl": "https://services-alpha.oneiot.io/reports/RPT-uuid.pdf"
      }
    ],
    "pages": 1
  }
}
```

### 7.2 Generate Report
**POST** `/api/{tenant}/reports/generate?workspace=904`

**Headers:**
```http
Authorization: Bearer <token>
Idempotency-Key: <uuid>
Content-Type: application/json
```

```json
// Request
{
  "type":       "FSSAI",
  "facilityId": "FAC-uuid",
  "actor":      "John Doe"
}
// Required: type, facilityId, actor

// Response 200
{
  "status": "Success",
  "message": "Report generated successfully",
  "data": {
    "id": "RPT-uuid",
    "tenantId": 402,
    "workspace": 904,
    "type":        "FSSAI",
    "facility":    "Mysore Cold Storage",
    "facilityId":  "FAC-uuid",
    "generatedAt": "2026-05-29T10:00:00.000Z",
    "validUntil":  "2027-05-29T10:00:00.000Z",
    "status":      "valid",
    "generatedBy": "John Doe",
    "downloadUrl": "https://services-alpha.oneiot.io/reports/RPT-uuid.pdf"
  }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | Success |
| 400  | Validation error |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not found |
| 409  | Conflict (e.g. overlapping booking) |
| 500  | Server error |

---

## Endpoint Summary

| Group | Count |
|-------|-------|
| Regions | 5 |
| Facility Types | 5 |
| Facilities + Zones | 6 |
| Assignments | 6 |
| Bookings / Transactions | 8 |
| Alerts | 3 |
| Transfer Requests | 3 |
| Compliance Reports | 2 |
| **Total** | **38** |

---

## Alignment with Entity Platform API V2

**Version:** 2.0 — Updated 2026-05-29  
**Reference:** ENTITY_API_V2_REFERENCE.md

This contract is aligned with the Entity Platform API V2 Reference with the following implementation:

### ✅ Aligned Components

1. **Base Path Pattern**
   - All endpoints use `/api/{tenant}/...` path pattern
   - Current tenant: `402`
   - Path-level tenant isolation ready

2. **Required Headers**
   - `Idempotency-Key` required on all POST requests
   - `If-Match` required on all PATCH/DELETE requests
   - Optimistic concurrency control via `If-Match: <updatedAt>`

3. **Error Taxonomy**
   - Machine-readable error codes (e.g., `FACILITY_NOT_FOUND`)
   - Structured `error.details` object
   - HTTP status codes aligned with reference

4. **Soft-Delete Pattern**
   - DELETE endpoints set `deletedAt` timestamp
   - Sets `isActive: false`
   - Cascade options via `?cascade=archive` query parameter
   - Soft-deleted records excluded from list queries

5. **Pagination**
   - Both page-based AND cursor-based supported
   - Cursor-based recommended for new integrations
   - Aligns with Entity Platform V2 pagination contract

### ⚠️ Documented Deviations

1. **Field Structure**
   - **Reference:** Uses `facility_type` + `subtype` + `metadata` JSONB pattern
   - **This API:** Uses flat field structure (`type`, `name`, `totalCapacity`, etc.)
   - **Reason:** Frontend simplicity and type-safe TypeScript interfaces
   - **Impact:** Domain-specific fields at root level, not nested in `metadata`

2. **Field Naming**
   - **Reference:** `facility_id`, `facility_type`, `display_name`, `geometry`
   - **This API:** `id`, `type`, `name`, `latitude`/`longitude`
   - **Reason:** Consistency with existing codebase and SetupContext
   - **Impact:** Minor naming convention difference

3. **Response Envelope**
   - **Reference:** `{ "data": {...} }` (minimal)
   - **This API:** `{ "status": "Success", "message": "...", "data": {...} }` (enhanced)
   - **Reason:** Human-readable messages for frontend display
   - **Impact:** Extra fields in success responses

### 📋 Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Tenant in path | ✅ Implemented | `/api/{tenant}/...` |
| Idempotency-Key | ✅ Implemented | Required on POST |
| If-Match | ✅ Implemented | Required on PATCH/DELETE |
| Error codes | ✅ Implemented | Full taxonomy documented |
| Soft-delete | ✅ Implemented | With cascade options |
| Cursor pagination | ✅ Implemented | Alongside page-based |
| Field structure | ⚠️ Deviation | Flat fields vs metadata |
| GeoJSON geometry | ⚠️ Deviation | String lat/lng vs GeoJSON |
| Subtype support | ⚠️ Not implemented | Single `type` field only |
| LTREE path | ⚠️ Not implemented | Manual `parentId` only |

### 🔄 Migration Path

For full alignment with Entity Platform V2 reference:

**Phase 1 (Current):**
- ✅ Headers implemented
- ✅ Error codes implemented
- ✅ Soft-delete implemented
- ✅ Tenant path pattern implemented

**Phase 2 (Future):**
- Consider migrating to `metadata` JSONB pattern
- Consider adding `subtype` support
- Consider GeoJSON `geometry` field
- Consider auto-generated LTREE `path`

### 📖 Related Documentation

- **Full Alignment Analysis:** `API_ALIGNMENT_ANALYSIS.md`
- **Entity Platform V2 Reference:** `ENTITY_API_V2_REFERENCE.md`
- **Frontend Integration:** `src/contexts/SetupContext.tsx`

---

**End of Document**
