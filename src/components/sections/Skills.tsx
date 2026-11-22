'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Palette, Code2, Stethoscope, Terminal } from 'lucide-react';

interface SkillsProps {
  data: PortfolioData['skills'];
}

export function Skills({ data }: SkillsProps) {
  const skillCategories = [
    {
      title: 'Visual Design & Media',
      icon: Palette,
      skills: [
        'Adobe Photoshop',
        'Adobe Illustrator',
        'Canva',
        'Figma',
        'Brand Identity',
        'YouTube Thumbnails',
        'Exhibition Booths',
        'Editorial Layouts',
      ],
    },
    {
      title: 'Software & Web Development',
      icon: Code2,
      skills: [
        'React',
        'Next.js',
        'TypeScript',
        'JavaScript',
        'Python',
        'Tailwind CSS',
        'SQL & PostgreSQL',
        'HTML5 & CSS3',
      ],
    },
    {
      title: 'Clinical & Health Domains',
      icon: Stethoscope,
      skills: [
        'Medical Education',
        'Public Health Screening',
        'Health Communication',
        'Digital Outreach',
        'Preventive Health Media',
        'Clinical Volunteering',
      ],
    },
    {
      title: 'Workflow & Tools',
      icon: Terminal,
      skills: [
        'Git & GitHub',
        'VS Code',
        'Vercel',
        'Supabase',
        'REST APIs',
        'Markdown & Documentation',
      ],
    },
  ];

  return (
    <section aria-labelledby="skills-title" id="skills" className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-foreground-muted font-mono font-medium mb-2">
              05 · Capabilities
            </p>
            <h2 id="skills-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Skills & Toolkit
            </h2>
            <p className="mt-2 text-sm sm:text-base text-foreground-muted max-w-[62ch]">
              Core tools and technologies I use to design visual identities, build web tools, and support clinical outreach.
            </p>
          </div>
        </div>

        {/* 4 Categorized Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-lg border border-border bg-surface/30 hover:border-foreground/30 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-border/60">
                    <Icon className="w-4 h-4 text-foreground-muted" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-foreground tracking-tight">
                      {cat.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-xs px-2.5 py-1 rounded-md border border-border bg-background text-foreground hover:border-foreground/40 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note */}
        <div className="mt-8 p-4 rounded-lg border border-border/60 bg-surface/20 flex items-center justify-between text-xs text-foreground-muted">
          <span>Actively learning new tools and engineering patterns with every project.</span>
          <span className="font-mono text-[11px]">Continuous Growth</span>
        </div>
      </div>
    </section>
  );
}
