import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { MainLayout } from './layouts/MainLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';

// Protected Pages
import { DashboardPage } from './pages/DashboardPage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDetailPage } from './pages/AgentDetailPage';
import { SecurityTestCenterPage } from './pages/SecurityTestCenterPage';
import { SandboxPage } from './pages/SandboxPage';
import { AttackSimulationPage } from './pages/AttackSimulationPage';
import { ActionMonitorPage } from './pages/ActionMonitorPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { AttackPathsPage } from './pages/AttackPathsPage';
import { RootCausePage } from './pages/RootCausePage';
import { FixRecommendationsPage } from './pages/FixRecommendationsPage';
import { RetestPage } from './pages/RetestPage';
import { ReportsPage } from './pages/ReportsPage';
import { HistoryPage } from './pages/HistoryPage';
import { RegressionTestingPage } from './pages/RegressionTestingPage';
import { EarningsPage } from './pages/EarningsPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminMonitoringPage } from './pages/admin/AdminMonitoringPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/agents/:id" element={<AgentDetailPage />} />
                <Route path="/tests" element={<SecurityTestCenterPage />} />
                <Route path="/sandbox" element={<SandboxPage />} />
                <Route path="/simulate" element={<AttackSimulationPage />} />
                <Route path="/monitor" element={<ActionMonitorPage />} />
                <Route path="/vulnerabilities" element={<VulnerabilitiesPage />} />
                <Route path="/attack-paths" element={<AttackPathsPage />} />
                <Route path="/root-cause" element={<RootCausePage />} />
                <Route path="/fixes" element={<FixRecommendationsPage />} />
                <Route path="/retest" element={<RetestPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/reports/:testId" element={<ReportsPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/regression" element={<RegressionTestingPage />} />
                <Route path="/earnings" element={<EarningsPage />} />
                <Route path="/subscription" element={<SubscriptionPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Admin Console */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/monitoring" element={<AdminMonitoringPage />} />
                <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
