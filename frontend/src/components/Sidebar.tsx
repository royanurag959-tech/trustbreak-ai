import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  LayoutDashboard,
  Bot,
  ShieldAlert,
  Box,
  Crosshair,
  Activity,
  Bug,
  GitBranch,
  Search,
  Wrench,
  RefreshCw,
  FileText,
  History,
  GitCompare,
  DollarSign,
  CreditCard,
  Bell,
  Settings,
  User,
  Shield,
  LogOut,
  Users,
  LineChart,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-150 ${
      isActive
        ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400 font-bold'
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
    }`;

  const adminItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all duration-150 ${
      isActive
        ? 'bg-purple-500/15 text-purple-300 border-l-2 border-purple-400 font-bold'
        : 'text-purple-400/80 hover:text-purple-200 hover:bg-purple-950/30'
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-950/95 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto px-3 py-4 space-y-6 terminal-scroll flex-1">
          {/* Main Security Navigation */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              {t('corePlatform')}
            </div>
            <nav className="space-y-1">
              <NavLink to="/dashboard" onClick={onClose} className={navItemClass}>
                <LayoutDashboard className="w-4 h-4 shrink-0 text-cyan-400" />
                {t('dashboard')}
              </NavLink>

              <NavLink to="/agents" onClick={onClose} className={navItemClass}>
                <Bot className="w-4 h-4 shrink-0 text-blue-400" />
                {t('agents')}
              </NavLink>

              <NavLink to="/tests" onClick={onClose} className={navItemClass}>
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                {t('securityTests')}
              </NavLink>

              <NavLink to="/sandbox" onClick={onClose} className={navItemClass}>
                <Box className="w-4 h-4 shrink-0 text-indigo-400" />
                {t('sandbox')}
              </NavLink>

              <NavLink to="/simulate" onClick={onClose} className={navItemClass}>
                <Crosshair className="w-4 h-4 shrink-0 text-rose-400" />
                {t('attackSimulation')}
              </NavLink>

              <NavLink to="/monitor" onClick={onClose} className={navItemClass}>
                <Activity className="w-4 h-4 shrink-0 text-emerald-400" />
                {t('actionMonitor')}
              </NavLink>

              <NavLink to="/vulnerabilities" onClick={onClose} className={navItemClass}>
                <Bug className="w-4 h-4 shrink-0 text-rose-400" />
                {t('vulnerabilities')}
              </NavLink>

              <NavLink to="/attack-paths" onClick={onClose} className={navItemClass}>
                <GitBranch className="w-4 h-4 shrink-0 text-purple-400" />
                {t('attackPaths')}
              </NavLink>

              <NavLink to="/root-cause" onClick={onClose} className={navItemClass}>
                <Search className="w-4 h-4 shrink-0 text-cyan-400" />
                {t('rootCause')}
              </NavLink>

              <NavLink to="/fixes" onClick={onClose} className={navItemClass}>
                <Wrench className="w-4 h-4 shrink-0 text-amber-400" />
                {t('fixRecommendations')}
              </NavLink>

              <NavLink to="/retest" onClick={onClose} className={navItemClass}>
                <RefreshCw className="w-4 h-4 shrink-0 text-emerald-400" />
                {t('retest')}
              </NavLink>

              <NavLink to="/reports" onClick={onClose} className={navItemClass}>
                <FileText className="w-4 h-4 shrink-0 text-blue-400" />
                {t('reports')}
              </NavLink>

              <NavLink to="/history" onClick={onClose} className={navItemClass}>
                <History className="w-4 h-4 shrink-0 text-slate-400" />
                {t('history')}
              </NavLink>

              <NavLink to="/regression" onClick={onClose} className={navItemClass}>
                <GitCompare className="w-4 h-4 shrink-0 text-cyan-400" />
                {t('regressionTesting')}
              </NavLink>
            </nav>
          </div>

          {/* Business & Monetization */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              {t('opsAndRevenue')}
            </div>
            <nav className="space-y-1">
              <NavLink to="/earnings" onClick={onClose} className={navItemClass}>
                <DollarSign className="w-4 h-4 shrink-0 text-emerald-400" />
                {t('earnings')}
              </NavLink>

              <NavLink to="/subscription" onClick={onClose} className={navItemClass}>
                <CreditCard className="w-4 h-4 shrink-0 text-indigo-400" />
                {t('subscription')}
              </NavLink>
            </nav>
          </div>

          {/* Settings & Profile */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              {t('accountConfig')}
            </div>
            <nav className="space-y-1">
              <NavLink to="/notifications" onClick={onClose} className={navItemClass}>
                <Bell className="w-4 h-4 shrink-0 text-amber-400" />
                {t('notifications')}
              </NavLink>

              <NavLink to="/profile" onClick={onClose} className={navItemClass}>
                <User className="w-4 h-4 shrink-0 text-cyan-400" />
                {t('profile')}
              </NavLink>

              <NavLink to="/settings" onClick={onClose} className={navItemClass}>
                <Settings className="w-4 h-4 shrink-0 text-slate-400" />
                {t('settings')}
              </NavLink>
            </nav>
          </div>

          {/* Admin Management (for Admin users) */}
          {user?.role === 'admin' && (
            <div className="pt-2 border-t border-purple-500/20">
              <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                {t('adminConsole')}
              </div>
              <nav className="space-y-1">
                <NavLink to="/admin" onClick={onClose} className={adminItemClass}>
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  {t('adminDashboard')}
                </NavLink>

                <NavLink to="/admin/users" onClick={onClose} className={adminItemClass}>
                  <Users className="w-4 h-4 shrink-0" />
                  {t('adminUsers')}
                </NavLink>

                <NavLink to="/admin/monitoring" onClick={onClose} className={adminItemClass}>
                  <Activity className="w-4 h-4 shrink-0" />
                  {t('adminMonitoring')}
                </NavLink>

                <NavLink to="/admin/analytics" onClick={onClose} className={adminItemClass}>
                  <LineChart className="w-4 h-4 shrink-0" />
                  {t('platformTelemetry')}
                </NavLink>
              </nav>
            </div>
          )}
        </div>

        {/* Sidebar Footer: Signature Workflow & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <div className="mb-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-center text-slate-400">
            <span className="text-cyan-400 font-bold">{t('detect')}</span> →{' '}
            <span className="text-blue-400">{t('trace')}</span> →{' '}
            <span className="text-amber-400">{t('block')}</span> →{' '}
            <span className="text-emerald-400 font-bold">{t('trust')}</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-medium text-rose-400 hover:text-white hover:bg-rose-950/40 border border-rose-900/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>
      </aside>
    </>
  );
};
