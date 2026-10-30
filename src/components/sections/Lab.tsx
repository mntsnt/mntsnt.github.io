'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';

interface LabProps {
  data: PortfolioData['lab'];
}

export function Lab({ data }: LabProps) {
  return (
    <section aria-labelledby="lab-title" id="lab" className="py-16 sm:py-20 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-2">
          {data.label}
        </p>
        <h2 id="lab-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {data.title}
        </h2>
        {data.lede && (
          <p className="mt-3 text-base text-foreground-muted max-w-[65ch]">
            {data.lede}
          </p>
        )}

        {/* Three plain text blocks */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-md border border-border bg-surface/30 hover:border-foreground transition-colors duration-150 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider block mb-2">
                  {item.kicker}
                </span>
                <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
