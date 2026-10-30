'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';

interface SkillsProps {
  data: PortfolioData['skills'];
}

export function Skills({ data }: SkillsProps) {
  return (
    <section aria-labelledby="skills-title" id="skills" className="py-16 sm:py-20 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-2">
          {data.label}
        </p>
        <h2 id="skills-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {data.title}
        </h2>
        {data.lede && (
          <p className="mt-3 text-base text-foreground-muted max-w-[65ch]">
            {data.lede}
          </p>
        )}

        {/* Four grouped plain lists */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.groups.map((group) => {
            const skillItems = group.skills
              .split(/·|,/)
              .map((s) => s.trim())
              .filter(Boolean);

            return (
              <div
                key={group.id}
                className="p-6 rounded-md border border-border bg-surface/30 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight mb-4 pb-2 border-b border-border">
                    {group.name}
                  </h3>

                  <ul className="space-y-2 text-sm text-foreground">
                    {skillItems.map((skill, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted" aria-hidden="true" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        {data.note && (
          <p className="mt-8 text-xs text-foreground-muted">
            {data.note}
          </p>
        )}
      </div>
    </section>
  );
}
