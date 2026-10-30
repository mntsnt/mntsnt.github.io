'use client';

import React, { useState } from 'react';
import { PortfolioData } from '@/types/portfolio';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Code2, Stethoscope, ArrowUpRight } from 'lucide-react';

interface PracticeProps {
  data: PortfolioData['practice'];
}

export function Practice({ data }: PracticeProps) {
  const [activeItem, setActiveItem] = useState<number>(0);

  const icons = [Palette, Code2, Stethoscope];
  const tags = [
    ['Visual Identities', 'Thumbnails', 'Campaigns', 'Print'],
    ['Full-Stack', 'HTML/CSS', 'Python', 'Databases'],
    ['SPHMMC', 'Clinical Communication', 'Health Tech', 'Education'],
  ];

  return (
    <section aria-labelledby="practice-title" className="py-24 md:py-36 border-b border-hairline" id="practice">
      <div className="max-w-7xl mx-auto px-6">
        {/* Specimen Index Header */}
        <div className="flex items-center space-x-3 mb-10 text-xs font-mono">
          <span className="text-accent font-bold">[{data.index_meta}]</span>
          <span className="uppercase tracking-widest text-foreground-muted">{data.label}</span>
          <span className="h-[1px] flex-1 bg-hairline" />
          <span className="text-foreground-muted uppercase">TRIAD PROTOCOL</span>
        </div>

        <div className="max-w-3xl mb-16">
          <h2 id="practice-title" className="specimen-title text-foreground mb-4">
            {data.title}
          </h2>
          <p className="body-reading text-foreground-muted">
            {data.lede}
          </p>
        </div>

        {/* Interactive Expandable Trio Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {data.items.map((item, idx) => {
            const Icon = icons[idx] || Palette;
            const isSelected = activeItem === idx;

            return (
              <motion.article
                key={item.num}
                layout
                onClick={() => setActiveItem(idx)}
                className={`relative p-8 border cursor-pointer transition-all duration-300 flex flex-col justify-between crosshair-corner ${
                  isSelected
                    ? 'border-accent bg-background shadow-md'
                    : 'border-hairline bg-background-alt hover:border-foreground/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-8">
                    <span className={`font-bold ${isSelected ? 'text-accent' : 'text-foreground-muted'}`}>
                      PHASE {item.num}
                    </span>
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-accent' : 'text-foreground-muted'}`} />
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
                    {item.title}
                  </h3>

                  <p className="text-sm md:text-base leading-relaxed text-foreground-muted mb-6">
                    {item.text}
                  </p>
                </div>

                {/* Sub-tags revealed */}
                <div className="pt-6 border-t border-hairline mt-auto">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted mb-3">
                    Focus Dimensions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tags[idx]?.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className={`px-2.5 py-1 text-xs font-mono border ${
                          isSelected
                            ? 'border-accent/40 bg-accent/5 text-accent'
                            : 'border-hairline bg-background text-foreground-muted'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <motion.div
                    layoutId="activePracticeTab"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-accent"
                  />
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
