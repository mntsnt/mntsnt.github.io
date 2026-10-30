'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { motion } from 'framer-motion';
import { Layers, Terminal, Sparkles, Wrench } from 'lucide-react';

interface SkillsProps {
  data: PortfolioData['skills'];
}

export function Skills({ data }: SkillsProps) {
  const icons = [Sparkles, Terminal, Wrench, Layers];

  return (
    <section aria-labelledby="skills-title" className="py-24 md:py-36 border-b border-hairline" id="skills">
      <div className="max-w-7xl mx-auto px-6">
        {/* Specimen Index Header */}
        <div className="flex items-center space-x-3 mb-10 text-xs font-mono">
          <span className="text-accent font-bold">[{data.index_meta}]</span>
          <span className="uppercase tracking-widest text-foreground-muted">{data.label}</span>
          <span className="h-[1px] flex-1 bg-hairline" />
          <span className="text-foreground-muted uppercase">CAPABILITY INVENTORY</span>
        </div>

        <div className="max-w-3xl mb-16">
          <h2 id="skills-title" className="specimen-title text-foreground mb-4">
            {data.title}
          </h2>
          <p className="body-reading text-foreground-muted">
            {data.lede}
          </p>
        </div>

        {/* 4 Grouped Pods in Diagnostic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {data.groups.map((group, idx) => {
            const Icon = icons[idx] || Wrench;
            const skillTokens = group.skills.split('·').map((s) => s.trim());

            return (
              <motion.div
                key={group.id}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                className="p-8 border border-hairline bg-background crosshair-corner flex flex-col justify-between space-y-6 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-foreground-muted mb-6">
                    <span className="text-accent font-bold">POD 0{idx + 1}</span>
                    <Icon className="w-4 h-4 text-foreground-muted" />
                  </div>

                  <h3 className="text-lg font-bold tracking-tight text-foreground mb-4">
                    {group.name}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {skillTokens.map((token, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1.5 text-xs font-mono border border-hairline bg-background-alt text-foreground hover:border-accent hover:text-accent transition-colors cursor-default"
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="p-4 border border-hairline bg-background-alt inline-block">
          <p className="text-xs font-mono text-foreground-muted">
            {data.note}
          </p>
        </div>
      </div>
    </section>
  );
}
