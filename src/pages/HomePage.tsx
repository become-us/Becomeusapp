import React from 'react';
import { motion } from 'framer-motion';
import { SITE_CONFIG } from '@/lib/site.config';
import { Check, Star, ArrowRight, Users, TrendingUp, Zap } from 'lucide-react';

const C = SITE_CONFIG;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: 'var(--bu-background, #FAFAFA)' }}>
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: `radial-gradient(circle, var(--bu-accent, #9B85C4), transparent 70%)` }} />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, var(--bu-secondary, #C4956A), transparent 70%)` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-8"
          style={{ background: `radial-gradient(circle, var(--bu-primary, #7A90B5), transparent 70%)` }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
          className="flex justify-center mb-8">
          <img src="/images/becomeus_logo.png" alt="BecomeUs" className="h-16 md:h-20 w-auto object-contain" />
        </motion.div>

        {/* Titre principal */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="font-extrabold tracking-tight mb-6 leading-tight"
          style={{ fontSize: 'clamp(1.8rem, 5vw, var(--bu-hero-size, 3.5rem))', color: 'var(--bu-text, #1E2A3A)', fontFamily: 'var(--bu-font, Poppins)' }}>
          {C.brand.heroTitle}{' '}
          <span style={{ color: 'var(--bu-secondary, #C4956A)' }}>{C.brand.heroTitleAccent1}</span>{' '}
          <span style={{ color: 'var(--bu-primary, #7A90B5)' }}>{C.brand.heroTitleAccent2}</span>
        </motion.h1>

        {/* Citation */}
        <motion.blockquote initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
          className="relative max-w-xl mx-auto mb-8">
          <div className="absolute -left-4 top-0 text-5xl leading-none font-serif select-none"
            style={{ color: 'var(--bu-secondary, #C4956A)', opacity: 0.4 }}>"</div>
          <p className="italic px-6 py-4 rounded-2xl border"
            style={{
              fontSize: 'var(--bu-tagline-size, 1rem)',
              color: 'var(--bu-text-muted, #6B7A90)',
              background: 'color-mix(in srgb, var(--bu-accent, #9B85C4) 12%, white)',
              borderColor: 'color-mix(in srgb, var(--bu-accent, #9B85C4) 25%, white)',
              fontFamily: 'var(--bu-font, Poppins)',
              borderRadius: 'var(--bu-card-radius, 1rem)',
            }}>
            <span className="font-semibold not-italic" style={{ color: 'var(--bu-primary, #7A90B5)' }}>On arrive seul.</span>
            {' '}On repart{' '}
            <span className="font-semibold not-italic" style={{ color: 'var(--bu-secondary, #C4956A)' }}>en équipe.</span>
          </p>
          <div className="absolute -right-4 bottom-0 text-5xl leading-none font-serif select-none rotate-180"
            style={{ color: 'var(--bu-secondary, #C4956A)', opacity: 0.4 }}>"</div>
        </motion.blockquote>

        {/* Sous-titre */}
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}
          className="max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontSize: 'var(--bu-body-size, 1rem)', color: 'var(--bu-text-muted, #6B7A90)', fontFamily: 'var(--bu-font, Poppins)' }}>
          {C.brand.subtitle}
        </motion.p>

        {/* Boutons CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.42 }}
          className="flex flex-col sm:flex-row items-center justify-center"
          style={{ gap: 'var(--bu-gap, 1.5rem)' }}>
          <button onClick={() => scrollTo('pricing')}
            className="group flex items-center gap-2 font-semibold px-8 py-4 hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            style={{
              background: 'var(--bu-primary, #7A90B5)',
              color: 'white',
              borderRadius: 'var(--bu-button-radius, 9999px)',
              fontSize: 'var(--bu-body-size, 1rem)',
              fontFamily: 'var(--bu-font, Poppins)',
            }}>
            Commencer gratuitement
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => scrollTo('how-it-works')}
            className="flex items-center gap-2 font-medium px-6 py-4 border hover:opacity-80 transition-all"
            style={{
              color: 'var(--bu-text-muted, #6B7A90)',
              borderColor: 'var(--bu-text-muted, #6B7A90)',
              borderRadius: 'var(--bu-button-radius, 9999px)',
              fontSize: 'var(--bu-body-size, 1rem)',
              fontFamily: 'var(--bu-font, Poppins)',
            }}>
            Voir comment ça marche
          </button>
        </motion.div>

        {/* Stats bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6"
          style={{ fontSize: 'var(--bu-small-size, 0.875rem)', color: 'var(--bu-text-muted, #6B7A90)' }}>
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: 'var(--bu-primary, #7A90B5)' }} />
            <span><strong style={{ color: 'var(--bu-text, #1E2A3A)' }}>500+</strong> équipes accompagnées</span>
          </div>
          <div className="w-px h-4 bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: 'var(--bu-secondary, #C4956A)' }} />
            <span><strong style={{ color: 'var(--bu-text, #1E2A3A)' }}>+40%</strong> de rétention en moyenne</span>
          </div>
          <div className="w-px h-4 bg-gray-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: 'var(--bu-accent, #9B85C4)' }} />
            <span><strong style={{ color: 'var(--bu-text, #1E2A3A)' }}>2x</strong> plus vite intégré</span>
          </div>
        </motion.div>

        {/* Mini dashboard preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 relative max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-5 text-xs text-gray-400 flex items-center px-3">
                app.becomeus.io/dashboard
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Talha K.', status: 'Semaine 3', progress: 75, color: 'var(--bu-primary, #7A90B5)' },
                { label: 'Léa B.', status: 'Semaine 1', progress: 30, color: 'var(--bu-secondary, #C4956A)' },
                { label: 'Marcus D.', status: 'Intégré ✓', progress: 100, color: 'var(--bu-accent, #9B85C4)' },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold mb-2"
                    style={{ color: 'var(--bu-text, #1E2A3A)' }}>
                    {item.label.charAt(0)}
                  </div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--bu-text, #1E2A3A)' }}>{item.label}</p>
                  <p className="text-xs mb-2" style={{ color: 'var(--bu-text-muted, #6B7A90)' }}>{item.status}</p>
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
    <section id="concept" style={{ padding: 'var(--bu-section-padding, 6rem) 0', background: 'var(--bu-background, #FAFAFA)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--bu-primary, #7A90B5)' }}>{C.concept.badge}</motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold mb-5"
            style={{ fontSize: 'var(--bu-h2-size, 2.5rem)', color: 'var(--bu-text, #1E2A3A)', fontFamily: 'var(--bu-font, Poppins)' }}>
            Le management,{' '}
            <span style={{ color: 'var(--bu-secondary, #C4956A)' }}>c'est du coaching</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="max-w-2xl mx-auto"
            style={{ fontSize: 'var(--bu-body-size, 1rem)', color: 'var(--bu-text-muted, #6B7A90)' }}>
            {C.concept.subtitle}
          </motion.p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid md:grid-cols-3" style={{ gap: 'var(--bu-gap, 1.5rem)' }}>
          {C.concept.cards.map((card) => (
            <motion.div key={card.title} variants={fadeUp}
              className="border hover:shadow-md transition-all"
              style={{
                background: card.bgColor,
                borderColor: card.borderColor,
                padding: 'var(--bu-card-padding, 1.75rem)',
                borderRadius: 'var(--bu-card-radius, 1rem)',
              }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{ background: card.borderColor }}>
                {card.icon}
              </div>
              <h3 className="font-bold mb-3"
                style={{ fontSize: 'calc(var(--bu-body-size, 1rem) * 1.1)', color: 'var(--bu-text, #1E2A3A)' }}>{card.title}</h3>
              <p className="leading-relaxed"
                style={{ fontSize: 'calc(var(--bu-body-size, 1rem) * 0.9)', color: 'var(--bu-text-muted, #6B7A90)' }}>
                {card.description}
              </p>
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
    <section id="how-it-works" style={{ padding: 'var(--bu-section-padding, 6rem) 0', background: '#F7F8FC' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--bu-secondary, #C4956A)' }}>{C.howItWorks.badge}</motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold"
            style={{ fontSize: 'var(--bu-h2-size, 2.5rem)', color: 'var(--bu-text, #1E2A3A)', fontFamily: 'var(--bu-font, Poppins)' }}>
            {C.howItWorks.title}
          </motion.h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid md:grid-cols-3" style={{ gap: 'var(--bu-gap, 1.5rem)' }}>
          {C.howItWorks.steps.map((step) => (
            <motion.div key={step.number} variants={fadeUp} className="text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm"
                style={{ background: step.bg }}>
                <span className="text-2xl font-extrabold" style={{ color: step.color }}>{step.number}</span>
              </div>
              <h3 className="font-bold mb-3"
                style={{ fontSize: 'calc(var(--bu-body-size, 1rem) * 1.2)', color: 'var(--bu-text, #1E2A3A)' }}>
                {step.title}
              </h3>
              <p className="leading-relaxed"
                style={{ fontSize: 'calc(var(--bu-body-size, 1rem) * 0.9)', color: 'var(--bu-text-muted, #6B7A90)' }}>
                {step.description}
              </p>
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
    <section id="testimonials" style={{ padding: 'var(--bu-section-padding, 6rem) 0', background: 'var(--bu-background, #FAFAFA)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--bu-accent, #9B85C4)' }}>{C.testimonials.badge}</motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold"
            style={{ fontSize: 'var(--bu-h2-size, 2.5rem)', color: 'var(--bu-text, #1E2A3A)', fontFamily: 'var(--bu-font, Poppins)' }}>
            {C.testimonials.title}
          </motion.h2>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid md:grid-cols-3" style={{ gap: 'var(--bu-gap, 1.5rem)' }}>
          {C.testimonials.items.map((t) => (
            <motion.div key={t.name} variants={fadeUp}
              className="bg-white border border-gray-100 hover:shadow-md transition-all flex flex-col"
              style={{ padding: 'var(--bu-card-padding, 1.75rem)', borderRadius: 'var(--bu-card-radius, 1rem)', gap: '1rem' }}>
              <div className="flex items-center gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-300 text-yellow-300" />
                ))}
              </div>
              <p className="leading-relaxed flex-1"
                style={{ fontSize: 'calc(var(--bu-body-size, 1rem) * 0.9)', color: 'var(--bu-text-muted, #6B7A90)' }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: 'color-mix(in srgb, var(--bu-accent, #9B85C4) 15%, white)' }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--bu-text, #1E2A3A)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--bu-text-muted, #6B7A90)' }}>{t.role}</p>
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
    <section id="pricing" style={{ padding: 'var(--bu-section-padding, 6rem) 0', background: '#F7F8FC' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--bu-primary, #7A90B5)' }}>{C.pricing.badge}</motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold mb-3"
            style={{ fontSize: 'var(--bu-h2-size, 2.5rem)', color: 'var(--bu-text, #1E2A3A)', fontFamily: 'var(--bu-font, Poppins)' }}>
            {C.pricing.title}
          </motion.h2>
          <motion.p variants={fadeUp} style={{ fontSize: 'var(--bu-body-size, 1rem)', color: 'var(--bu-text-muted, #6B7A90)' }}>
            {C.pricing.subtitle}
          </motion.p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid md:grid-cols-3" style={{ gap: 'var(--bu-gap, 1.5rem)' }}>
          {C.pricing.plans.map((plan) => (
            <motion.div key={plan.name} variants={fadeUp}
              className="relative bg-white flex flex-col hover:shadow-lg transition-all"
              style={{
                padding: 'var(--bu-card-padding, 1.75rem)',
                borderRadius: 'var(--bu-card-radius, 1rem)',
                border: plan.highlighted ? `2px solid var(--bu-primary, #7A90B5)` : '2px solid #E5E9F0',
                transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)',
                boxShadow: plan.highlighted ? '0 8px 30px rgba(122,144,181,0.2)' : undefined,
              }}>
              {plan.highlighted && 'badge' in plan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow"
                  style={{ background: 'var(--bu-primary, #7A90B5)' }}>
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-bold mb-1" style={{ color: 'var(--bu-text, #1E2A3A)', fontSize: 'calc(var(--bu-body-size, 1rem) * 1.2)' }}>{plan.name}</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--bu-text-muted, #6B7A90)' }}>{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold" style={{ color: 'var(--bu-text, #1E2A3A)' }}>{plan.price}</span>
                  <span className="text-sm" style={{ color: 'var(--bu-text-muted, #6B7A90)' }}>{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--bu-text-muted, #6B7A90)' }}>
                    <Check size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--bu-primary, #7A90B5)' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 font-semibold text-sm transition-all"
                style={{
                  background: plan.highlighted ? 'var(--bu-primary, #7A90B5)' : '#F0F2F7',
                  color: plan.highlighted ? 'white' : 'var(--bu-text, #1E2A3A)',
                  borderRadius: 'var(--bu-button-radius, 9999px)',
                  fontFamily: 'var(--bu-font, Poppins)',
                }}>
                {plan.cta}
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
    <section style={{ padding: 'var(--bu-section-padding, 6rem) 0', background: 'var(--bu-background, #FAFAFA)' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
            style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--bu-accent, #9B85C4) 40%, white), color-mix(in srgb, var(--bu-secondary, #C4956A) 40%, white))` }}>
            <span className="text-3xl">🚀</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-extrabold mb-5"
            style={{ fontSize: 'var(--bu-h2-size, 2.5rem)', color: 'var(--bu-text, #1E2A3A)', fontFamily: 'var(--bu-font, Poppins)' }}>
            {C.cta.title}{' '}
            <span style={{ color: 'var(--bu-secondary, #C4956A)' }}>{C.cta.titleAccent}</span> ?
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-10 max-w-xl mx-auto"
            style={{ fontSize: 'var(--bu-body-size, 1rem)', color: 'var(--bu-text-muted, #6B7A90)' }}>
            {C.cta.subtitle}
          </motion.p>
          <motion.button variants={fadeUp} onClick={() => scrollTo('pricing')}
            className="group inline-flex items-center gap-2 font-bold px-10 py-4 shadow-xl"
            style={{
              background: 'var(--bu-primary, #7A90B5)',
              color: 'white',
              borderRadius: 'var(--bu-button-radius, 9999px)',
              fontSize: 'calc(var(--bu-body-size, 1rem) * 1.1)',
              fontFamily: 'var(--bu-font, Poppins)',
            }}>
            {C.cta.buttonText}
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
          <p className="text-sm text-center" style={{ color: 'var(--bu-text-muted, #6B7A90)' }}>{C.footer.copyright}</p>
          <div className="flex items-center gap-5">
            {C.footer.links.map((link) => (
              <a key={link} href="#" className="text-sm hover:opacity-80 transition-opacity"
                style={{ color: 'var(--bu-text-muted, #6B7A90)' }}>{link}</a>
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
