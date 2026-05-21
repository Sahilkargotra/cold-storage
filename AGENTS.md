# PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-21
**Project:** Cold-Storage — React 19 + TypeScript + Vite dashboard for cold storage facility monitoring

## OVERVIEW
Multi-role (HQ / Regional / Facility) cold storage monitoring SPA. Three dashboard tiers with tabs, charts (Recharts), maps (MapLibre), and a workflow context for alert/transfer management. All data is mock — no backend.

## STRUCTURE
```
Cold-Storage/
├── src/
│   ├── App.tsx                  # Root: role-based view switcher
│   ├── main.tsx                 # Vite entry
│   ├── index.css                # Tailwind base
│   ├── components/
│   │   ├── dashboard/           # 7 dashboard components (3 roles × base+WithTabs, HQ only 2)
│   │   ├── ui/                  # shadcn/ui primitives (card, button, badge, tabs, dialog, select, map)
│   │   ├── map/                 # FacilitiesMap, FacilityMap (MapLibre)
│   │   ├── revenue/             # RevenueDashboard
│   │   ├── Sidebar.tsx          # Nav + role switcher
│   │   ├── RoleSwitcher.tsx
│   │   ├── ZoneMonitorCard.tsx
│   │   ├── AlertDetailModal.tsx
│   │   └── ActionHistory.tsx
│   ├── contexts/
│   │   └── WorkflowContext.tsx  # Alert/transfer/compliance state (React Context)
│   ├── data/
│   │   └── mockData.ts          # All mock data (WHO/industry-based)
│   ├── types/
│   │   ├── index.ts             # All shared domain types
│   │   └── workflow.ts          # Workflow-specific types
│   └── lib/
│       └── utils.ts             # cn() helper (clsx + tailwind-merge)
├── public/
├── components.json              # shadcn/ui config
├── tailwind.config.js
├── tsconfig.app.json            # Path alias: @/* → src/*
└── vite.config.ts               # Path alias: @/* → src/*
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Add new dashboard view | `src/components/dashboard/` + register in `App.tsx` switch |
| Add nav item | `src/components/Sidebar.tsx` |
| Add/edit mock data | `src/data/mockData.ts` |
| Add domain types | `src/types/index.ts` |
| Add workflow state | `src/contexts/WorkflowContext.tsx` |
| Add UI primitive | `src/components/ui/` (shadcn pattern) |
| Add map view | `src/components/map/` |

## CONVENTIONS
- Path alias `@/` → `src/` (configured in both tsconfig.app.json and vite.config.ts)
- Named exports everywhere (no default exports except `App`)
- shadcn/ui pattern for primitives: `React.forwardRef` + `cn()` + `displayName`
- Dashboard pattern: `FooBarDashboard.tsx` (content) + `FooBarDashboardWithTabs.tsx` (tab wrapper)
- `WorkflowContext` has inline type re-declarations to avoid import circular issues — do NOT refactor these to shared imports without verifying
- `noUnusedLocals` + `noUnusedParameters` enforced by TS compiler
- `verbatimModuleSyntax` — use `import type` for type-only imports

## ANTI-PATTERNS (THIS PROJECT)
- No backend/API calls — all data from `src/data/mockData.ts`
- No test suite — no jest/vitest setup
- Do NOT add CSS outside Tailwind utility classes (only `src/index.css` for base)
- Do NOT use default exports for components

## COMMANDS
```bash
npm run dev        # Dev server (Vite)
npm run build      # tsc -b && vite build
npm run lint       # ESLint
npm run preview    # Preview production build
```

## NOTES
- `components.json` locks shadcn/ui config — modify UI primitives via shadcn CLI or by hand-matching the existing pattern
- `WorkflowContext` inlines some types from `src/types/workflow.ts` to avoid issues — types exist in both places
- `lucide-react` v1.16+ has different icon names than older versions
- MapLibre requires a style URL or local style — see existing map components for setup
