'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Stethoscope, Palette, Code2, ArrowUpRight } from 'lucide-react';

interface PracticeProps {
  data: PortfolioData['practice'];
}

export function Practice({ data }: PracticeProps) {
  const cards = [
    {
      num: '01',
      title: 'Clinical Medicine',
      role: 'MD Candidate · SPHMMC Class of 2031',
      icon: Stethoscope,
      summary:
        'Studying medicine at St. Paul’s Hospital Millennium Medical College. Actively involved in community health screenings, clinical communications, and medical education.',
      tags: ['Health Communication', 'Clinical Outreach', 'Preventive Care'],
      linkText: 'View certificates',
      linkHref: '#certificates',
    },
    {
      num: '02',
      title: 'Visual Design',
      role: 'Brand Identity · Thumbnails · Editorial',
      icon: Palette,
      summary:
        'Creating high-CTR YouTube thumbnails, brand identities, posters, and exhibition booths. Winner of a 1st place album redesign challenge with 50+ projects shipped.',
      tags: ['Brand Identity', 'Thumbnails', 'Event Booths'],
      linkText: 'Explore gallery',
      linkHref: '#work',
    },
    {
      num: '03',
      title: 'Software Engineering',
      role: 'Web Development · React, Next.js & Python',
      icon: Code2,
      summary:
        'Building responsive, accessible web tools and software applications. Power Learn Project graduate with a focus on practical digital health and educational utilities.',
      tags: ['React & Next.js', 'Python & SQL', 'TypeScript'],
      linkText: 'See toolkit',
      linkHref: '#skills',
    },
  ];

  return (
    <section aria-labelledby="practice-title" id="practice" className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-foreground-muted font-mono font-medium mb-2">
              02 · Focus Matrix
            </p>
            <h2 id="practice-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Medicine × Design × Technology
            </h2>
            <p className="mt-2 text-sm sm:text-base text-foreground-muted max-w-[60ch]">
              Three interconnected disciplines that shape my perspective and drive my work.
            </p>
          </div>
          <span className="text-xs font-mono text-foreground-muted hidden sm:inline-block">
            Addis Ababa · 2026
          </span>
        </div>

        {/* 3 Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="group p-6 rounded-lg border border-border bg-surface/30 hover:bg-surface/70 hover:border-foreground/40 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono text-foreground-muted px-2 py-0.5 rounded border border-border bg-background">
                      {item.num}
                    </span>
                    <Icon className="w-4 h-4 text-foreground-muted group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-foreground-muted mb-4 font-medium">
                    {item.role}
                  </p>

                  <p className="text-sm text-foreground-muted leading-relaxed mb-6">
                    {item.summary}
                  </p>
                </div>

                <div>
                  {/* Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5 pt-4 border-t border-border/60">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-background border border-border text-foreground-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Clean Link */}
                  <a
                    href={item.linkHref}
                    className="inline-flex items-center space-x-1 text-xs font-medium text-foreground hover:underline"
                  >
                    <span>{item.linkText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
