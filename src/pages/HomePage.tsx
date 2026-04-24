import React from 'react';
import { motion } from 'framer-motion';
import { SITE_CONFIG } from '@/lib/site.config';
import EditableText from '@/components/EditableText';
import { Check, Star, ArrowRight, Users, TrendingUp, Zap } from 'lucide-react';

const C = SITE_CONFIG;
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: 'var(--bu-background, #FAFAFA)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, var(--bu-accent, #9B85C4), transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--bu-secondary, #C4956A), transparent 70%)' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
          className="flex justify-center mb-8">
          <img src="/images/becomeus_logo.png" alt="BecomeUs" className="h-16 md:h-20 w-auto object-contain" />
        </motion.div>

        {/* Titre hero */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="font-extrabold tracking-tight mb-6 leading-tight">
          <EditableText id="hero.title" as="span"
            defaults={{ text: C.brand.heroTitle, fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '800' }} />{' '}
          <EditableText id="hero.accent1" as="span"
            defaults={{ text: C.brand.heroTitleAccent1, fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontFamily: 'Poppins', color: '#C4956A', fontWeight: '800' }} />{' '}
          <EditableText id="hero.accent2" as="span"
            defaults={{ text: C.brand.heroTitleAccent2, fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontFamily: 'Poppins', color: '#7A90B5', fontWeight: '800' }} />
        </motion.h1>

        {/* Citation */}
        <motion.blockquote initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
          className="relative max-w-xl mx-auto mb-8">
          <div className="absolute -left-4 top-0 text-5xl leading-none font-serif select-none opacity-40"
            style={{ color: 'var(--bu-secondary,#C4956A)' }}>"</div>
          <p className="italic px-6 py-4 rounded-2xl border"
            style={{ background: 'color-mix(in srgb,var(--bu-accent,#9B85C4) 12%,white)', borderColor: 'color-mix(in srgb,var(--bu-accent,#9B85C4) 25%,white)' }}>
            <EditableText id="hero.tagline1" as="span"
              defaults={{ text: 'On arrive seul.', fontSize: '1rem', fontFamily: 'Poppins', color: '#7A90B5', fontWeight: '600' }}
              className="not-italic" />{' '}
            <EditableText id="hero.tagline2" as="span"
              defaults={{ text: 'On repart', fontSize: '1rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />{' '}
            <EditableText id="hero.tagline3" as="span"
              defaults={{ text: 'en équipe.', fontSize: '1rem', fontFamily: 'Poppins', color: '#C4956A', fontWeight: '600' }}
              className="not-italic" />
          </p>
          <div className="absolute -right-4 bottom-0 text-5xl leading-none font-serif select-none opacity-40 rotate-180"
            style={{ color: 'var(--bu-secondary,#C4956A)' }}>"</div>
        </motion.blockquote>

        {/* Sous-titre */}
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}
          className="max-w-2xl mx-auto mb-10 leading-relaxed">
          <EditableText id="hero.subtitle" as="span"
            defaults={{ text: C.brand.subtitle, fontSize: '1rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
        </motion.p>

        {/* Boutons CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.42 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => scrollTo('pricing')}
            className="group flex items-center gap-2 font-semibold px-8 py-4 hover:opacity-90 transition-all shadow-lg text-white rounded-full"
            style={{ background: 'var(--bu-primary,#7A90B5)' }}>
            <EditableText id="hero.cta1" as="span"
              defaults={{ text: 'Commencer gratuitement', fontSize: '1rem', fontFamily: 'Poppins', color: '#FFFFFF', fontWeight: '600' }} />
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => scrollTo('how-it-works')}
            className="flex items-center gap-2 font-medium px-6 py-4 border border-gray-300 rounded-full hover:opacity-80 transition-all"
            style={{ color: 'var(--bu-text-muted,#6B7A90)' }}>
            <EditableText id="hero.cta2" as="span"
              defaults={{ text: 'Voir comment ça marche', fontSize: '1rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '500' }} />
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: 'var(--bu-primary,#7A90B5)' }} />
            <EditableText id="stat.1" as="span"
              defaults={{ text: '500+ équipes accompagnées', fontSize: '0.875rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
          </div>
          <div className="w-px h-4 bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: 'var(--bu-secondary,#C4956A)' }} />
            <EditableText id="stat.2" as="span"
              defaults={{ text: '+40% de rétention en moyenne', fontSize: '0.875rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
          </div>
          <div className="w-px h-4 bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: 'var(--bu-accent,#9B85C4)' }} />
            <EditableText id="stat.3" as="span"
              defaults={{ text: '2x plus vite intégré', fontSize: '0.875rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
          </div>
        </motion.div>

        {/* Mini dashboard */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                {['bg-red-300','bg-yellow-300','bg-green-300'].map(c=><div key={c} className={`w-3 h-3 rounded-full ${c}`}/>)}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-5 text-xs text-gray-400 flex items-center px-3">app.becomeus.io/dashboard</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Talha K.', status: 'Semaine 3', progress: 75, color: 'var(--bu-primary,#7A90B5)' },
                { label: 'Léa B.', status: 'Semaine 1', progress: 30, color: 'var(--bu-secondary,#C4956A)' },
                { label: 'Marcus D.', status: 'Intégré ✓', progress: 100, color: 'var(--bu-accent,#9B85C4)' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold mb-2 text-gray-700">
                    {item.label.charAt(0)}
                  </div>
                  <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400 mb-2">{item.status}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${item.progress}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONCEPT ──────────────────────────────────────────────────────────────────
function ConceptSection() {
  return (
    <section id="concept" className="py-24" style={{ background: 'var(--bu-background,#FAFAFA)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-3">
            <EditableText id="concept.badge" as="span"
              defaults={{ text: 'Notre approche', fontSize: '0.875rem', fontFamily: 'Poppins', color: '#7A90B5', fontWeight: '600' }} />
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold mb-5">
            <EditableText id="concept.title1" as="span"
              defaults={{ text: 'Le management, ', fontSize: '2.5rem', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '800' }} />
            <EditableText id="concept.title2" as="span"
              defaults={{ text: "c'est du coaching", fontSize: '2.5rem', fontFamily: 'Poppins', color: '#C4956A', fontWeight: '800' }} />
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-2xl mx-auto">
            <EditableText id="concept.subtitle" as="span"
              defaults={{ text: C.concept.subtitle, fontSize: '1rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
          </motion.p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
          {C.concept.cards.map((card, i) => (
            <motion.div key={i} variants={fadeUp} className="border rounded-2xl p-7 hover:shadow-md transition-all"
              style={{ background: card.bgColor, borderColor: card.borderColor }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5" style={{ background: card.borderColor }}>
                {card.icon}
              </div>
              <h3 className="font-bold mb-3">
                <EditableText id={`concept.card${i}.title`} as="span"
                  defaults={{ text: card.title, fontSize: '1.05rem', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '700' }} />
              </h3>
              <EditableText id={`concept.card${i}.desc`} as="p" className="leading-relaxed"
                defaults={{ text: card.description, fontSize: '0.9rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24" style={{ background: '#F7F8FC' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-3">
            <EditableText id="how.badge" as="span"
              defaults={{ text: '3 étapes simples', fontSize: '0.875rem', fontFamily: 'Poppins', color: '#C4956A', fontWeight: '600' }} />
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold">
            <EditableText id="how.title" as="span"
              defaults={{ text: 'Comment ça marche', fontSize: '2.5rem', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '800' }} />
          </motion.h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8">
          {C.howItWorks.steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm" style={{ background: step.bg }}>
                <span className="text-2xl font-extrabold" style={{ color: step.color }}>{step.number}</span>
              </div>
              <h3 className="font-bold mb-3">
                <EditableText id={`how.step${i}.title`} as="span"
                  defaults={{ text: step.title, fontSize: '1.1rem', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '700' }} />
              </h3>
              <EditableText id={`how.step${i}.desc`} as="p" className="leading-relaxed"
                defaults={{ text: step.description, fontSize: '0.9rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24" style={{ background: 'var(--bu-background,#FAFAFA)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-3">
            <EditableText id="testi.badge" as="span"
              defaults={{ text: 'Ils nous font confiance', fontSize: '0.875rem', fontFamily: 'Poppins', color: '#9B85C4', fontWeight: '600' }} />
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold">
            <EditableText id="testi.title" as="span"
              defaults={{ text: 'Ce que disent nos clients', fontSize: '2.5rem', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '800' }} />
          </motion.h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
          {C.testimonials.items.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-md transition-all flex flex-col gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: t.stars }).map((_, s) => <Star key={s} size={14} className="fill-yellow-300 text-yellow-300" />)}
              </div>
              <EditableText id={`testi.${i}.quote`} as="p" className="leading-relaxed flex-1"
                defaults={{ text: `"${t.quote}"`, fontSize: '0.9rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-purple-50">{t.avatar}</div>
                <div>
                  <EditableText id={`testi.${i}.name`} as="p" className="text-sm font-bold"
                    defaults={{ text: t.name, fontSize: '0.875rem', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '700' }} />
                  <EditableText id={`testi.${i}.role`} as="p" className="text-xs"
                    defaults={{ text: t.role, fontSize: '0.75rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function PricingSection() {
  return (
    <section id="pricing" className="py-24" style={{ background: '#F7F8FC' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-3">
            <EditableText id="pricing.badge" as="span"
              defaults={{ text: 'Tarifs transparents', fontSize: '0.875rem', fontFamily: 'Poppins', color: '#7A90B5', fontWeight: '600' }} />
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold mb-3">
            <EditableText id="pricing.title" as="span"
              defaults={{ text: 'Choisissez votre formule', fontSize: '2.5rem', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '800' }} />
          </motion.h2>
          <motion.p variants={fadeUp}>
            <EditableText id="pricing.subtitle" as="span"
              defaults={{ text: C.pricing.subtitle, fontSize: '1rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
          </motion.p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
          {C.pricing.plans.map((plan, i) => (
            <motion.div key={i} variants={fadeUp} className="relative bg-white rounded-2xl flex flex-col hover:shadow-lg transition-all"
              style={{
                padding: '1.75rem',
                border: plan.highlighted ? '2px solid var(--bu-primary,#7A90B5)' : '2px solid #E5E9F0',
                transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                boxShadow: plan.highlighted ? '0 8px 30px rgba(122,144,181,0.2)' : undefined,
              }}>
              {plan.highlighted && 'badge' in plan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow"
                  style={{ background: 'var(--bu-primary,#7A90B5)' }}>{(plan as typeof plan & {badge:string}).badge}</div>
              )}
              <div className="mb-6">
                <EditableText id={`plan.${i}.name`} as="h3" className="font-bold mb-1"
                  defaults={{ text: plan.name, fontSize: '1.1rem', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '700' }} />
                <EditableText id={`plan.${i}.desc`} as="p" className="text-xs mb-4"
                  defaults={{ text: plan.description, fontSize: '0.75rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
                <div className="flex items-baseline gap-1">
                  <EditableText id={`plan.${i}.price`} as="span" className="text-4xl font-extrabold"
                    defaults={{ text: plan.price, fontSize: '2.25rem', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '800' }} />
                  <EditableText id={`plan.${i}.period`} as="span" className="text-sm"
                    defaults={{ text: plan.period, fontSize: '0.875rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2.5">
                    <Check size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--bu-primary,#7A90B5)' }} />
                    <EditableText id={`plan.${i}.feat${fi}`} as="span"
                      defaults={{ text: f, fontSize: '0.875rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: plan.highlighted ? 'var(--bu-primary,#7A90B5)' : '#F0F2F7', color: plan.highlighted ? 'white' : '#1E2A3A' }}>
                <EditableText id={`plan.${i}.cta`} as="span"
                  defaults={{ text: plan.cta, fontSize: '0.875rem', fontFamily: 'Poppins', color: plan.highlighted ? '#FFFFFF' : '#1E2A3A', fontWeight: '600' }} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA FINAL ────────────────────────────────────────────────────────────────
function CtaBanner() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <section className="py-24" style={{ background: 'var(--bu-background,#FAFAFA)' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
            style={{ background: 'linear-gradient(135deg,#E8EFF8,#FDF3EC)' }}>
            <span className="text-3xl">🚀</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-extrabold mb-5">
            <EditableText id="cta.title1" as="span"
              defaults={{ text: 'Prêt à devenir', fontSize: '2.5rem', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '800' }} />{' '}
            <EditableText id="cta.title2" as="span"
              defaults={{ text: 'une équipe', fontSize: '2.5rem', fontFamily: 'Poppins', color: '#C4956A', fontWeight: '800' }} />{' '}
            <EditableText id="cta.title3" as="span"
              defaults={{ text: '?', fontSize: '2.5rem', fontFamily: 'Poppins', color: '#1E2A3A', fontWeight: '800' }} />
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-10 max-w-xl mx-auto">
            <EditableText id="cta.subtitle" as="span"
              defaults={{ text: C.cta.subtitle, fontSize: '1rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
          </motion.p>
          <motion.button variants={fadeUp} onClick={() => scrollTo('pricing')}
            className="group inline-flex items-center gap-2 font-bold px-10 py-4 rounded-full text-white shadow-xl hover:opacity-90 transition-all"
            style={{ background: 'var(--bu-primary,#7A90B5)' }}>
            <EditableText id="cta.btn" as="span"
              defaults={{ text: "Commencer — c'est gratuit", fontSize: '1.05rem', fontFamily: 'Poppins', color: '#FFFFFF', fontWeight: '700' }} />
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-gray-100 py-12" style={{ background: '#F7F8FC' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <img src="/images/becomeus_logo.png" alt="BecomeUs" className="h-8 w-auto object-contain" />
          <EditableText id="footer.copy" as="p" className="text-sm text-center"
            defaults={{ text: C.footer.copyright, fontSize: '0.875rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
          <div className="flex items-center gap-5">
            {C.footer.links.map((link, i) => (
              <a key={i} href="#" className="hover:opacity-80 transition-opacity">
                <EditableText id={`footer.link${i}`} as="span"
                  defaults={{ text: link, fontSize: '0.875rem', fontFamily: 'Poppins', color: '#6B7A90', fontWeight: '400' }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ConceptSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaBanner />
      <Footer />
    </div>
  );
}
