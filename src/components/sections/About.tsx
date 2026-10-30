'use client';

import React from 'react';
import Image from 'next/image';
import { AboutData, StatItem } from '@/types/portfolio';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface AboutProps {
  data: AboutData;
  stats: StatItem[];
}

export function About({ data, stats }: AboutProps) {
  return (
    <section aria-labelledby="about-title" className="py-24 md:py-36 border-b border-hairline" id="about">
      <div className="max-w-7xl mx-auto px-6">
        {/* Specimen Index Header */}
        <div className="flex items-center space-x-3 mb-16 text-xs font-mono">
          <span className="text-accent font-bold">[{data.index_meta}]</span>
          <span className="uppercase tracking-widest text-foreground-muted">{data.label}</span>
          <span className="h-[1px] flex-1 bg-hairline" />
          <span className="text-foreground-muted uppercase">CASE FILE NO. 02</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Portrait Column with Specimen Caliper Frame (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative border border-hairline p-3 bg-background crosshair-corner shadow-sm">
              <div className="aspect-[4/5] relative bg-background-alt border border-hairline overflow-hidden">
                <Image
                  src={data.portrait_url}
                  alt={data.portrait_alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover grayscale contrast-[1.08] hover:grayscale-0 transition-all duration-700"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-foreground-muted">
                <span>{data.portrait_caption}</span>
                <span className="text-accent">SPECIMEN ID: ML-2026</span>
              </div>
            </div>
          </div>

          {/* Copy & Quote & Stats Column (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h2
                id="about-title"
                className="specimen-title text-foreground mb-8 whitespace-pre-line tracking-tight"
              >
                {data.title}
              </h2>

              <div className="space-y-6 body-reading text-foreground-muted">
                <p>{data.body_1}</p>
                <p>{data.body_2}</p>
              </div>
            </div>

            {/* Illuminated Editorial Blockquote */}
            <blockquote className="relative p-6 md:p-8 border-l-2 border-accent bg-background-alt crosshair-corner">
              <Quote className="w-6 h-6 text-accent/40 mb-3" />
              <p className="text-base md:text-lg italic text-foreground mb-4 leading-relaxed font-serif">
                &ldquo;{data.quote}&rdquo;
              </p>
              <cite className="block text-xs font-mono uppercase tracking-widest text-accent font-semibold not-italic">
                — {data.quote_cite}
              </cite>
            </blockquote>

            {/* Dynamic Milestone Meters */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-hairline">
              {stats.map((stat, idx) => (
                <div key={idx} className="p-5 border border-hairline bg-background">
                  <p className="text-3xl md:text-4xl font-extrabold font-mono text-foreground tracking-tight">
                    {stat.number}
                  </p>
                  <p className="text-xs uppercase font-mono text-foreground-muted mt-2 tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
