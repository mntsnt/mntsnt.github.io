'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Radio, Activity, Terminal, Sparkles, Cpu } from 'lucide-react';

interface CurrentlyProps {
  data: PortfolioData['currently'];
}

export function Currently({ data }: CurrentlyProps) {
  const metaCodes = ['LIVE_MED_01', 'DEV_PROT_02', 'UX_DESIGN_03', 'ENG_STUDY_04'];
  const icons = [Radio, Activity, Sparkles, Cpu];

  return (
    <section aria-labelledby="now-title" className="py-24 md:py-36 border-b border-hairline" id="now">
      <div className="max-w-7xl mx-auto px-6">
        {/* Specimen Index Header */}
        <div className="flex items-center space-x-3 mb-10 text-xs font-mono">
          <span className="text-accent font-bold">[{data.index_meta}]</span>
          <span className="uppercase tracking-widest text-foreground-muted">{data.label}</span>
          <span className="h-[1px] flex-1 bg-hairline" />
          <span className="text-foreground-muted uppercase">TELEMETRY MONITOR</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <h2 id="now-title" className="specimen-title text-foreground">
            {data.title}
          </h2>

          <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>REAL-TIME STATUS · ACTIVE</span>
          </div>
        </div>

        {/* 2x2 Telemetry / Dashboard Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.items.map((item, idx) => {
            const Icon = icons[idx] || Terminal;
            return (
              <div
                key={idx}
                className="p-8 border border-hairline bg-background-alt hover:bg-background transition-colors crosshair-corner flex flex-col justify-between space-y-6"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2 text-accent">
                    <Icon className="w-4 h-4" />
                    <span className="font-bold">{item.kicker}</span>
                  </div>
                  <span className="text-foreground-muted">{metaCodes[idx]}</span>
                </div>

                <p className="text-xl md:text-2xl font-bold tracking-tight text-foreground leading-snug">
                  {item.text}
                </p>

                <div className="pt-4 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-foreground-muted">
                  <span>PROGRESSION STATUS</span>
                  <span className="text-foreground font-semibold">SYNCHRONIZED</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
