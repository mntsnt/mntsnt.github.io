'use client';

import React from 'react';
import Image from 'next/image';
import { AboutData, StatItem } from '@/types/portfolio';
import { Sparkles, MapPin, GraduationCap } from 'lucide-react';

interface AboutProps {
  data: AboutData;
  stats: StatItem[];
}

export function About({ data, stats }: AboutProps) {
  return (
    <section aria-labelledby="about-title" id="about" className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        <p className="text-xs uppercase tracking-widest text-foreground-muted font-mono font-medium mb-12">
          03 · Story & Background
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          {/* Portrait Column (4 cols) */}
          <div className="md:col-span-4">
            <div className="border border-border rounded-lg overflow-hidden bg-surface shadow-xs">
              <div className="aspect-[4/5] relative">
                <Image
                  src={data.portrait_url || '/img/profile-img.png'}
                  alt={data.portrait_alt || 'Portrait of Mintesnot Leliso'}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-foreground-muted">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Addis Ababa, Ethiopia</span>
              </span>
              <span className="font-mono text-[11px]">SPHMMC</span>
            </div>
          </div>

          {/* Narrative Column (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            <h2
              id="about-title"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
            >
              Connecting visual clarity with digital tools.
            </h2>

            <div className="space-y-4 text-base text-foreground-muted leading-relaxed max-w-[62ch]">
              <p>
                I am an Ethiopian medical student with a deep passion for visual design and software engineering. I believe that good design makes complex health knowledge intuitive, and simple code makes everyday human work effortless.
              </p>
              <p>
                Whether designing an exhibition booth for a regional healthcare federation or building a responsive web app, I focus on honest aesthetics, accessibility, and real-world utility.
              </p>
            </div>

            {/* Scripture Quote */}
            <blockquote className="border-l-2 border-foreground pl-4 py-1 italic text-foreground-muted text-sm leading-relaxed max-w-[60ch]">
              <p>&ldquo;{data.quote || 'And whatever you do, in word or deed, do everything in the name of the Lord Jesus, giving thanks to God the Father through him.'}&rdquo;</p>
              <cite className="block text-xs not-italic font-medium text-foreground mt-2">
                — {data.quote_cite || 'Colossians 3:17'}
              </cite>
            </blockquote>

            {/* Key Metrics */}
            <div className="pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border bg-surface/40">
                <div className="text-2xl font-bold text-foreground tracking-tight">
                  50+
                </div>
                <div className="text-xs text-foreground-muted mt-1">
                  Projects Completed
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border bg-surface/40">
                <div className="text-2xl font-bold text-foreground tracking-tight">
                  4+
                </div>
                <div className="text-xs text-foreground-muted mt-1">
                  Years Designing & Coding
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 p-4 rounded-lg border border-border bg-surface/40">
                <div className="text-2xl font-bold text-foreground tracking-tight">
                  2031
                </div>
                <div className="text-xs text-foreground-muted mt-1">
                  MD Candidate (SPHMMC)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
