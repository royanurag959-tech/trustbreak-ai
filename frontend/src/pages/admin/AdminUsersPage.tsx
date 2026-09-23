import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { Users, Search, Shield, Building, Mail } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { t, tDynamic, language } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any[]>('/admin/users')
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.organization || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Users className="w-6 h-6 text-purple-400" />
          {t('tenantUserMgmt')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('tenantUserMgmtDesc')}
        </p>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <Search className="w-4 h-4 text-slate-500 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchUsersPlaceholder')}
          className="w-full bg-transparent border-none text-white focus:outline-none"
        />
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
              <th className="pb-3 font-semibold">{t('userCol')}</th>
              <th className="pb-3 font-semibold">{t('orgCol')}</th>
              <th className="pb-3 font-semibold">{t('roleCol')}</th>
              <th className="pb-3 font-semibold">{t('activeAgentsCol')}</th>
              <th className="pb-3 font-semibold">{t('planCol')}</th>
              <th className="pb-3 font-semibold">{t('registeredCol')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-950/50">
                <td className="py-3.5">
                  <div className="font-bold text-white">{u.name}</div>
                  <div className="text-[11px] text-slate-400">{u.email}</div>
                </td>
                <td className="py-3.5 text-slate-300">{u.organization || 'Demo Corp'}</td>
                <td className="py-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'admin'
                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                        : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {tDynamic(u.role).toUpperCase()}
                  </span>
                </td>
                <td className="py-3.5 text-slate-200 font-bold">{u.agents_count} {language === 'hi' ? 'एजेंट' : 'Agents'}</td>
                <td className="py-3.5">
                  <span className="uppercase text-[11px] font-bold text-slate-300">
                    {tDynamic(u.plan)}
                  </span>
                </td>
                <td className="py-3.5 text-slate-400">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
