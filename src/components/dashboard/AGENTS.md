# DASHBOARD COMPONENTS

## OVERVIEW
Three role-based dashboard tiers, each split into content component + tab wrapper.

## STRUCTURE
```
dashboard/
├── FacilityDashboard.tsx          # Facility ops: zones, alerts, energy, compliance
├── FacilityDashboardEnhanced.tsx  # Extended facility view (unused in main tabs)
├── FacilityDashboardWithTabs.tsx  # Tab wrapper: Operations | Revenue
├── RegionalDashboard.tsx          # Regional: health rankings, transfers, forecasts
├── RegionalDashboardWithTabs.tsx  # Tab wrapper: Overview | Facilities | Transfers | Analytics
├── HQDashboard.tsx                # HQ: network stats, ROI, ESG, growth intelligence
└── HQDashboardWithTabs.tsx        # Tab wrapper: Network | Financials | ESG | Growth
```

## WHERE TO LOOK
| Task | File |
|------|------|
| Add facility tab | `FacilityDashboardWithTabs.tsx` |
| Facility zone/alert content | `FacilityDashboard.tsx` |
| Regional transfer/ranking | `RegionalDashboard.tsx` |
| HQ ESG/ROI/network | `HQDashboard.tsx` |

## LAYOUT PATTERNS (HQ + Regional — updated)

### HQ layout order
1. KPI strip (4 cols) — capacity, shrinkage, energy cost, compliance
2. Network health strip — facility status summary
3. `grid-cols-2`: `FacilitiesMap` (360px, `showNetworkStats={false}`) + alerts/leaderboard panel
4. Facility cards grid
5. Growth intelligence
6. Energy ranking + operational issues
7. Performance chart

### Regional layout order
1. KPI strip (4 cols)
2. Critical alerts banner (above fold)
3. `grid-cols-2`: `FacilitiesMap` (340px, `showNetworkStats={false}`) + facility status list
4. Alerts + leaderboard
5. Facility comparison cards
6. Revenue / Energy charts
7. Energy efficiency rankings + cost reduction

### Map usage
- Always use `FacilitiesMap` (not `FacilityMap`) — Carto tiles, richer popups
- Must wrap `<Map>` / `<FacilitiesMap>` with `<div style={{ height: '340px', width: '100%' }}>` — Map renders `h-full`, needs explicit parent height
- Props: `center={[78.9629, 20.5937]} zoom={5} height="340px" showNetworkStats={false}`

### Charts
- All `<ResponsiveContainer>` must use explicit pixel `height` (e.g. `height={260}`) — never `"100%"`
- Wrapper div needs `min-w-0` to prevent flex overflow

## CONVENTIONS
- Each role has exactly one `*WithTabs.tsx` as the entry point registered in `App.tsx`
- `*WithTabs.tsx` wraps the content component in `<Tabs>` and adds `RevenueDashboard` or similar cross-cuts
- `FacilityDashboardEnhanced.tsx` exists but is NOT registered in `App.tsx` — do not remove silently
- All data sourced from `@/data/mockData.ts`, passed as props or consumed directly

## ANTI-PATTERNS
- Do NOT register the base `*Dashboard.tsx` directly in `App.tsx` — always use `*WithTabs.tsx`
- Do NOT add state that belongs in `WorkflowContext` to local component state
- Do NOT use `height="100%"` on `<ResponsiveContainer>` — causes Recharts `-1` dimension warning
