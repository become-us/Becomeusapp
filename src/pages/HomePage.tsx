import React from 'react';
import { motion } from 'framer-motion';
import { FEATURES, STEPS, TESTIMONIALS, PRICING_PLANS } from '@/lib/constants';
import { Check, Star, ArrowRight, Users, TrendingUp, Zap } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

// ─── HERO ────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, oklch(0.80 0.07 290), transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, oklch(0.75 0.10 35), transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, oklch(0.58 0.08 240), transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        {/* Logo centré dans le Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="flex justify-center mb-8"
        >
          <img
            src="/images/becomeus_logo.png"
            alt="BecomeUs"
            className="h-16 md:h-20 w-auto object-contain"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight"
        >
          La plateforme RH qui{' '}
          <span className="text-[#C4956A]">coache</span>{' '}
          <span className="text-primary">vos équipes</span>
        </motion.h1>

        {/* Citation */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="relative max-w-xl mx-auto mb-8"
        >
          <div className="absolute -left-4 top-0 text-5xl leading-none text-[#C4956A]/40 font-serif select-none">"</div>
          <p className="text-base md:text-lg italic text-muted-foreground px-6 py-4 bg-accent/30 rounded-2xl border border-accent/40">
            <span className="text-[#7A90B5] font-semibold not-italic">On arrive seul.</span>
            {' '}On repart{' '}
            <span className="text-[#C4956A] font-semibold not-italic">en équipe.</span>
          </p>
          <div className="absolute -right-4 bottom-0 text-5xl leading-none text-[#C4956A]/40 font-serif select-none rotate-180">"</div>
        </motion.blockquote>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          BecomeUs transforme l'intégration RH en véritable coaching d'équipe.
          Chaque nouveau talent devient un pilier. Chaque manager, un coach.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollToSection('pricing')}
            className="group flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl text-base"
          >
            Commencer gratuitement
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="flex items-center gap-2 text-muted-foreground font-medium px-6 py-4 rounded-full border border-border hover:bg-muted/50 transition-all text-base"
          >
            Voir comment ça marche
          </button>
        </motion.div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <span><strong className="text-foreground">500+</strong> équipes accompagnées</span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#C4956A]" />
            <span><strong className="text-foreground">+40%</strong> de rétention en moyenne</span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#9B85C4]" />
            <span><strong className="text-foreground">2x</strong> plus vite intégré</span>
          </div>
        </motion.div>

        {/* Visual illustration */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 relative max-w-3xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-border p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
              </div>
              <div className="flex-1 bg-muted rounded-full h-5 text-xs text-muted-foreground flex items-center px-3">
                app.becomeus.io/dashboard
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Talha K.', status: 'Semaine 3', progress: 75, color: 'bg-[#7A90B5]' },
                { label: 'Léa B.', status: 'Semaine 1', progress: 30, color: 'bg-[#C4956A]' },
                { label: 'Marcus D.', status: 'Intégré ✓', progress: 100, color: 'bg-[#9B85C4]' },
              ].map((item) => (
                <div key={item.label} className="bg-muted/50 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground mb-2">
                    {item.label.charAt(0)}
                  </div>
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mb-2">{item.status}</p>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div
                      className={`${item.color} h-1.5 rounded-full`}
                      style={{ width: `${item.progress}%` }}
                    />
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

// ─── CONCEPT / FEATURES ────────────────────────────────────────────────────────
function ConceptSection() {
  return (
    <section id="concept" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Notre approche
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-foreground mb-5">
            Le management,{' '}
            <span className="text-[#C4956A]">c'est du coaching</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Les meilleurs coachs sportifs ne font pas juste jouer leurs joueurs. Ils les intègrent, les forment et créent une dynamique d'équipe. Vous aussi.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className={`${feature.color} border rounded-2xl p-7 hover:shadow-md transition-all`}
            >
              <div className={`${feature.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ──────────────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold text-[#C4956A] uppercase tracking-widest mb-3">
            3 étapes simples
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-foreground mb-5">
            Comment ça marche
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-border z-0" />

          {STEPS.map((step) => (
            <motion.div key={step.number} variants={fadeUp} className="relative z-10 text-center">
              <div className={`${step.bg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm`}>
                <span className={`text-2xl font-extrabold ${step.color}`}>{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
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
    <section id="testimonials" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold text-[#9B85C4] uppercase tracking-widest mb-3">
            Ils nous font confiance
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-foreground mb-5">
            Ce que disent nos clients
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className="bg-card border border-border rounded-2xl p-7 hover:shadow-md transition-all flex flex-col gap-4"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} className="fill-[#F4C97A] text-[#F4C97A]" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-xl">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
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
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Tarifs transparents
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-foreground mb-5">
            Choisissez votre formule
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground">
            14 jours gratuits — sans carte bancaire — annulez quand vous voulez.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {PRICING_PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`relative bg-card rounded-2xl p-8 border-2 transition-all hover:shadow-lg flex flex-col ${
                plan.highlighted ? 'border-primary shadow-lg scale-105' : 'border-border'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow">
                  ⭐ Le plus populaire
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-md'
                    : 'bg-muted text-foreground hover:bg-muted-foreground/10 border border-border'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA BANNER ───────────────────────────────────────────────────────────────
function CtaBanner() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
            style={{ background: 'linear-gradient(135deg, oklch(0.88 0.05 290), oklch(0.92 0.04 35))' }}
          >
            <span className="text-3xl">🚀</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-foreground mb-5">
            Prêt à devenir{' '}
            <span className="text-[#C4956A]">une équipe</span> ?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Rejoignez 500+ organisations qui ont transformé leur intégration RH. Le premier match commence maintenant.
          </motion.p>
          <motion.button
            variants={fadeUp}
            onClick={() => scrollToSection('pricing')}
            className="group inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold px-10 py-4 rounded-full hover:opacity-90 transition-all shadow-xl text-lg"
          >
            Commencer — c'est gratuit
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
    <footer className="bg-muted/40 border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-foreground">Become</span>
              <span className="text-[#C4956A]">Us</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © 2026 BecomeUs — Transformez l'intégration en coaching d'équipe
          </p>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-foreground transition-colors">CGU</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
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
