'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { BarberCard } from '@/components/BarberCard';
import { ReviewCard } from '@/components/Reviews';
import { useAppointmentStore } from '@/lib/appointmentStore';

const TESTIMONIALS = [
  {
    rating: 5,
    title: 'Absolute perfection',
    comment: 'Marcus is a true craftsman. Every line is precise. This is not just a haircut, it\'s an experience.',
    authorName: 'James Wilson',
    authorRole: 'CEO',
  },
  {
    rating: 5,
    title: 'Best barbershop in the city',
    comment: 'Finally found a place that takes pride in their work. The attention to detail is unmatched.',
    authorName: 'David Chen',
    authorRole: 'Designer',
  },
  {
    rating: 5,
    title: 'Worth every penny',
    comment: 'Professional, friendly, and incredibly talented. Highly recommend to anyone looking for a real barber.',
    authorName: 'Michael Torres',
    authorRole: 'Attorney',
  },
];

const SERVICES = [
  {
    name: 'Haircut',
    price: '$30',
    duration: '30 min',
    description: 'Classic haircut with precision trimming and a clean finish.',
    icon: '✂️',
  },
  {
    name: 'Skin Fade',
    price: '$35',
    duration: '30 min',
    description: 'Modern fade with clean, sharp lines and smooth blending.',
    icon: '🪒',
  },
  {
    name: 'Beard Trim',
    price: '$20',
    duration: '20 min',
    description: 'Professional beard shaping to define your look.',
    icon: '🧔',
  },
  {
    name: 'Full Service',
    price: '$50',
    duration: '60 min',
    description: 'Complete cut + beard trim + hot towel shave. The works.',
    icon: '⭐',
  },
];

const FEATURED_IN = ['GQ', 'ESQUIRE', "MEN'S HEALTH", 'FORBES', 'COMPLEX'];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Choose your service',
    desc: 'Pick from haircuts, skin fades, beard trims, or our full premium service — clear pricing, no surprises.',
  },
  {
    step: '02',
    title: 'Pick your barber',
    desc: 'Browse our master barbers, see their specialties and reviews, and book the one that fits your style.',
  },
  {
    step: '03',
    title: 'Book and relax',
    desc: 'Reserve your slot in seconds. We\'ll confirm and send a reminder before your visit.',
  },
];

const BENEFITS = [
  {
    icon: '⭐',
    title: 'Master craftsmanship',
    desc: 'Every barber on our team has 5+ years of experience and a portfolio that speaks for itself.',
  },
  {
    icon: '📅',
    title: 'Booking that just works',
    desc: 'Reschedule, cancel, or rebook in two taps. Confirmations and reminders handled for you.',
  },
  {
    icon: '✨',
    title: 'A premium experience',
    desc: 'Hot towel finish, complimentary drink, and the kind of attention to detail you can feel.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { barbers, fetchBarbers, error } = useAppointmentStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    fetchBarbers();
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white text-gray-900">
      <Navbar />

      {/* ──────────────────────────────── */}
      {/* HERO */}
      {/* ──────────────────────────────── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden ">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="headline-lg mb-6">
                Premium barbershop<br />
                <span className="text-gold-500">booking, made simple.</span>
              </h1>

              <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Skip the phone calls. Pick your barber, choose your service, and lock in your slot in under two minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/book" className="btn-primary text-lg">
                  Book my appointment
                </Link>
                <Link href="/#how-it-works" className="btn-secondary text-lg">
                  See how it works
                </Link>
              </div>
            </motion.div>

            {/* Right: hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative aspect-[4/3] lg:aspect-[5/4] rounded-2xl overflow-hidden border border-gray-200 shadow-xl"
            >
              <Image
                src="/images/hero-shop.jpg"
                alt="Master barber grooming a client at our premium shop"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Floating rating chip */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
                <span className="text-gold-500 text-2xl">★</span>
                <div>
                  <p className="text-sm font-black text-gray-900">4.9 / 5</p>
                  <p className="text-xs text-gray-500">from 1,000+ clients</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────── */}
      {/* HOW IT WORKS */}
      {/* ──────────────────────────────── */}
      <section id="how-it-works" className="section border-gray-200 bg-gray-50">
        <div className="section-contained">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: anchor image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 shadow-lg order-2 lg:order-1"
            >
              <Image
                src="/images/fade-haircut.jpg"
                alt="Master barber giving a precise fade haircut"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Right: steps */}
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <motion.div variants={item} className="mb-10">
                <p className="text-sm font-bold text-gold-600 uppercase tracking-widest mb-4">How it works</p>
                <h2 className="headline-md mb-4">
                  Booked in <span className="text-gold-500">three steps.</span>
                </h2>
                <p className="text-gray-600">
                  No phone calls. No back-and-forth. Just a clean, fast path from "I need a cut" to "I'm in the chair."
                </p>
              </motion.div>

              <div className="space-y-8">
                {HOW_IT_WORKS.map((step) => (
                  <motion.div key={step.step} variants={item} className="flex gap-5">
                    <div className="text-3xl font-black text-gold-400/70 leading-none pt-1 shrink-0 w-12">{step.step}</div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-gray-900">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-sm">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={item} className="mt-10">
                <Link href="/book" className="btn-secondary">
                  Start booking →
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────── */}
      {/* BARBERS */}
      {/* ──────────────────────────────── */}
      <section id="barbers" className="section border-gray-200 bg-gray-50">
        <div className="section-contained">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-sm font-bold text-gold-600 uppercase tracking-widest mb-4">Our team</p>
            <h2 className="headline-md mb-4">
              Meet your <span className="text-gold-500">master barbers.</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Skilled professionals dedicated to delivering the perfect cut every single time.
            </p>
          </motion.div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading barbers: {error}</p>
            </div>
          ) : barbers.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {barbers.map((barber) => (
                <motion.div key={barber.id} variants={item}>
                  <BarberCard
                    id={barber.id}
                    name={barber.name}
                    specialty={barber.specialty || 'Expert Barber'}
                    bio={(barber as any).bio}
                    photoUrl={(barber as any).photoUrl}
                    rating={(barber as any).rating || 4.8}
                    ratingCount={(barber as any).ratingCount || 0}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading our expert barbers...</p>
            </div>
          )}
        </div>
      </section>

      {/* ──────────────────────────────── */}
      {/* THE EXPERIENCE — full-bleed horizontal */}
      {/* ──────────────────────────────── */}
      <section className="relative h-[450px] md:h-[560px] overflow-hidden">
        <Image
          src="/images/beard-trim.jpg"
          alt="Master barber trimming a client's beard with precision"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/30" />

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <p className="text-sm font-bold text-gold-600 uppercase tracking-widest mb-4">The experience</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-6">
                Where craft <span className="text-gold-500">meets care.</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Every cut is a quiet ritual — sharp lines, warm towels, and barbers who actually listen. No rush, no shortcuts, no compromises.
              </p>
              <Link href="/#barbers" className="btn-secondary">
                Meet the team →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

    
      {/* ──────────────────────────────── */}
      {/* IMAGE + TEXT CTA */}
      {/* ──────────────────────────────── */}
      <section className="section bg-gray-50">
        <div className="section-contained">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gray-200 shadow-lg"
            >
              <Image
                src="/images/beard-detail.jpg"
                alt="Detailed beard trim by a master barber"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-bold text-gold-600 uppercase tracking-widest mb-4">Anywhere, anytime</p>
              <h2 className="headline-md mb-6">
                Book once, <span className="text-gold-500">manage everywhere.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Reschedule, cancel, or rebook from your phone in seconds. Get reminders before every appointment so you never miss a cut.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-gold-500 font-bold mt-0.5">✓</span>
                  <span>Instant confirmations and SMS reminders</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-gold-500 font-bold mt-0.5">✓</span>
                  <span>Reschedule or cancel up to 2 hours before</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="text-gold-500 font-bold mt-0.5">✓</span>
                  <span>Full booking history in your dashboard</span>
                </li>
              </ul>
              <Link href="/register" className="btn-primary">
                Create your account
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────── */}
      {/* FOOTER */}
      {/* ──────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-gray-900 py-16">
        <div className="section-contained">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <p className="font-black text-xl text-white mb-3">✦ NJIT CUTZ</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Premium barbershop experience. Precision cuts, expert hands, outstanding service.
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Navigation</p>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">Home</Link></li>
                <li><Link href="/#how-it-works" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">How it works</Link></li>
                <li><Link href="/book" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">Book Now</Link></li>
                <li><Link href="/login" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Services</p>
              <ul className="space-y-2">
                {SERVICES.map((s) => (
                  <li key={s.name}><Link href="/book" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">{s.name}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Hours</p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Monday – Friday</li>
                <li>9:00 AM – 6:00 PM</li>
                <li className="pt-2">Saturday</li>
                <li>10:00 AM – 4:00 PM</li>
                <li className="text-gray-600">Sunday — Closed</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">© {new Date().getFullYear()} NJIT CUTZ. All rights reserved.</p>
            <p className="text-xs text-gray-600">Built with Next.js · PostgreSQL · Prisma</p>
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      {isScrolled && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-4 bg-white border-t border-gray-200 shadow-lg"
        >
          <Link href="/book" className="btn-primary w-full text-center text-lg">
            Book Now
          </Link>
        </motion.div>
      )}
    </div>
  );
}
