# DataPulse - Business Intelligence Dashboard

**Author:** Khanyisa Ntsako Shikwambana

## Project Overview

DataPulse is a React-based business intelligence dashboard built with Vite and Tailwind CSS. It provides an interactive analytics experience for sales and user behavior data, including:
- Sales performance and revenue monitoring
- User analytics tracking (sessions, page views, bounce rate, retention)
- Data import via CSV / Excel / JSON upload
- Sample data generation for local demos
- AI-powered insight generation using a model integration
- A unified dashboard layout with navigation, KPIs, charts, and tables

This project uses a combination of custom UI components and a backend SDK integration for app data access.

## Architecture and File Structure

The application is organized into the following top-level folders:
- `src/api/` — API client configuration and backend integration
- `src/components/` — reusable UI components, dashboard widgets, charts, data import controls, and layout pieces
- `src/lib/` — shared utilities, app parameter handling, theme and auth context, query client, and sample data helpers
- `src/pages/` — page routes for the main dashboard sections
- `src/test/` — unit tests and test configuration
- `src/index.css` — global Tailwind CSS and theme definitions
- `src/main.jsx` — application bootstrap
- `src/App.jsx` — routing and provider composition

### Entry Point
- `src/main.jsx` — mounts React into `#root`
- `src/App.jsx` — wraps the app with providers and defines routes

### API Client
- `src/api/khanyisaClient.js` — exports `khanyisaApi`, the central backend client configured with app parameters from `src/lib/app-params.js`
- `src/lib/app-params.js` — reads environment variables and URL query parameters for app credentials and backend URLs

### State and Theme Management
- `src/lib/query-client.js` — configures TanStack Query with retry and refetch behavior
- `src/lib/ThemeContext.jsx` — stores the dark/light theme choice and syncs it to `localStorage`
- `src/lib/AuthContext.jsx` — provides authentication state across the app and integrates with the backend auth flow

### Main Pages
- `src/pages/SalesOverview.jsx` — revenue, profit, conversion, and product/region analytics
- `src/pages/UserAnalyticsPage.jsx` — sessions, page views, bounce rate, traffic source segmentation, and retention
- `src/pages/InsightsPage.jsx` — AI-generated insights, trend analysis, and revenue forecasting
- `src/pages/DataManagement.jsx` — data import, sample data loader, and preview of stored records

### Core Components
- `src/components/ui/error-boundary.jsx` — error boundary for graceful error handling
- `src/components/layout/DashboardLayout.jsx` — dashboard scaffolding and content container
- `src/components/layout/Sidebar.jsx` — navigation and theme controls
- `src/components/dashboard/PageHeader.jsx` — page title, subtitle, and action area
- `src/components/dashboard/KPICard.jsx` — KPI card component for metrics display
- `src/components/dashboard/ChartCard.jsx` — reusable tiled chart wrapper
- `src/components/data/FileUploader.jsx` — file upload and extraction workflow
- `src/components/data/SampleDataLoader.jsx` — sample data generation and upload
- `src/components/data/DataPreview.jsx` — record preview for SalesData and UserAnalytics
- `src/components/analytics/` — charts for sessions, page views, top pages, segmentation, and retention
- `src/components/sales/` — revenue chart, product performance, funnel, and regional sales visualizations
- `src/components/insights/` — static insight cards, forecast chart, and trend analysis

## Features

### Dynamic Dashboards
- Sales dashboard with revenue trend, profit, conversion rate, product performance, and region breakdown
- User analytics dashboard with session trends, source segmentation, bounce rate, and retention charts
- Reusable date filters and dropdown filters for region/segment analysis

### Data Management
- Upload CSV/Excel/JSON files using the `FileUploader` component
- Automatically extract fields from uploaded files before saving records
- Load realistic sample data when the database is empty or for demos
- Preview current records in tabbed UI with a data table

### AI Insights
- Generates structured AI insights from sales and analytics summaries
- Uses `khanyisaApi.integrations.Core.InvokeLLM()` to call the integrated model
- Displays both rule-based static insights and AI-generated recommendations

### Theming and UX
- Light / dark theme toggle via `ThemeContext`
- Luxury palette and custom CSS token theming in `src/index.css`
- Smooth responsive layout using Tailwind CSS utility classes
- Sidebar navigation with route-aware styling

### Error Handling
- React Error Boundary catches and handles JavaScript errors gracefully
- User-friendly error messages with retry options
- Detailed error logging in development mode
- Prevents app crashes and improves user experience

### Testing
- Unit tests with Vitest and React Testing Library
- Component testing for UI reliability
- Automated test suite for regression prevention

## Routing

The app supports these routes:
- `/` — Sales Overview dashboard
- `/sales` — Sales Overview
- `/analytics` — User Analytics dashboard
- `/users` — alias route for User Analytics dashboard
- `/insights` — AI Insights dashboard
- `/data` — Data Management dashboard
- `*` — 404 fallback page via `src/lib/PageNotFound.jsx`

## Installation and Local Development

### Prerequisites
- Node.js (recommended 18.x or later)
- npm installed globally
- Access to the correct backend app credentials if using a real backend

### Install dependencies
```bash
npm install
```

### Environment variables
Create a `.env.local` file in the project root with:
```env
VITE_KHANYISA_APP_ID=your_app_id
VITE_KHANYISA_APP_BASE_URL=your_backend_url
VITE_KHANYISA_FUNCTIONS_VERSION=latest
```
These values are used as default app configuration in `src/lib/app-params.js`.

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Lint and typecheck
```bash
npm run lint
npm run lint:fix
npm run typecheck
```

### Run tests
```bash
npm test
```

## How the data flow works

1. `App.jsx` loads providers and routes.
2. Pages call `useQuery` from `@tanstack/react-query` to fetch data from `khanyisaApi`.
3. `khanyisaApi` is initialized in `src/api/khanyisaClient.js` with values from `src/lib/app-params.js`.
4. If no live data exists, pages fall back to generated data from `src/lib/sampleData.js`.
5. UI components render charts and cards using computed KPI values.
6. Data import saves records through the backend integration and refreshes query caches.

## Styling and UI

- `src/index.css` contains custom CSS variables, theme tokens, and Tailwind directives.
- Tailwind CSS is used throughout for layout and utility styling.
- The application uses Radix UI-based component primitives in `src/components/ui/`.
- `lucide-react` provides iconography.
- `recharts` renders charts and graphs.

## Important Project Decisions

- The project is branded as `khanyisa-datapulse` with `Khanyisa` as the author.
- `khanyisaApi` was created as the main SDK client wrapper.
- Tailwind CSS rules are intentionally used with editor configuration to support `@tailwind` and `@apply` directives.
- Data pages aggressively fall back to sample data for demo resilience.
- AI insight generation is designed as an optional enhancement rather than required core functionality.
- Unit tests are set up with Vitest and React Testing Library for component reliability.
- Error boundaries provide graceful error handling and user-friendly error messages.

## References and Sources

- React: https://react.dev/ (React 18 + hooks)
- Vite: https://vitejs.dev/ (Fast development build tool)
- Tailwind CSS: https://tailwindcss.com/ (Utility-first CSS framework)
- Backend SDK library used for app data management
- React Router: https://reactrouter.com/ (Client-side routing)
- TanStack Query: https://tanstack.com/query/v5 (Data fetching and cache management)
- Recharts: https://recharts.org/ (Charting library)
- Lucide React: https://lucide.dev/ (Icon library)
- date-fns: https://date-fns.org/ (Date formatting)
- next-themes: https://github.com/pacocoursey/next-themes (Theme handling)
- Tailwind Merge: https://github.com/dcastil/tailwind-merge (Class merging)
- Framer Motion: https://www.framer.com/motion/ (Animation)
- Radix UI: https://www.radix-ui.com/ (Accessible primitives)
- Vitest: https://vitest.dev/ (Unit testing framework)
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/ (Component testing utilities)
- Dashboard hero image generated by ChatGPT 

## Notes

- The app is structured to support both real backend data and local demo data.
- `src/lib/ThemeContext.jsx` persists theme choice to `localStorage`.
- `src/lib/query-client.js` sets a minimal retry strategy for queries.
- `src/lib/app-params.js` turns URL query parameters into app configuration values.

## Project 

This repo is ready for local development, visual testing, and iterative enhancements. Use the existing page and component folders to add new dashboards, entity types, or analytics widgets.

---
