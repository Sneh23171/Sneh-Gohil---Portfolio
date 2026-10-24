import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, animate, useInView } from 'framer-motion';
import { personalInfo } from '../data/portfolioData';
import ResumeModal from './ResumeModal';
import {
  Download,
  ArrowUpRight,
  Briefcase,
  Coffee,
  Laptop,
  Headphones,
  Clapperboard,
  Moon,
} from 'lucide-react';

const rotatingTitles = [
  'Frontend Developer',
  'WordPress Developer',
  'WooCommerce Developer',
  'Custom Plugin Developer',
];

// ─── Animated Number Counter ─────────────────────────────────────────────────

function AnimatedCounter({ value, decimals = 0, suffix = '', duration = 1.8 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
    });

    return () => controls.stop();
  }, [inView, value, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className="inline-block tabular-nums">
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue)}
      {suffix}
    </span>
  );
}

// ─── Activity State Logic ────────────────────────────────────────────────────

function getActivityState(now) {
  const day = now.getDay(); // 0=Sun, 1=Mon…6=Sat
  const totalMins = now.getHours() * 60 + now.getMinutes();
  const isWeekday = day >= 1 && day <= 5;
  const isWeekend = day === 0 || day === 6;

  if (isWeekday && totalMins >= 5 * 60 && totalMins < 9 * 60)        return 'morning';
  if (isWeekday && totalMins >= 9 * 60 && totalMins < 18 * 60 + 30)  return 'work';
  if (isWeekday && totalMins >= 18 * 60 + 30 && totalMins < 23 * 60) return 'evening';
  if (isWeekend && totalMins >= 8 * 60 && totalMins < 23 * 60)        return 'weekend';
  return 'sleep';
}

// ─── Animated Lucide Icon Wrappers ───────────────────────────────────────────

function AnimatedCoffee({ reduced }) {
  return (
    <motion.span
      animate={reduced ? {} : {
        rotate: [0, -12, 12, -8, 8, 0],
        y:      [0, -1, 1, -1, 0],
      }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
      className="inline-flex"
    >
      <Coffee className="w-3.5 h-3.5" strokeWidth={2} />
    </motion.span>
  );
}

function AnimatedLaptop({ reduced }) {
  return (
    <motion.span
      animate={reduced ? {} : {
        scaleY: [1, 1.06, 1, 1.06, 1],
        scaleX: [1, 0.97, 1, 0.97, 1],
      }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
      className="inline-flex"
    >
      <Laptop className="w-3.5 h-3.5" strokeWidth={2} />
    </motion.span>
  );
}

function AnimatedHeadphones({ reduced }) {
  return (
    <motion.span
      animate={reduced ? {} : {
        rotate: [-8, 8, -8],
        scale:  [1, 1.1, 1],
      }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      className="inline-flex"
    >
      <Headphones className="w-3.5 h-3.5" strokeWidth={2} />
    </motion.span>
  );
}

function AnimatedClapperboard({ reduced }) {
  return (
    <motion.span
      animate={reduced ? {} : {
        rotate: [0, -15, 0],
        y:      [0, -2, 0],
      }}
      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: 'easeOut' }}
      className="inline-flex"
      style={{ transformOrigin: 'bottom center' }}
    >
      <Clapperboard className="w-3.5 h-3.5" strokeWidth={2} />
    </motion.span>
  );
}

function AnimatedMoon({ reduced }) {
  return (
    <motion.span
      animate={reduced ? {} : {
        rotate: [0, 20, 0, -20, 0],
        opacity: [1, 0.6, 1, 0.6, 1],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="inline-flex"
    >
      <Moon className="w-3.5 h-3.5" strokeWidth={2} />
    </motion.span>
  );
}

// ─── Activity Config ─────────────────────────────────────────────────────────

const ACTIVITY_CONFIG = {
  morning: {
    label:       'Getting ready for office',
    glowRgb:     '245, 158, 11',
    pillStyle:   'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-800/50 text-amber-800 dark:text-amber-300',
    dotColor:    '#F59E0B',
    Icon:        AnimatedCoffee,
  },
  work: {
    label:       'At work, building websites',
    glowRgb:     '59, 130, 246',
    pillStyle:   'bg-blue-50/90 dark:bg-blue-950/30 border-blue-200/80 dark:border-blue-800/50 text-blue-800 dark:text-blue-300',
    dotColor:    '#3B82F6',
    Icon:        AnimatedLaptop,
  },
  evening: {
    label:       'Home, chilling',
    glowRgb:     '168, 85, 247',
    pillStyle:   'bg-purple-50/90 dark:bg-purple-950/30 border-purple-200/80 dark:border-purple-800/50 text-purple-800 dark:text-purple-300',
    dotColor:    '#A855F7',
    Icon:        AnimatedHeadphones,
  },
  weekend: {
    label:       'Weekend mode, watching movies',
    glowRgb:     '239, 68, 68',
    pillStyle:   'bg-red-50/90 dark:bg-red-950/30 border-red-200/80 dark:border-red-800/50 text-red-800 dark:text-red-300',
    dotColor:    '#EF4444',
    Icon:        AnimatedClapperboard,
  },
  sleep: {
    label:       'Offline, catching some sleep',
    glowRgb:     '99, 102, 241',
    pillStyle:   'bg-indigo-50/90 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-800/50 text-indigo-800 dark:text-indigo-300',
    dotColor:    '#6366F1',
    Icon:        AnimatedMoon,
  },
};

// ─── Activity Pill ───────────────────────────────────────────────────────────

function ActivityPill({ state, reduced }) {
  const cfg = ACTIVITY_CONFIG[state];
  const { Icon } = cfg;

  return (
    <motion.div
      key={state}
      initial={{ opacity: 0, scale: 0.88, y: reduced ? 0 : 6 }}
      animate={{ opacity: 1, scale: 1,    y: 0 }}
      exit={{    opacity: 0, scale: 0.88, y: reduced ? 0 : 6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide shadow-sm backdrop-blur-md select-none ${cfg.pillStyle}`}
      aria-label={`Current status: ${cfg.label}`}
    >
      {/* Accent dot */}
      <span
        className="w-2 h-2 rounded-full shrink-0 animate-pulse"
        style={{ backgroundColor: cfg.dotColor, boxShadow: `0 0 6px ${cfg.dotColor}` }}
        aria-hidden="true"
      />
      {/* Animated icon */}
      <Icon reduced={reduced} />
      {/* Label */}
      <span className="hidden sm:inline">{cfg.label}</span>
      <span className="sm:hidden">{cfg.label.split(',')[0]}</span>
    </motion.div>
  );
}

// ─── Activity-state background glow ─────────────────────────────────────────

function ActivityGlow({ state, reduced }) {
  const { glowRgb } = ACTIVITY_CONFIG[state];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state}
        initial={{ opacity: 0 }}
        animate={{ opacity: reduced ? 0.04 : 0.08 }}
        exit={{    opacity: 0 }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none -z-10"
        aria-hidden="true"
        style={{
          background: `radial-gradient(ellipse 55% 38% at 20% 65%, rgba(${glowRgb}, 0.38) 0%, transparent 70%)`,
        }}
      />
    </AnimatePresence>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export default function Hero() {
  const [imgSrc, setImgSrc]           = useState(personalInfo.avatar);
  const [titleIndex, setTitleIndex]   = useState(0);
  const [activityState, setActivity]  = useState(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const shouldReduceMotion            = useReducedMotion();

  // Compute IST time client-side (UTC+5:30) to avoid hydration mismatch
  useEffect(() => {
    function tick() {
      const now = new Date();
      const ist = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 5.5 * 3600000);
      setActivity(getActivityState(ist));
    }
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Rotating title timer
  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => setTitleIndex(i => (i + 1) % rotatingTitles.length), 2600);
    return () => clearInterval(id);
  }, [shouldReduceMotion]);

  return (
    <section
      className="pt-36 pb-20 px-6 min-h-[90vh] flex items-center relative overflow-hidden transition-colors duration-300"
      id="home"
    >
      {/* Existing ambient radial glow */}
      <motion.div
        animate={
          shouldReduceMotion
            ? { scale: 1, opacity: 0.06 }
            : { scale: [1, 1.12, 1], opacity: [0.04, 0.08, 0.04] }
        }
        transition={shouldReduceMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-blue-400 to-indigo-500 dark:from-white dark:to-white rounded-full blur-[140px] pointer-events-none -z-10"
      />

      {/* Activity-state soft background glow */}
      {activityState && <ActivityGlow state={activityState} reduced={shouldReduceMotion} />}

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* ── Left Column ─────────────────────────────────────────────────── */}
        <div className="order-2 lg:order-1 flex flex-col justify-center">

          {/* Activity Pill only (freelance pill removed) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            {activityState && (
              <AnimatePresence mode="wait">
                <ActivityPill
                  key={activityState}
                  state={activityState}
                  reduced={shouldReduceMotion}
                />
              </AnimatePresence>
            )}
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] mb-4 tracking-tight text-slate-950 dark:text-white"
          >
            Frontend &amp; Web{' '}
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-white dark:via-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent font-medium">
              Developer
            </span>
          </motion.h1>

          {/* Rotating specialization title */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5 mb-6 h-9 overflow-hidden"
          >
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-neutral-500 shrink-0">
              Specializing as:
            </span>
            <div className="relative inline-flex items-center h-full min-w-[210px] sm:min-w-[260px]">
              {shouldReduceMotion ? (
                <span className="px-3 py-1 rounded-md bg-blue-50 dark:bg-white/10 text-blue-700 dark:text-white border border-blue-200/80 dark:border-white/15 text-xs sm:text-sm font-bold tracking-wide">
                  {rotatingTitles[0]}
                </span>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingTitles[titleIndex]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="px-3 py-1 rounded-md bg-blue-50 dark:bg-white/10 text-blue-700 dark:text-white border border-blue-200/80 dark:border-white/15 text-xs sm:text-sm font-bold tracking-wide shadow-sm inline-block"
                  >
                    {rotatingTitles[titleIndex]}
                  </motion.span>
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          {/* Bio text */}
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-slate-600 dark:text-neutral-400 max-w-xl mb-10 leading-relaxed font-normal"
          >
            {personalInfo.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="#projects"
              className="px-7 py-3.5 bg-slate-950 text-white hover:bg-slate-800 shadow-lg shadow-slate-950/20 dark:bg-white dark:text-black dark:hover:bg-neutral-200 dark:shadow-white/10 font-bold text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 stroke-[2.5]" />
              <span>View My Work</span>
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="#contact"
              className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 shadow-sm dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-white dark:border-neutral-700 font-bold text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <span>Hire Me for a Project</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 dark:text-neutral-400" />
            </motion.a>

            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsResumeModalOpen(true)}
              className="px-7 py-3.5 bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-200/90 shadow-sm dark:bg-transparent dark:hover:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download CV</span>
            </motion.button>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-3 gap-6 pt-12 mt-12 border-t border-slate-200/80 dark:border-neutral-800/80 max-w-lg"
          >
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                <AnimatedCounter value={1.5} decimals={1} suffix="+" duration={1.6} />
              </div>
              <div className="text-xs text-slate-500 dark:text-neutral-500 uppercase tracking-wider font-semibold mt-1">Years Experience</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                <AnimatedCounter value={100} decimals={0} suffix="%" duration={1.8} />
              </div>
              <div className="text-xs text-slate-500 dark:text-neutral-500 uppercase tracking-wider font-semibold mt-1">Responsive UI</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">Ahmedabad</div>
              <div className="text-xs text-slate-500 dark:text-neutral-500 uppercase tracking-wider font-semibold mt-1">Gujarat, India</div>
            </div>
          </motion.div>
        </div>

        {/* ── Right Column: Portrait ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 lg:order-2 relative flex justify-center items-center"
        >
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[420px] lg:h-[420px]">
            <div className="absolute inset-0 profile-shape bg-gradient-to-tr from-blue-500/35 via-indigo-400/30 to-purple-500/35 dark:from-white/20 dark:to-white/10 blur-3xl -z-10 scale-110" />
            <div className="relative z-10 w-full h-full profile-shape overflow-hidden border-4 border-white/95 dark:border-white/20 shadow-[0_20px_50px_rgba(79,70,229,0.18)] dark:shadow-[0_0_60px_rgba(255,255,255,0.08)] transition-all duration-500 hover:scale-105 hover:border-slate-100 dark:hover:border-white/40 bg-white dark:bg-neutral-950">
              <img
                src={imgSrc}
                alt="Portrait of Sneh Gohil, Frontend and Web Developer"
                className="w-full h-full object-cover object-center grayscale-0 dark:grayscale dark:hover:grayscale-0 transition-all duration-700"
                onError={() => setImgSrc(personalInfo.avatarFallback)}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modern Interactive Resume Preview & Download Modal */}
      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </section>
  );
}
