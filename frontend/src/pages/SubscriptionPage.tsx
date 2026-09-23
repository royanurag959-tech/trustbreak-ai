import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Subscription } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CreditCard, Check, Sparkles, Shield, ArrowRight } from 'lucide-react';

export const SubscriptionPage: React.FC = () => {
  const { showToast } = useToast();
  const { t, tDynamic, language } = useLanguage();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const fetchSub = async () => {
    try {
      const data = await api.get<Subscription>('/subscription');
      setSub(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSub();
  }, []);

  const handleUpgrade = async (plan: string) => {
    setUpgrading(plan);
    try {
      const updated = await api.post<Subscription>('/subscription/upgrade', { plan });
      setSub(updated);
      showToast(`${t('activePlanStatus')}: ${tDynamic(plan)}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Upgrade failed', 'error');
    } finally {
      setUpgrading(null);
    }
  };

  const currentPlan = sub?.plan || 'pro';

  const plans = [
    {
      id: 'free',
      name: language === 'hi' ? 'निःशुल्क' : 'FREE',
      price: language === 'hi' ? '$0/माह' : '$0/mo',
      desc: t('freeDesc')
    },
    {
      id: 'pro',
      name: language === 'hi' ? 'प्रो' : 'PRO',
      price: language === 'hi' ? '$49/माह' : '$49/mo',
      desc: t('proDesc')
    },
    {
      id: 'business',
      name: language === 'hi' ? 'बिज़नेस' : 'BUSINESS',
      price: language === 'hi' ? '$149/माह' : '$149/mo',
      desc: t('businessDesc')
    }
  ];

  return (
    <div className="space-y-8 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <CreditCard className="w-6 h-6 text-indigo-400" />
          {t('subscriptionTitle')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('subscriptionSubtitle')}
        </p>
      </div>

      {/* Current Active Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-cyan-400 uppercase font-bold tracking-wider block mb-1">
            {t('activePlanStatus')}
          </span>
          <h2 className="text-2xl font-black text-white uppercase">
            {tDynamic(currentPlan)} {t('tierUpper')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('billingMonthlyNotice').replace('${price}', String(sub?.price_monthly || 49))}
          </p>
        </div>

        <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
          {t('activeSubscription')}
        </span>
      </div>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = currentPlan.toLowerCase() === p.id;
          return (
            <div
              key={p.id}
              className={`p-6 rounded-2xl flex flex-col justify-between ${
                isCurrent
                  ? 'bg-slate-900 border-2 border-cyan-400 shadow-xl shadow-cyan-500/10'
                  : 'bg-slate-900/60 border border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base">{p.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] text-cyan-300 font-bold bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">
                      {t('currentBadge')}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-black text-white my-3">{p.price}</div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
                  {p.desc}
                </p>
              </div>

              <button
                onClick={() => handleUpgrade(p.id)}
                disabled={isCurrent || upgrading === p.id}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-slate-800 text-slate-500 cursor-default'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md shadow-cyan-500/20'
                }`}
              >
                {upgrading === p.id ? (
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : isCurrent ? (
                  <span>{t('currentPlanBtn')}</span>
                ) : (
                  <>
                    <span>{t('switchToPlan')} {p.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
