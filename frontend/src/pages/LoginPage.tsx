import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please provide both email and password', 'warning');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to TRUSTBREAK AI', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = async (type: 'demo' | 'admin') => {
    setLoading(true);
    try {
      await quickLogin(type);
      showToast(`Logged in as ${type === 'demo' ? 'Demo User' : 'Admin'}`, 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Quick login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-mono font-bold text-white tracking-wider">
            {t('authenticateTitle')}
          </h1>
          <p className="text-xs font-mono text-slate-400">
            {t('signInSubtitle')}
          </p>
        </div>

        {/* Demo Fast Track Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 font-bold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> {t('instantDemoAccess')}
            </span>
            <span className="text-[10px] text-slate-400">{t('preSeeded')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuick('demo')}
              disabled={loading}
              className="py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 transition-colors text-left truncate flex items-center justify-between"
            >
              <span>{t('quickDemoUser')}</span>
              <span className="text-[10px] text-cyan-400 font-bold">{t('oneClick')}</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuick('admin')}
              disabled={loading}
              className="py-2 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-purple-500/40 text-xs font-mono text-purple-300 transition-colors text-left truncate flex items-center justify-between"
            >
              <span>{t('quickAdminUser')}</span>
              <span className="text-[10px] text-purple-400 font-bold">{t('oneClick')}</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@trustbreak.ai"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {t('passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t('signIn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs font-mono text-slate-400">
            {t('dontHaveAccount')}{' '}
            <Link to="/register" className="text-cyan-400 hover:underline">
              {t('registerOrgLink')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
