'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Download, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';

interface EducationProps {
  data: PortfolioData['education'];
}

export function Education({ data }: EducationProps) {
  return (
    <section aria-labelledby="edu-title" id="education" className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        <p className="text-xs uppercase tracking-widest text-foreground-muted font-mono font-medium mb-2">
          06 · Academic & Training
        </p>
        <h2 id="edu-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-12">
          Education & Journey
        </h2>

        {/* Timeline Items */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 sm:before:left-4 before:w-[1px] before:bg-border">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="relative pl-8 sm:pl-10 group"
            >
              {/* Dot */}
              <div className="absolute left-[9px] sm:left-[13px] top-6 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-background border-2 border-foreground group-hover:scale-125 transition-transform" />

              <div className="p-6 rounded-lg border border-border bg-surface/30 hover:border-foreground/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-medium font-mono px-2 py-0.5 rounded border border-border bg-background text-foreground">
                      {item.status}
                    </span>
                    {item.dates && (
                      <span className="text-xs font-mono text-foreground-muted">
                        {item.dates}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground tracking-tight">
                  {item.degree}
                </h3>

                {item.institution && (
                  <p className="text-sm font-medium text-foreground-muted mt-0.5">
                    {item.institution}
                  </p>
                )}

                {item.description && (
                  <p className="text-sm text-foreground-muted mt-3 leading-relaxed max-w-[62ch]">
                    {item.description}
                  </p>
                )}

                {item.list_items && item.list_items.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-xs text-foreground-muted">
                    {item.list_items.map((li, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-foreground-muted flex-shrink-0" />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Download CV Row */}
        {data.cv && (
          <div className="mt-12 p-6 rounded-lg border border-border bg-surface/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Download Curriculum Vitae
              </h3>
              <p className="text-xs sm:text-sm text-foreground-muted mt-1">
                Full academic background, clinical experience, software skills, and design portfolio summary.
              </p>
            </div>
            <a
              href={data.cv.file_url || '/doc/resume-mntsnt.pdf'}
              download="Mintesnot-Leliso-CV.pdf"
              className="min-h-[44px] px-5 py-2.5 rounded-md bg-foreground text-background font-medium text-xs sm:text-sm inline-flex items-center space-x-2 hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              <span>Download CV (PDF)</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
