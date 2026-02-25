import { Box, Zap, ScanLine, Boxes, ArrowRight, CheckCircle2, Star, ChevronRight } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNavigate } from "react-router";
import { useRef } from "react";

const FEATURES = [
  {
    icon: ScanLine,
    title: "AI Room Detection",
    desc: "Upload any 2D floor plan and our AI instantly identifies every room, wall, door, and window with precision.",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Zap,
    title: "Smart Furniture Placement",
    desc: "Our optimization engine scores hundreds of layout combinations and surfaces only the best-fit arrangements.",
    color: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    icon: Boxes,
    title: "Interactive 3D View",
    desc: "Explore your optimized layout in a real-time isometric 3D viewer. Rotate, zoom, and export in one click.",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
];

const STEPS = [
  { num: "01", title: "Upload Floor Plan",     desc: "Drop your 2D image or PDF floor plan into the system." },
  { num: "02", title: "AI Detects Rooms",      desc: "Our model maps every room boundary in seconds." },
  { num: "03", title: "Pick a Room",           desc: "Choose the room you want to optimize." },
  { num: "04", title: "View Scored Layouts",   desc: "Browse AI-ranked furniture arrangements by score." },
  { num: "05", title: "Explore in 3D",         desc: "Visualize the winning layout in an interactive 3D view." },
];

const STATS = [
  { value: "98%",  label: "Accuracy Rate" },
  { value: "< 15s", label: "Processing Time" },
  { value: "500+", label: "Layouts Scored" },
  { value: "10k+", label: "Rooms Designed" },
];

const TESTIMONIALS = [
  {
    name: "Sarah D.",
    role: "Interior Designer",
    text: "Cut my concept-to-presentation time by 70%. The AI nails functional layouts on the first try.",
    avatar: "SD",
  },
  {
    name: "James W.",
    role: "Architect",
    text: "The 3D viewer alone is worth it. Clients can see exactly what they are getting before we break ground.",
    avatar: "JW",
  },
  {
    name: "Megan R.",
    role: "Property Developer",
    text: "We use it across every stage-ready unit. The scored layouts save hours of manual back-and-forth.",
    avatar: "MR",
  },
];

export default function Welcome() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen w-full bg-white overflow-x-hidden">

      {/* ── Sticky Navbar ── */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-md">
              <Box className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-800 leading-none">3D Layout System</p>
              <p className="text-[10px] text-indigo-500 font-medium">AI-Powered Design</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="#features"    className="hover:text-indigo-700 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-700 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-indigo-700 transition-colors">Reviews</a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/signin")}
              className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/signup")}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Gradient Blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
        {/* Blueprint grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-7">

              {/* Badge */}
              <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-indigo-200 w-fit mx-auto lg:mx-0">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                AI-Powered Interior Design System
              </motion.div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                    Smart Floor Plan
                  </span>
                  <br />
                  <span className="text-gray-900">to 3D Layout</span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    in Seconds.
                  </span>
                </h1>
              </div>

              {/* Sub */}
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Upload your 2D floor plan and let our AI detect rooms, score hundreds of furniture arrangements, and render an interactive 3D view — all automatically.
              </p>

              {/* Checks */}
              <ul className="space-y-2 text-sm text-gray-600 text-left w-fit mx-auto lg:mx-0">
                {["No 3D modelling skills required", "Results in under 15 seconds", "Export-ready 3D visualization"].map(t => (
                  <li key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-1">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/signup")}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-base font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:from-blue-700 hover:to-indigo-800 transition-all"
                >
                  Start for Free
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/signin")}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-indigo-200 text-indigo-700 text-base font-bold rounded-2xl hover:bg-indigo-50 hover:border-indigo-400 transition-all shadow-md"
                >
                  Sign In
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Social proof micro-text */}
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mx-auto lg:mx-0">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-gray-500 font-medium">Trusted by 10,000+ designers</span>
              </p>
            </motion.div>

            {/* Right — Hero Image */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
              className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-indigo-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1757344454271-bad02eff9fda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMDNEJTIwcmVuZGVyfGVufDF8fHx8MTc3MjAwMTI1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="3D Room Layout Preview"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent" />
              </div>

              {/* Floating card — score */}
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Layout Score</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">92</span>
                  <span className="text-gray-400 text-sm mb-1">/100</span>
                </div>
                <div className="w-28 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
                </div>
              </motion.div>

              {/* Floating card — processing */}
              <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Room Detected</p>
                    <p className="text-[10px] text-green-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                      AI ready
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 py-10">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.09 }}
                className="text-center">
                <p className="text-4xl font-extrabold text-white">{s.value}</p>
                <p className="text-blue-200 text-sm font-medium mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16 space-y-3">
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full border border-indigo-200">
              Core Features
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Everything you need,<br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">nothing you don't.</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">Three powerful AI modules working together to turn a flat image into a fully realized 3D interior.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  className={`${f.bg} ${f.border} border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 shadow-md`}>
                    <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16 space-y-3">
            <span className="inline-block bg-white text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full border border-indigo-200 shadow-sm">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              From upload to 3D in{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">5 steps.</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-[28px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-300 to-purple-300 hidden md:block" />
            <div className="space-y-6">
              {STEPS.map((step, i) => (
                <motion.div key={step.num} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
                    <span className="text-white font-extrabold text-lg">{step.num}</span>
                  </div>
                  <div className="pt-1">
                    <p className="font-bold text-gray-800 text-base mb-1">{step.title}</p>
                    <p className="text-gray-500 text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16 space-y-3">
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full border border-amber-200">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Loved by{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">design professionals.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6, transition: { duration: 0.22 } }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-7 border border-indigo-100 shadow-sm hover:shadow-lg transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xs font-bold shadow">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-indigo-500 font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 text-center space-y-7">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Ready to transform your floor plan?
          </h2>
          <p className="text-blue-100 text-lg">
            Join thousands of designers and architects already using AI to create better spaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/signup")}
              className="px-10 py-4 bg-white text-indigo-700 font-extrabold text-base rounded-2xl shadow-2xl hover:shadow-white/20 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate("/signin")}
              className="px-10 py-4 bg-transparent border-2 border-white/50 text-white font-bold text-base rounded-2xl hover:bg-white/10 transition-all"
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl">
              <Box className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-white font-bold text-sm">3D Layout System</span>
          </div>
          <p className="text-gray-500 text-xs">© 2026 Smart Floor Plan to 3D Layout Optimization System. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-gray-500">
            <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-indigo-400 transition-colors">Reviews</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
