'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { FlaskConical, Atom, Binary, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LabProps {
  data: PortfolioData['lab'];
}

export function Lab({ data }: LabProps) {
  const icons = [Atom, Sparkles, Binary];

  return (
    <section aria-labelledby="lab-title" className="py-24 md:py-36 border-b border-hairline" id="lab">
      <div className="max-w-7xl mx-auto px-6">
        {/* Specimen Index Header */}
        <div className="flex items-center space-x-3 mb-10 text-xs font-mono">
          <span className="text-accent font-bold">[{data.index_meta}]</span>
          <span className="uppercase tracking-widest text-foreground-muted">{data.label}</span>
          <span className="h-[1px] flex-1 bg-hairline" />
          <span className="text-foreground-muted uppercase">BIO-DIGITAL EXPERIMENTS</span>
        </div>

        <div className="max-w-3xl mb-16">
          <h2 id="lab-title" className="specimen-title text-foreground mb-4">
            {data.title}
          </h2>
          <p className="body-reading text-foreground-muted">
            {data.lede}
          </p>
        </div>

        {/* 3 Experimental Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.items.map((item, idx) => {
            const Icon = icons[idx] || FlaskConical;
            return (
              <motion.article
                key={item.id}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="p-8 border border-hairline bg-background-alt hover:bg-background transition-colors flex flex-col justify-between crosshair-corner shadow-sm space-y-8"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-6">
                    <span className="px-2.5 py-1 border border-accent/30 bg-accent/5 text-accent font-bold">
                      {item.kicker}
                    </span>
                    <Icon className="w-5 h-5 text-foreground-muted" />
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm md:text-base leading-relaxed text-foreground-muted border-t border-hairline pt-6">
                  {item.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
