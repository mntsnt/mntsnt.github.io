'use client';

import React from 'react';
import Image from 'next/image';
import { HeroData, SocialLinks } from '@/types/portfolio';
import { ArrowUpRight, ArrowDownRight, Compass, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  data: HeroData;
  socials: SocialLinks;
}

export function Hero({ data, socials }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-name"
      className="relative pt-32 pb-24 md:pt-44 md:pb-36 border-b border-hairline overflow-hidden"
      id="top"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="max-w-7xl mx-auto h-full px-6 flex justify-between border-x border-hairline">
          <div className="w-[1px] h-full bg-hairline hidden md:block" />
          <div className="w-[1px] h-full bg-hairline hidden lg:block" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Meta / Specimen Header Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-foreground-muted pb-8 mb-8 border-b border-hairline"
        >
          <div className="flex items-center space-x-3">
            <span className="text-accent font-bold">[SPECIMEN-01]</span>
            <span>{data.city_meta}</span>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-foreground-muted" />
            <span>{data.year_meta}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-foreground font-medium">{data.status}</span>
          </div>
        </motion.div>

        {/* Hero Architectural Layout (Split Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Typographic Pillar (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mono-tag text-accent font-semibold flex items-center space-x-2"
            >
              <span>●</span>
              <span>{data.eyebrow}</span>
            </motion.p>

            <motion.h1
              id="hero-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="display-hero text-foreground tracking-tighter"
            >
              {data.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="inline-flex items-center space-x-3 px-3 py-1.5 border border-hairline bg-background-alt text-sm md:text-base font-mono"
            >
              <span className="text-foreground-muted">DISCIPLINE:</span>
              <span className="text-foreground font-bold">{data.discipline}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="body-reading text-lg md:text-xl text-foreground-muted"
            >
              {data.lead}
            </motion.p>

            {/* Magnetic CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <a
                href="#work"
                className="group relative inline-flex items-center space-x-2 px-7 py-4 text-xs font-mono uppercase tracking-widest text-background bg-foreground hover:bg-accent transition-colors"
              >
                <span>{data.explore_btn_text}</span>
                <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#contact"
                className="group inline-flex items-center space-x-2 px-7 py-4 text-xs font-mono uppercase tracking-widest text-foreground border border-hairline hover:border-foreground bg-background transition-colors"
              >
                <span>{data.contact_btn_text}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* Clinical Specimen Card Preview (4 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-4 border border-hairline bg-background p-6 space-y-6 crosshair-corner shadow-sm"
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground-muted border-b border-hairline pb-3">
              <span>INDEX: 01.IDENTITY</span>
              <span>ADDIS ABABA</span>
            </div>

            <div className="aspect-[4/3] relative bg-background-alt border border-hairline overflow-hidden group">
              <Image
                src="/img/profile-img.png"
                alt="Mintesnot Leliso"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 360px"
                className="object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-background/90 backdrop-blur-sm text-[10px] font-mono text-foreground border border-hairline">
                FIG 1.0 — PORTRAIT
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-foreground-muted">RESEARCH &amp; DESIGN</span>
                <span className="text-accent font-bold">ACTIVE</span>
              </div>
              <div className="h-1 w-full bg-background-alt overflow-hidden">
                <div className="h-full bg-accent w-3/4" />
              </div>
            </div>

            {/* Social channels bar */}
            <div className="pt-4 border-t border-hairline flex items-center justify-between text-xs font-mono">
              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground-muted hover:text-foreground hover:underline"
              >
                GITHUB
              </a>
              <span className="text-foreground-muted">/</span>
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground-muted hover:text-foreground hover:underline"
              >
                LINKEDIN
              </a>
              <span className="text-foreground-muted">/</span>
              <a
                href={`mailto:${socials.email}`}
                className="text-foreground-muted hover:text-foreground hover:underline"
              >
                EMAIL
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
