'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Download } from 'lucide-react';

interface EducationProps {
  data: PortfolioData['education'];
}

export function Education({ data }: EducationProps) {
  return (
    <section aria-labelledby="edu-title" id="education" className="py-16 sm:py-20 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-2">
          {data.label}
        </p>
        <h2 id="edu-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-8">
          {data.title}
        </h2>

        {/* Simple vertical list */}
        <div className="space-y-6">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-md border border-border bg-surface/30"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded border border-border bg-background text-foreground">
                  {item.status}
                </span>
                {item.dates && (
                  <span className="text-xs font-mono text-foreground-muted">
                    {item.dates}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-foreground tracking-tight">
                {item.degree}
              </h3>

              {item.institution && (
                <p className="text-sm text-foreground-muted mt-0.5">
                  {item.institution}
                </p>
              )}

              {item.description && (
                <p className="text-sm text-foreground-muted mt-3 leading-relaxed max-w-[65ch]">
                  {item.description}
                </p>
              )}

              {item.list_items && item.list_items.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-foreground-muted list-disc list-inside">
                  {item.list_items.map((li, idx) => (
                    <li key={idx}>{li}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Download CV Row */}
        {data.cv && (
          <div className="mt-12 p-6 rounded-md border border-border bg-surface/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {data.cv.title}
              </h3>
              <p className="text-sm text-foreground-muted mt-1">
                {data.cv.description}
              </p>
            </div>
            <a
              href={data.cv.file_url}
              download
              className="min-h-[44px] px-5 py-2.5 rounded-md bg-foreground text-background font-medium text-sm inline-flex items-center space-x-2 hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              <span>{data.cv.button_text}</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
