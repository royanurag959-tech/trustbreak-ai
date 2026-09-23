import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-mono font-black text-white">
          {t('aboutTitle')}
        </h1>
        <p className="text-cyan-400 font-mono text-lg font-bold">
          {t('aboutHeroTagline')}
        </p>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          {t('aboutHeroSubtitle')}
        </p>
      </div>

      {/* Philosophy Section */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 space-y-6">
        <h2 className="text-xl font-mono font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          {t('corePhilosophyHeading')}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {t('philosophyPara1')}
        </p>
        <blockquote className="p-4 rounded-xl bg-slate-950 border-l-4 border-cyan-400 text-slate-200 font-mono text-base italic">
          {t('philosophyQuote1')}
          <br />
          <span className="text-cyan-400 font-bold">{t('philosophyQuote2')}</span>
        </blockquote>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          {t('philosophyPara2')}
        </p>
      </section>

      {/* Safety Policy Section */}
      <section className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 space-y-4">
        <div className="flex items-center gap-3 text-amber-400 font-mono font-bold text-base">
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <span>{t('safetyMandateTitle')}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {t('safetyMandateText')}
        </p>
      </section>

      {/* Future Roadmap Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-mono font-bold text-white text-center">
          {t('roadmapTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-3">
            <div className="text-cyan-400 font-mono font-bold text-xs">{t('phase1Title')}</div>
            <h3 className="text-base font-mono font-bold text-white">{t('phase1Name')}</h3>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> {language === 'hi' ? 'सुरक्षित सिम्युलेटेड परीक्षण' : 'Safe simulated testing'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> {language === 'hi' ? 'एजेंट प्रबंधन एवं नीतियां' : 'Agent management & policies'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> {language === 'hi' ? 'भेद्यता का पता लगाना और स्कोरिंग' : 'Vulnerability detection & scoring'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> {language === 'hi' ? 'इंटरैक्टिव हमला पथ आरेख' : 'React Flow attack paths'}</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> {language === 'hi' ? 'पुनः परीक्षण स्कोर सुधार' : 'Retest score improvement'}</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-purple-400 font-mono font-bold text-xs">{t('phase2Title')}</div>
            <h3 className="text-base font-mono font-bold text-white">{t('phase2Name')}</h3>
            <ul className="text-xs text-slate-400 space-y-2">
              <li>• {language === 'hi' ? 'डॉकर आधारित माइक्रो-वीएम सैंडबॉक्स कंटेनर' : 'Docker-based microVM sandbox containers'}</li>
              <li>• {language === 'hi' ? 'लाइव एलएलएम प्रॉक्सी गार्डरेल्स' : 'Live LLM proxy guardrails'}</li>
              <li>• {language === 'hi' ? 'मल्टी-मॉडल हमला पेलोड (ध्वनि/छवि)' : 'Multi-modal attack payloads (voice/image)'}</li>
              <li>• {language === 'hi' ? 'स्वचालित सुधार पुल-रिक्वेस्ट जनरेटर' : 'Automated remediation PR generator'}</li>
              <li>• {language === 'hi' ? 'OWASP शीर्ष 10 एलएलएम अनुपालन निर्यात' : 'OWASP Top 10 for LLMs compliance exports'}</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="text-indigo-400 font-mono font-bold text-xs">{t('phase3Title')}</div>
            <h3 className="text-base font-mono font-bold text-white">{t('phase3Name')}</h3>
            <ul className="text-xs text-slate-400 space-y-2">
              <li>• {language === 'hi' ? 'सीआई/सीडी स्वचालित पाइपलाइन प्रतिगमन ब्लॉक' : 'CI/CD automated pipeline regression blocks'}</li>
              <li>• {language === 'hi' ? 'मल्टी-एजेंट विरोधी समूह परीक्षण' : 'Multi-agent swarm adversarial testing'}</li>
              <li>• {language === 'hi' ? 'संगठन-व्यापी नीति प्रबंधन मेष' : 'Organization-wide policy management mesh'}</li>
              <li>• {language === 'hi' ? 'रीयल-टाइम विसंगति हस्तक्षेप' : 'Real-time runtime anomaly intervention'}</li>
              <li>• {language === 'hi' ? 'एकीकृत सुरक्षा टेलीमेट्री' : 'Federated security telemetry'}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold text-sm transition-all"
        >
          <span>{t('startTestingNow')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
