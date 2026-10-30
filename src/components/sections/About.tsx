'use client';

import React from 'react';
import Image from 'next/image';
import { AboutData, StatItem } from '@/types/portfolio';

interface AboutProps {
  data: AboutData;
  stats: StatItem[];
}

export function About({ data, stats }: AboutProps) {
  return (
    <section aria-labelledby="about-title" id="about" className="py-16 sm:py-20 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-8">
          {data.label}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Portrait Column (4 cols) */}
          <div className="md:col-span-4">
            <div className="border border-border rounded-md overflow-hidden bg-surface">
              <div className="aspect-[4/5] relative">
                <Image
                  src={data.portrait_url}
                  alt={data.portrait_alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover"
                />
              </div>
            </div>
            {data.portrait_caption && (
              <p className="text-xs text-foreground-muted mt-2">
                {data.portrait_caption}
              </p>
            )}
          </div>

          {/* Text & Content Column (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            <h2
              id="about-title"
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground whitespace-pre-line"
            >
              {data.title}
            </h2>

            <div className="space-y-4 text-base text-foreground leading-relaxed max-w-[65ch]">
              <p>{data.body_1}</p>
              <p>{data.body_2}</p>
            </div>

            {/* Quote */}
            <blockquote className="border-l-2 border-foreground pl-4 py-1 italic text-foreground-muted text-sm leading-relaxed max-w-[65ch]">
              <p>“{data.quote}”</p>
              <cite className="block text-xs not-italic font-medium text-foreground mt-2">
                — {data.quote_cite}
              </cite>
            </blockquote>

            {/* Two Stats */}
            <div className="pt-6 border-t border-border grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <div key={stat.id || idx} className="p-4 rounded-md border border-border bg-surface/50">
                  <div className="text-2xl font-semibold text-foreground tracking-tight">
                    {stat.number}
                  </div>
                  <div className="text-xs text-foreground-muted mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
