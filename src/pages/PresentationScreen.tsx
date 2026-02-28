import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IndianRupee, TrendingDown, Clock, Users, MapPin, Zap, Flame, Building2,
  ChevronLeft, ChevronRight, Rocket, Target, BarChart3, Globe, Server,
  Shield, CheckCircle2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import KioskLayout from "@/components/kiosk/KioskLayout";

const slides = [
  {
    id: "cost",
    title: "Estimated Implementation Cost",
    icon: IndianRupee,
  },
  {
    id: "deployment",
    title: "Deployment Plan",
    icon: Rocket,
  },
  {
    id: "integration",
    title: "Real-World API Integrations",
    icon: Globe,
  },
  {
    id: "metrics",
    title: "Performance Metrics",
    icon: BarChart3,
  },
  {
    id: "mockup",
    title: "UI Mockup Preview",
    icon: Target,
  },
];

const costItems = [
  { category: "Hardware (per kiosk)", items: ["Touch-screen terminal", "Receipt printer", "UPS backup", "Enclosure & mounting"], cost: "₹1,80,000" },
  { category: "Software Development", items: ["Frontend kiosk app", "Backend & APIs", "Payment gateway integration", "Admin dashboard"], cost: "₹12,00,000" },
  { category: "Cloud Infrastructure (annual)", items: ["Hosting & CDN", "Database & auth", "SSL & security", "Monitoring & logs"], cost: "₹3,60,000/yr" },
  { category: "Deployment & Training", items: ["Installation per site", "Staff training", "User manuals", "Pilot support"], cost: "₹2,40,000" },
];

const deploymentPhases = [
  {
    phase: "Phase 1 — Pilot",
    timeline: "Months 1–3",
    scope: "5 kiosks in 1 ward",
    tasks: ["Deploy in high-footfall offices", "Collect user feedback", "Monitor uptime & usage", "Iterate on UX issues"],
    color: "bg-secondary/20 border-secondary",
  },
  {
    phase: "Phase 2 — District",
    timeline: "Months 4–8",
    scope: "50 kiosks across district",
    tasks: ["Scale to all taluk offices", "Integrate additional services", "Train local staff", "Set up helpdesk"],
    color: "bg-accent/20 border-accent",
  },
  {
    phase: "Phase 3 — State",
    timeline: "Months 9–18",
    scope: "500+ kiosks statewide",
    tasks: ["State-wide rollout", "Multi-language support", "Central monitoring dashboard", "SLA-based maintenance"],
    color: "bg-primary/10 border-primary",
  },
];

const integrations = [
  {
    name: "TNEB (Tamil Nadu Electricity Board)",
    api: "TNEB Consumer API",
    endpoint: "api.tnebnet.org/v2/consumer",
    features: ["Bill fetch by consumer number", "Payment posting", "Outage status", "New connection application"],
    icon: Zap,
    color: "text-electricity",
  },
  {
    name: "Municipal Corporation API",
    api: "Smart City ULB Gateway",
    endpoint: "ulb-gateway.tn.gov.in/api",
    features: ["Property tax lookup", "Water & sewage bills", "Birth/Death certificates", "Complaint registration"],
    icon: Building2,
    color: "text-primary",
  },
  {
    name: "Gas Utility (IGL / MGL)",
    api: "Gas Distribution API",
    endpoint: "api.iglonline.net/v1",
    features: ["Pipeline gas bills", "Cylinder booking", "Connection transfer", "Safety inspection booking"],
    icon: Flame,
    color: "text-gas",
  },
];

const metrics = [
  { label: "Average Wait Time Reduction", value: "72%", detail: "From 45 min → 12 min", icon: Clock },
  { label: "Daily Transactions per Kiosk", value: "180+", detail: "Peak hours: 9 AM – 1 PM", icon: TrendingDown },
  { label: "User Satisfaction Score", value: "4.6/5", detail: "Based on 10,000+ feedback entries", icon: Users },
  { label: "Service Coverage Area", value: "15 km²", detail: "Per kiosk deployment zone", icon: MapPin },
];

const PresentationScreen = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => setCurrentSlide((s) => Math.min(s + 1, slides.length - 1));
  const prev = () => setCurrentSlide((s) => Math.max(s - 1, 0));

  return (
    <KioskLayout title="Project Presentation" subtitle="CiviConnect" showLogout>
      <div className="flex flex-1 flex-col">
        {/* Slide nav dots */}
        <div className="flex items-center justify-center gap-2 py-3 border-b border-border bg-card">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === currentSlide
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <s.icon className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Slide content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="mx-auto max-w-4xl"
            >
              {/* Slide 0: Cost */}
              {currentSlide === 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                    <IndianRupee className="h-6 w-6 text-secondary" />
                    Estimated Implementation Cost
                  </h2>
                  <p className="text-muted-foreground mb-6">Breakdown for a single kiosk deployment unit</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {costItems.map((item) => (
                      <div key={item.category} className="rounded-2xl bg-card p-5 kiosk-card-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-card-foreground">{item.category}</h3>
                          <span className="text-secondary font-bold text-lg">{item.cost}</span>
                        </div>
                        <ul className="space-y-1.5">
                          {item.items.map((line) => (
                            <li key={line} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-2xl bg-primary/5 p-5 border border-primary/20 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total Estimated First-Year Cost (per kiosk)</p>
                    <p className="text-3xl font-extrabold text-primary flex items-center justify-center gap-1">
                      <IndianRupee className="h-7 w-7" />19,80,000
                    </p>
                  </div>
                </div>
              )}

              {/* Slide 1: Deployment Plan */}
              {currentSlide === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-secondary" />
                    Deployment Roadmap
                  </h2>
                  <p className="text-muted-foreground mb-6">Pilot → District → State rollout strategy</p>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
                    <div className="space-y-6">
                      {deploymentPhases.map((phase, i) => (
                        <motion.div
                          key={phase.phase}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className={`rounded-2xl bg-card p-6 kiosk-card-shadow border-l-4 ${phase.color} md:ml-12 relative`}
                        >
                          <div className="hidden md:flex absolute -left-[3.25rem] top-6 h-8 w-8 items-center justify-center rounded-full bg-card border-2 border-border text-xs font-bold text-foreground">
                            {i + 1}
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                            <h3 className="text-lg font-bold text-card-foreground">{phase.phase}</h3>
                            <div className="flex items-center gap-3 mt-1 md:mt-0">
                              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{phase.timeline}</span>
                              <span className="text-xs bg-secondary/20 px-2 py-1 rounded-full text-secondary-foreground font-semibold">{phase.scope}</span>
                            </div>
                          </div>
                          <ul className="grid grid-cols-2 gap-2">
                            {phase.tasks.map((t) => (
                              <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ArrowRight className="h-3 w-3 text-accent shrink-0" />
                                {t}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 2: Real-World Integrations */}
              {currentSlide === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                    <Globe className="h-6 w-6 text-secondary" />
                    Real-World API Integrations
                  </h2>
                  <p className="text-muted-foreground mb-6">Production-ready examples with Indian utility providers</p>
                  <div className="space-y-4">
                    {integrations.map((integ, i) => (
                      <motion.div
                        key={integ.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12 }}
                        className="rounded-2xl bg-card p-6 kiosk-card-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted shrink-0`}>
                            <integ.icon className={`h-6 w-6 ${integ.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-card-foreground text-lg">{integ.name}</h3>
                            <div className="flex items-center gap-2 mt-1 mb-3">
                              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">{integ.api}</span>
                              <code className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded font-mono">{integ.endpoint}</code>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              {integ.features.map((f) => (
                                <span key={f} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                  <Server className="h-3 w-3 text-accent shrink-0" />
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Slide 3: Performance Metrics */}
              {currentSlide === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-secondary" />
                    Performance Metrics
                  </h2>
                  <p className="text-muted-foreground mb-6">Impact data from pilot deployment studies</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {metrics.map((m, i) => (
                      <motion.div
                        key={m.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl bg-card p-6 kiosk-card-shadow text-center"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/15 mx-auto mb-3">
                          <m.icon className="h-7 w-7 text-secondary" />
                        </div>
                        <p className="text-4xl font-extrabold text-primary mb-1">{m.value}</p>
                        <p className="font-semibold text-card-foreground text-sm">{m.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{m.detail}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-accent/10 p-4 text-center border border-accent/20">
                      <p className="text-2xl font-bold text-accent">99.7%</p>
                      <p className="text-xs text-muted-foreground">System Uptime</p>
                    </div>
                    <div className="rounded-2xl bg-secondary/10 p-4 text-center border border-secondary/20">
                      <p className="text-2xl font-bold text-secondary">2.3s</p>
                      <p className="text-xs text-muted-foreground">Avg. Response Time</p>
                    </div>
                    <div className="rounded-2xl bg-primary/10 p-4 text-center border border-primary/20">
                      <p className="text-2xl font-bold text-primary">₹45/txn</p>
                      <p className="text-xs text-muted-foreground">Cost per Transaction</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 4: UI Mockup */}
              {currentSlide === 4 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                    <Target className="h-6 w-6 text-secondary" />
                    Live UI Mockup
                  </h2>
                  <p className="text-muted-foreground mb-6">Interactive preview of the kiosk experience</p>
                  {/* Mini mockup of the kiosk flow */}
                  <div className="rounded-2xl bg-card kiosk-card-shadow overflow-hidden border border-border">
                    {/* Fake header */}
                    <div className="kiosk-hero-gradient px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">CC</div>
                        <span className="text-sm font-bold text-primary-foreground">CiviConnect</span>
                      </div>
                      <span className="text-xs text-primary-foreground/70">Select Service</span>
                    </div>
                    {/* Fake service grid */}
                    <div className="p-4">
                      <p className="text-sm font-semibold text-card-foreground mb-3">What can we help you with?</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { icon: Zap, label: "Electricity", bg: "bg-electricity/15" },
                          { icon: Flame, label: "Gas", bg: "bg-gas/15" },
                          { icon: Building2, label: "Municipal", bg: "bg-primary/10" },
                        ].map((s) => (
                          <div key={s.label} className={`flex flex-col items-center gap-1.5 rounded-xl ${s.bg} p-3`}>
                            <s.icon className="h-5 w-5 text-foreground" />
                            <span className="text-xs font-medium text-card-foreground">{s.label}</span>
                          </div>
                        ))}
                      </div>
                      {/* Fake bill card */}
                      <div className="mt-3 rounded-xl bg-muted/50 p-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Electricity Bill</span>
                          <span className="font-bold text-primary">₹2,450</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Account</span>
                          <span className="text-card-foreground">ELEC-29384756</span>
                        </div>
                      </div>
                      <div className="mt-3 kiosk-amber-gradient text-primary-foreground text-center text-xs font-bold py-2 rounded-lg">
                        Pay Now →
                      </div>
                    </div>
                    {/* Fake footer */}
                    <div className="border-t border-border px-4 py-2 flex justify-between text-[10px] text-muted-foreground">
                      <span>CiviConnect — Unified Civic Utility Kiosk</span>
                      <span>Powered by Smart City Initiative</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button variant="kiosk" className="flex-1 h-12" onClick={() => navigate("/")}>
                      Try Live Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="border-t border-border bg-card px-6 py-3 flex items-center justify-between">
          <Button
            variant="kioskOutline"
            size="sm"
            onClick={prev}
            disabled={currentSlide === 0}
            className="h-10"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentSlide + 1} / {slides.length}
          </span>
          <Button
            variant="kiosk"
            size="sm"
            onClick={next}
            disabled={currentSlide === slides.length - 1}
            className="h-10"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </KioskLayout>
  );
};

export default PresentationScreen;


