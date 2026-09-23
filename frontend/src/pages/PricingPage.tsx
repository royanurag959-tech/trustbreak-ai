import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { Check, Zap, Shield, Sparkles, Building, ArrowRight } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: language === 'hi' ? "निःशुल्क" : "FREE",
      price: "$0",
      period: t('forever'),
      desc: t('freeDesc'),
      features: language === 'hi' ? [
        "3 एआई एजेंटों तक का समर्थन",
        "बुनियादी प्रॉम्प्ट इंजेक्शन एवं टूल दुरुपयोग परीक्षण",
        "सुरक्षित सैंडबॉक्स सिम्युलेटेड डेटाबेस एवं एपीआई",
        "बुनियादी सुरक्षा रिपोर्ट",
        "सामुदायिक तकनीकी सहायता"
      ] : [
        "Up to 3 AI Agents",
        "Basic Prompt Injection & Tool Misuse tests",
        "Safe Sandbox mock database & APIs",
        "Basic vulnerability report",
        "Community support"
      ],
      cta: t('currentFreeTier'),
      popular: false
    },
    {
      id: "pro",
      name: language === 'hi' ? "प्रो" : "PRO",
      price: "$49",
      period: t('perMonth'),
      desc: t('proDesc'),
      features: language === 'hi' ? [
        "15 एआई एजेंटों तक का समर्थन",
        "सभी 6 सुरक्षा परीक्षण सूट",
        "इंटरैक्टिव हमला पथ आरेख (React Flow)",
        "डिटेक्ट → फिक्स → पुनः परीक्षण वर्कफ़्लो",
        "हमला पुनरावृत्ति एवं संस्करण तुलना",
        "डाउनलोड करने योग्य सुरक्षा रिपोर्ट",
        "मानक सेवा स्तर समझौता (SLA)"
      ] : [
        "Up to 15 AI Agents",
        "All 6 Security Test Suites",
        "Interactive React Flow Attack Paths",
        "Signature Break → Fix → Retest Workflow",
        "Attack Replay & Regression Comparison",
        "Downloadable Executive Reports",
        "Standard SLA"
      ],
      cta: t('upgradeToPro'),
      popular: true
    },
    {
      id: "business",
      name: language === 'hi' ? "बिज़नेस" : "BUSINESS",
      price: "$149",
      period: t('perMonth'),
      desc: t('businessDesc'),
      features: language === 'hi' ? [
        "50 एआई एजेंटों तक का समर्थन",
        "कस्टम सुरक्षा नीति नियम इंजन",
        "टीम एक्सेस एवं भूमिका आधारित नियंत्रण",
        "निरंतर प्रतिगमन एवं विचलन परीक्षण",
        "समर्पित सैंडबॉक्स वर्कर पूल",
        "उन्नत सुरक्षा रिपोर्ट निर्यात (JSON/PDF)",
        "प्राथमिकता 24/7 तकनीकी सहायता"
      ] : [
        "Up to 50 AI Agents",
        "Custom Policy Engine rules",
        "Team access & RBAC controls",
        "Continuous Regression testing",
        "Dedicated sandbox worker pools",
        "Advanced vulnerability exports (PDF/JSON)",
        "Priority 24/7 support"
      ],
      cta: t('upgradeToBusiness'),
      popular: false
    },
    {
      id: "enterprise",
      name: language === 'hi' ? "एंटरप्राइज" : "ENTERPRISE",
      price: "$499",
      period: t('perMonth'),
      desc: t('enterpriseDesc'),
      features: language === 'hi' ? [
        "असीमित एआई एजेंट",
        "कस्टम हमला पेलोड एवं विरोधी प्लगइन्स",
        "मल्टी-टेनेंट संगठन पृथक्करण",
        "कस्टम अनुपालन ऑडिट फ्रेमवर्क (OWASP LLM)",
        "समर्पित सुरक्षा वास्तुकार",
        "कस्टम सिंगल साइन-ऑन (SSO) एकीकरण"
      ] : [
        "Unlimited AI Agents",
        "Custom attack payloads & adversarial plugins",
        "Multi-organization tenant isolation",
        "Custom compliance audit frameworks (OWASP LLM)",
        "Dedicated Security Architect",
        "Custom SSO & SAML integration"
      ],
      cta: t('contactEnterprise'),
      popular: false
    }
  ];

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setUpgrading(planId);
    try {
      await api.post('/subscription/upgrade', { plan: planId });
      showToast(language === 'hi' ? `${planId.toUpperCase()} योजना में सफलतापूर्वक अपग्रेड किया गया!` : `Successfully upgraded to ${planId.toUpperCase()} plan!`, 'success');
      navigate('/subscription');
    } catch (err: any) {
      showToast(err.message || 'Upgrade failed', 'error');
    } finally {
      setUpgrading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-mono font-black text-white">
          {t('pricingHeaderTitle')}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base font-sans">
          {t('pricingHeaderSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => {
          return (
            <div
              key={p.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 ${
                p.popular
                  ? 'bg-slate-900 border-2 border-cyan-400 shadow-xl shadow-cyan-500/15 relative'
                  : 'bg-slate-900/60 border border-slate-800'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-mono text-[10px] font-bold tracking-wider uppercase">
                  {t('popularBadge')}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-mono font-bold text-lg text-white">{p.name}</h3>
                  {p.popular && <Sparkles className="w-4 h-4 text-cyan-400" />}
                </div>

                <div className="flex items-baseline gap-1 my-4 font-mono">
                  <span className="text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-slate-400">/{p.period}</span>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {p.desc}
                </p>

                <div className="space-y-2.5 mb-6 text-xs text-slate-300">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleUpgrade(p.id)}
                disabled={upgrading === p.id}
                className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  p.popular
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                {upgrading === p.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{p.cta}</span>
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
