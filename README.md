# Cold Storage Management System

A comprehensive dashboard application for managing cold storage facilities across multiple levels - HQ, Regional, and Facility.

## 🚀 Features

### Three Dashboard Levels

1. **HQ Dashboard** (Chief Operating Officer)
   - Pan-India network overview (50+ facilities)
   - Key performance metrics (capacity, shrinkage, energy costs, compliance)
   - Facility performance comparison
   - Stock mix analysis across network
   - Regional energy cost comparison
   - Real-time network alerts with financial impact
   - Business ROI analysis
   - Growth & expansion intelligence
   - ESG & sustainability metrics

2. **Regional Dashboard** (Regional Operations Manager - South Region)
   - Facility health ranking (8 facilities in Tamil Nadu, Karnataka, Kerala)
   - Network-wide inventory optimization
   - Aging inventory alerts with action recommendations
   - Demand forecasting by region
   - Cross-facility transfer queue (AI-suggested moves)
   - Pricing recommendation engine
   - Staff & performance metrics
   - Financial summary by facility

3. **Facility Dashboard** (Facility Manager - Chennai)
   - Critical alerts with financial impact (temperature breaches, door issues, compressor problems)
   - Real-time operational metrics
   - Batch aging heatmap (SKU-level analysis)
   - Cross-facility transfer suggestions
   - Compliance & documentation (one-click FSSAI/FDA reports)
   - Energy & sustainability metrics
   - Equipment efficiency tracking

## 🛠️ Tech Stack

- **React 19.2** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Recharts** - Charts and visualizations
- **Lucide React** - Icons

## 📦 Installation

```bash
# Navigate to project directory
cd Cold-Storage

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

## ✨ NEW: Interactive Workflows

The application now features **fully interactive workflows** that simulate real user scenarios:

### 🎮 What You Can Do

1. **✅ Click on Alerts** - View details and take action
   - Resolve alerts with notes
   - Escalate to regional or HQ level
   - See financial impact saved

2. **✅ Approve/Reject Transfers** - Cross-facility inventory moves
   - Review AI-suggested transfers
   - See cost savings calculations
   - Track approval status

3. **✅ Generate Reports** - One-click compliance documents
   - FSSAI, FDA, EU GDP reports
   - Temperature logs
   - Cleaning & maintenance logs

4. **✅ Track Action History** - See everything you've done
   - Toggle history view
   - See financial impact of each action
   - Track who did what and when

### 🎯 Try These Scenarios

**Scenario 1: Resolve a Critical Alert**
```
1. Select "Facility Dashboard" from dropdown
2. Click on any red critical alert
3. Read the alert details (shows ₹45,000 at risk)
4. Enter resolution notes: "Technician dispatched, issue resolved"
5. Click "Resolve Alert"
6. ✅ Alert marked as resolved
7. ✅ ₹45,000 saved shown in action history
```

**Scenario 2: Escalate an Alert**
```
1. Click on an alert
2. Click "Escalate to Regional" button
3. ✅ Alert forwarded to regional manager
4. ✅ Status changes to "ESCALATED"
5. ✅ Escalation time logged
```

**Scenario 3: Approve Transfer Request**
```
1. Scroll to "Cross-Facility Transfer Suggestions"
2. See transfer: "Move 5 tonnes mangoes Chennai → Bangalore"
3. Shows savings: ₹40,000
4. Click "Approve Transfer"
5. ✅ Status changes to "APPROVED"
6. ✅ Action logged with financial impact
```

**Scenario 4: Generate Compliance Report**
```
1. Scroll to "Compliance & Documentation"
2. Click "Generate Report" for FSSAI
3. ✅ Report generated instantly
4. ✅ Action logged to history
5. ✅ Saves 20-40 hours of manual work!
```

### 📖 Full Documentation

See [WORKFLOWS.md](./WORKFLOWS.md) for complete workflow documentation including:
- Detailed user journeys
- Escalation matrices
- Real-world scenarios
- Technical implementation

## 🎯 Usage

### Role Switching

The application features a role-based dropdown in the header that allows you to switch between three dashboard views:

1. **HQ Dashboard** - Strategic overview for COO
2. **Regional Dashboard** - Tactical management for regional managers
3. **Facility Dashboard** - Operational control for facility managers

### Dashboard Navigation

Each dashboard is self-contained with:
- **Header** - Shows current role and facility/region scope
- **Key Metrics** - Top-level KPIs with trends
- **Charts** - Interactive data visualizations
- **Alerts** - Action items with financial impact
- **Tables** - Detailed data breakdowns
- **Cards** - Organized information sections

## 📊 Key Features Explained

### Financial Context
Every alert and action includes financial impact in Indian Rupees (₹), helping users understand the business implications of their decisions.

### Alert Severity
- 🔴 **Critical** - Immediate action required, high financial impact
- 🟡 **Warning** - Attention needed, moderate impact
- 🔵 **Info** - For awareness, low impact

### Action-Oriented Design
- One-click compliance report generation
- Transfer approval buttons
- Export functionality for all documents
- Real-time alert notifications

### Data Flow
- **Bottom-Up**: Facility → Regional → HQ (real-time data aggregation)
- **Top-Down**: HQ → Regional → Facility (strategic decisions and targets)

## 🏗️ Project Structure

```
Cold-Storage/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── HQDashboard.tsx          # HQ-level view
│   │   │   ├── RegionalDashboard.tsx    # Regional view
│   │   │   └── FacilityDashboard.tsx    # Facility view
│   │   ├── ui/
│   │   │   ├── badge.tsx                # Badge component
│   │   │   ├── button.tsx               # Button component
│   │   │   ├── card.tsx                 # Card component
│   │   │   └── select.tsx               # Select component
│   │   └── RoleSwitcher.tsx             # Role selector
│   ├── data/
│   │   └── mockData.ts                  # Comprehensive mock data
│   ├── types/
│   │   └── index.ts                     # TypeScript types
│   ├── lib/
│   │   └── utils.ts                     # Utility functions
│   ├── App.tsx                          # Main application
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Global styles
├── components.json                      # shadcn/ui config
├── tailwind.config.js                   # Tailwind configuration
├── tsconfig.json                        # TypeScript config
├── vite.config.ts                       # Vite configuration
└── package.json                         # Dependencies

```

## 🎨 Customization

### Adding New Data

Edit `src/data/mockData.ts` to modify or add new data points:

```typescript
export const hqStats: HQStats = {
  capacityUsed: 78,
  shrinkageLoss: 1.9,
  energyCost: 1850,
  compliance: 94,
};
```

### Modifying Dashboard Layout

Each dashboard component is independent. You can modify `src/components/dashboard/[DashboardName].tsx` to customize layouts, add new sections, or modify existing ones.

### Adding New UI Components

Use shadcn/ui components from `src/components/ui/` or create new ones following the same pattern.

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📈 Mock Data Details

### HQ Dashboard
- 5 facilities tracked
- 5 stock categories
- 4 regions
- 3 active network alerts
- ROI data for 5 facilities

### Regional Dashboard (South)
- 4 facilities ranked
- 3 aging inventory items
- 2 demand forecasts
- 2 transfer suggestions
- 2 pricing recommendations
- 3 facilities' staff data
- 3 facilities' financial data

### Facility Dashboard (Chennai)
- 5 critical alerts
- 6 operational metrics
- 3 batch items
- 1 transfer request
- 3 compliance documents
- 6-month energy trend

## 🎓 Learning Resources

This project demonstrates:
- Role-based dashboard design
- Complex data visualization
- Financial impact tracking
- Alert management systems
- Multi-level organizational hierarchies
- React component composition
- TypeScript type safety
- Responsive design with Tailwind CSS

## 🚀 Future Enhancements

Potential additions to the system:
- Real-time data integration with APIs
- WebSocket support for live alerts
- Authentication system
- Database integration (PostgreSQL/Neon)
- Export to PDF/Excel
- Dark mode toggle
- Mobile app version
- Advanced filtering and search
- Historical data analysis
- Predictive analytics

## 📝 License

This is a demo project for educational purposes.

## 👥 Contributing

This is a demonstration project. Feel free to fork and modify for your own use cases.

---

**Built with ❤️ using React, TypeScript, and shadcn/ui**
