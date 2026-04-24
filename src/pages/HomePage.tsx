import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SITE_CONFIG as C } from '@/lib/site.config';
import EditZone, { AddTextBtn } from '@/components/EditZone';
import { useEditor } from '@/lib/editorStore';
import { Check, Star, ArrowRight, Users, TrendingUp, Zap } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const { editMode } = useEditor();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#FAFAFA]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle,#9B85C4,transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#C4956A,transparent 70%)' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
          className="flex justify-center mb-8">
          <img src="/images/becomeus_logo.png" alt="BecomeUs" className="h-16 md:h-20 w-auto object-contain" />
        </motion.div>

        {/* Titre */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="font-extrabold tracking-tight mb-6 leading-tight">
          <EditZone id="hero.t1" as="span"
            defaults={{ content: 'La plateforme RH qui', color: '#1E2A3A', fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />{' '}
          <EditZone id="hero.t2" as="span"
            defaults={{ content: 'coache', color: '#C4956A', fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />{' '}
          <EditZone id="hero.t3" as="span"
            defaults={{ content: 'vos équipes', color: '#7A90B5', fontSize: 'clamp(1.8rem,5vw,3.5rem)', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />
        </motion.h1>

        {/* Citation */}
        <motion.blockquote initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}
          className="relative max-w-xl mx-auto mb-8">
          <div className="absolute -left-4 top-0 text-5xl leading-none font-serif select-none opacity-40 text-[#C4956A]">"</div>
          <p className="italic px-6 py-4 rounded-2xl border bg-purple-50/40 border-purple-100">
            <EditZone id="hero.q1" as="span" className="not-italic"
              defaults={{ content: 'On arrive seul.', color: '#7A90B5', fontSize: '1rem', fontFamily: 'Poppins', fontWeight: '600', fontStyle: 'normal' }} />{' '}
            <EditZone id="hero.q2" as="span"
              defaults={{ content: 'On repart', color: '#6B7A90', fontSize: '1rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />{' '}
            <EditZone id="hero.q3" as="span" className="not-italic"
              defaults={{ content: 'en équipe.', color: '#C4956A', fontSize: '1rem', fontFamily: 'Poppins', fontWeight: '600', fontStyle: 'normal' }} />
          </p>
          <div className="absolute -right-4 bottom-0 text-5xl leading-none font-serif select-none opacity-40 rotate-180 text-[#C4956A]">"</div>
        </motion.blockquote>

        {/* Sous-titre */}
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}
          className="max-w-2xl mx-auto mb-10 leading-relaxed">
          <EditZone id="hero.sub" as="span"
            defaults={{ content: C.brand.subtitle, color: '#6B7A90', fontSize: '1rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
        </motion.p>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.42 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => !editMode && scrollTo('pricing')}
            className="group flex items-center gap-2 font-semibold px-8 py-4 rounded-full shadow-lg text-white hover:opacity-90 transition-all bg-[#7A90B5]">
            <EditZone id="hero.cta1" as="span"
              defaults={{ content: 'Commencer gratuitement', color: '#FFFFFF', fontSize: '1rem', fontFamily: 'Poppins', fontWeight: '600', fontStyle: 'normal' }} />
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => !editMode && scrollTo('how-it-works')}
            className="flex items-center gap-2 px-6 py-4 border border-gray-300 rounded-full hover:opacity-80 transition-all">
            <EditZone id="hero.cta2" as="span"
              defaults={{ content: 'Voir comment ça marche', color: '#6B7A90', fontSize: '1rem', fontFamily: 'Poppins', fontWeight: '500', fontStyle: 'normal' }} />
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm">
          {[
            { id: 'stat.1', def: '500+ équipes accompagnées', icon: <Users size={16} className="text-[#7A90B5]" /> },
            { id: 'stat.2', def: '+40% de rétention en moyenne', icon: <TrendingUp size={16} className="text-[#C4956A]" /> },
            { id: 'stat.3', def: '2x plus vite intégré', icon: <Zap size={16} className="text-[#9B85C4]" /> },
          ].map(({ id, def, icon }, i) => (
            <React.Fragment key={id}>
              {i > 0 && <div className="w-px h-4 bg-gray-200 hidden sm:block" />}
              <div className="flex items-center gap-2">
                {icon}
                <EditZone id={id} as="span"
                  defaults={{ content: def, color: '#6B7A90', fontSize: '0.875rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
              </div>
            </React.Fragment>
          ))}
        </motion.div>

        {/* Dashboard preview */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                {['bg-red-300','bg-yellow-300','bg-green-300'].map(c => <div key={c} className={`w-3 h-3 rounded-full ${c}`} />)}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-5 text-xs text-gray-400 flex items-center px-3">app.becomeus.io/dashboard</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Talha K.', status: 'Semaine 3', p: 75, c: '#7A90B5' },
                { name: 'Léa B.', status: 'Semaine 1', p: 30, c: '#C4956A' },
                { name: 'Marcus D.', status: 'Intégré ✓', p: 100, c: '#9B85C4' },
              ].map(item => (
                <div key={item.name} className="bg-gray-50 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold mb-2 text-gray-700">{item.name[0]}</div>
                  <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{item.status}</p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${item.p}%`, background: item.c }} />
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
type ConceptCard = { icon: string; title: string; description: string; bgColor: string; borderColor: string };

function ConceptSection() {
  const [cards, setCards] = useState<ConceptCard[]>(C.concept.cards);

  return (
    <section id="concept" className="py-24 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp}>
            <EditZone id="c.badge" as="span" className="text-sm font-semibold uppercase tracking-widest"
              defaults={{ content: 'Notre approche', color: '#7A90B5', fontSize: '0.875rem', fontFamily: 'Poppins', fontWeight: '600', fontStyle: 'normal' }} />
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold mt-3 mb-5">
            <EditZone id="c.t1" as="span"
              defaults={{ content: 'Le management, ', color: '#1E2A3A', fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />
            <EditZone id="c.t2" as="span"
              defaults={{ content: "c'est du coaching", color: '#C4956A', fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />
          </motion.h2>
          <motion.p variants={fadeUp}>
            <EditZone id="c.sub" as="span"
              defaults={{ content: C.concept.subtitle, color: '#6B7A90', fontSize: '1rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div key={i} variants={fadeUp} className="border rounded-2xl p-7 hover:shadow-md transition-all relative"
              style={{ background: card.bgColor, borderColor: card.borderColor }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5" style={{ background: card.borderColor }}>{card.icon}</div>
              <h3 className="font-bold mb-3">
                <EditZone id={`c.card${i}.t`} as="span"
                  defaults={{ content: card.title, color: '#1E2A3A', fontSize: '1.05rem', fontFamily: 'Poppins', fontWeight: '700', fontStyle: 'normal' }} />
              </h3>
              <EditZone id={`c.card${i}.d`} as="p" className="leading-relaxed"
                defaults={{ content: card.description, color: '#6B7A90', fontSize: '0.9rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
type Step = { number: string; title: string; description: string; color: string; bg: string };

function HowItWorksSection() {
  const [steps, setSteps] = useState<Step[]>(C.howItWorks.steps);

  return (
    <section id="how-it-works" className="py-24 bg-[#F7F8FC]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp}>
            <EditZone id="h.badge" as="span" className="text-sm font-semibold uppercase tracking-widest"
              defaults={{ content: '3 étapes simples', color: '#C4956A', fontSize: '0.875rem', fontFamily: 'Poppins', fontWeight: '600', fontStyle: 'normal' }} />
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold mt-3">
            <EditZone id="h.title" as="span"
              defaults={{ content: 'Comment ça marche', color: '#1E2A3A', fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />
          </motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm" style={{ background: step.bg }}>
                <span className="text-2xl font-extrabold" style={{ color: step.color }}>{step.number}</span>
              </div>
              <h3 className="font-bold mb-3">
                <EditZone id={`h.step${i}.t`} as="span"
                  defaults={{ content: step.title, color: '#1E2A3A', fontSize: '1.1rem', fontFamily: 'Poppins', fontWeight: '700', fontStyle: 'normal' }} />
              </h3>
              <EditZone id={`h.step${i}.d`} as="p" className="leading-relaxed"
                defaults={{ content: step.description, color: '#6B7A90', fontSize: '0.9rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
type Testi = { name: string; role: string; quote: string; avatar: string; stars: number };

function TestimonialsSection() {
  const [items, setItems] = useState<Testi[]>(C.testimonials.items);

  return (
    <section id="testimonials" className="py-24 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp}>
            <EditZone id="te.badge" as="span" className="text-sm font-semibold uppercase tracking-widest"
              defaults={{ content: 'Ils nous font confiance', color: '#9B85C4', fontSize: '0.875rem', fontFamily: 'Poppins', fontWeight: '600', fontStyle: 'normal' }} />
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold mt-3">
            <EditZone id="te.title" as="span"
              defaults={{ content: 'Ce que disent nos clients', color: '#1E2A3A', fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />
          </motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div key={i} variants={fadeUp} className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-md transition-all flex flex-col gap-4 relative">
              <div className="flex gap-1">{Array.from({ length: t.stars }).map((_,s) => <Star key={s} size={14} className="fill-yellow-300 text-yellow-300" />)}</div>
              <EditZone id={`te.${i}.q`} as="p" className="leading-relaxed flex-1"
                defaults={{ content: '"' + t.quote + '"', color: '#6B7A90', fontSize: '0.9rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-xl">{t.avatar}</div>
                <div>
                  <EditZone id={`te.${i}.name`} as="p"
                    defaults={{ content: t.name, color: '#1E2A3A', fontSize: '0.875rem', fontFamily: 'Poppins', fontWeight: '700', fontStyle: 'normal' }} />
                  <EditZone id={`te.${i}.role`} as="p"
                    defaults={{ content: t.role, color: '#6B7A90', fontSize: '0.75rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <AddTextBtn onAdd={() => setItems(p => [...p, { name: 'Nouveau témoignage', role: 'Poste — Entreprise', quote: 'Cliquez pour modifier ce témoignage.', avatar: '😊', stars: 5 }])} />
      </div>
    </section>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
type Plan = typeof C.pricing.plans[0];

function PricingSection() {
  const [plans] = useState<Plan[]>(C.pricing.plans);

  return (
    <section id="pricing" className="py-24 bg-[#F7F8FC]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <motion.p variants={fadeUp}>
            <EditZone id="pr.badge" as="span" className="text-sm font-semibold uppercase tracking-widest"
              defaults={{ content: 'Tarifs transparents', color: '#7A90B5', fontSize: '0.875rem', fontFamily: 'Poppins', fontWeight: '600', fontStyle: 'normal' }} />
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-extrabold mt-3 mb-2">
            <EditZone id="pr.title" as="span"
              defaults={{ content: 'Choisissez votre formule', color: '#1E2A3A', fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />
          </motion.h2>
          <motion.p variants={fadeUp}>
            <EditZone id="pr.sub" as="span"
              defaults={{ content: C.pricing.subtitle, color: '#6B7A90', fontSize: '1rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
          </motion.p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div key={i} variants={fadeUp} className="relative bg-white rounded-2xl flex flex-col hover:shadow-lg transition-all"
              style={{ padding: '1.75rem', border: plan.highlighted ? '2px solid #7A90B5' : '2px solid #E5E9F0', transform: plan.highlighted ? 'scale(1.05)' : 'scale(1)' }}>
              {plan.highlighted && 'badge' in plan && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1.5 rounded-full bg-[#7A90B5] shadow">
                  {(plan as Plan & { badge?: string }).badge}
                </div>
              )}
              <div className="mb-6">
                <EditZone id={`pr.${i}.name`} as="h3" className="font-bold mb-1"
                  defaults={{ content: plan.name, color: '#1E2A3A', fontSize: '1.1rem', fontFamily: 'Poppins', fontWeight: '700', fontStyle: 'normal' }} />
                <EditZone id={`pr.${i}.desc`} as="p" className="text-xs mb-4"
                  defaults={{ content: plan.description, color: '#6B7A90', fontSize: '0.75rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
                <div className="flex items-baseline gap-1">
                  <EditZone id={`pr.${i}.price`} as="span" className="text-4xl font-extrabold"
                    defaults={{ content: plan.price, color: '#1E2A3A', fontSize: '2.25rem', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />
                  <EditZone id={`pr.${i}.period`} as="span" className="text-sm"
                    defaults={{ content: plan.period, color: '#6B7A90', fontSize: '0.875rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2.5">
                    <Check size={16} className="mt-0.5 flex-shrink-0 text-[#7A90B5]" />
                    <EditZone id={`pr.${i}.f${fi}`} as="span"
                      defaults={{ content: f, color: '#6B7A90', fontSize: '0.875rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-all"
                style={{ background: plan.highlighted ? '#7A90B5' : '#F0F2F7', color: plan.highlighted ? 'white' : '#1E2A3A' }}>
                <EditZone id={`pr.${i}.cta`} as="span"
                  defaults={{ content: plan.cta, color: plan.highlighted ? '#FFFFFF' : '#1E2A3A', fontSize: '0.875rem', fontFamily: 'Poppins', fontWeight: '600', fontStyle: 'normal' }} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA FINAL ────────────────────────────────────────────────────────────────
function CtaBanner() {
  const { editMode } = useEditor();
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="py-24 bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 bg-gradient-to-br from-[#E8EFF8] to-[#FDF3EC]">
            <span className="text-3xl">🚀</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-extrabold mb-5">
            <EditZone id="cta.t1" as="span"
              defaults={{ content: 'Prêt à devenir', color: '#1E2A3A', fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />{' '}
            <EditZone id="cta.t2" as="span"
              defaults={{ content: 'une équipe', color: '#C4956A', fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />{' '}
            <EditZone id="cta.t3" as="span"
              defaults={{ content: '?', color: '#1E2A3A', fontSize: '2.5rem', fontFamily: 'Poppins', fontWeight: '800', fontStyle: 'normal' }} />
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-10 max-w-xl mx-auto">
            <EditZone id="cta.sub" as="span"
              defaults={{ content: C.cta.subtitle, color: '#6B7A90', fontSize: '1rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
          </motion.p>
          <motion.button variants={fadeUp} onClick={() => !editMode && scrollTo('pricing')}
            className="group inline-flex items-center gap-2 font-bold px-10 py-4 rounded-full text-white shadow-xl hover:opacity-90 transition-all bg-[#7A90B5]">
            <EditZone id="cta.btn" as="span"
              defaults={{ content: "Commencer — c'est gratuit", color: '#FFFFFF', fontSize: '1.05rem', fontFamily: 'Poppins', fontWeight: '700', fontStyle: 'normal' }} />
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
    <footer className="border-t border-gray-100 py-12 bg-[#F7F8FC]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <img src="/images/becomeus_logo.png" alt="BecomeUs" className="h-8 w-auto object-contain" />
          <EditZone id="ft.copy" as="p" className="text-sm text-center"
            defaults={{ content: C.footer.copyright, color: '#6B7A90', fontSize: '0.875rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
          <div className="flex items-center gap-5">
            {C.footer.links.map((link, i) => (
              <a key={i} href="#" className="hover:opacity-80 transition-opacity">
                <EditZone id={`ft.lnk${i}`} as="span"
                  defaults={{ content: link, color: '#6B7A90', fontSize: '0.875rem', fontFamily: 'Poppins', fontWeight: '400', fontStyle: 'normal' }} />
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
