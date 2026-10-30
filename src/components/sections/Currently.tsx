'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';

interface CurrentlyProps {
  data: PortfolioData['currently'];
}

export function Currently({ data }: CurrentlyProps) {
  return (
    <section aria-labelledby="currently-title" id="currently" className="py-16 sm:py-20 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-2">
          {data.label}
        </p>
        <h2 id="currently-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-8">
          {data.title}
        </h2>

        {/* Clean four-item list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.items.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-md border border-border bg-surface/30 hover:border-foreground transition-colors duration-150"
            >
              <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider block mb-1">
                {item.kicker}
              </span>
              <p className="text-base text-foreground font-medium leading-snug">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
