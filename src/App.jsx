// App root component, used to wire together global providers and routing.
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import { queryClient } from '@/lib/query-client';
import ErrorBoundary from '@/components/ui/error-boundary';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SalesOverview from '@/pages/SalesOverview';
import UserAnalyticsPage from '@/pages/UserAnalyticsPage';
import InsightsPage from '@/pages/InsightsPage';
import DataManagement from '@/pages/DataManagement';
import PageNotFound from '@/lib/PageNotFound';
import '@/index.css';

function App() {
  return (
    <ErrorBoundary>
      {/* Provide shared functionality across the entire app. */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes share the dashboard shell layout. */}
                <Route element={<DashboardLayout />}>
                  <Route index element={<SalesOverview />} />
                  <Route path="sales" element={<SalesOverview />} />
                  <Route path="analytics" element={<UserAnalyticsPage />} />
                  <Route path="users" element={<UserAnalyticsPage />} />
                  <Route path="insights" element={<InsightsPage />} />
                  <Route path="data" element={<DataManagement />} />
                </Route>
                {/* Fallback route for unknown URLs. */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
