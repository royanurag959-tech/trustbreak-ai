import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Notification } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Bell, Check, CheckCheck, ShieldAlert, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { showToast } = useToast();
  const { t, tDynamic } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const data = await api.get<Notification[]>('/notifications');
      setNotifications(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAll = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast(t('markAllRead'), 'info');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-amber-400" />
            {t('notificationsTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('notificationsSubtitle')}
          </p>
        </div>

        <button
          onClick={handleMarkAll}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-300 font-semibold flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4" />
          <span>{t('markAllRead')}</span>
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">{t('loadingNotifications')}</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {t('noNotifications')}
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 text-xs ${
                n.read
                  ? 'bg-slate-900/40 border-slate-850 opacity-70'
                  : 'bg-slate-900 border-slate-700 shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {n.type === 'critical' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  ) : n.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Info className="w-5 h-5 text-cyan-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{tDynamic(n.title)}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1 leading-relaxed font-sans text-xs">
                    {tDynamic(n.message)}
                  </p>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold shrink-0"
                >
                  {t('markRead')}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
