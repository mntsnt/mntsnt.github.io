'use client';

import React from 'react';
import { PortfolioData } from '@/types/portfolio';
import { Download, GraduationCap, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface EducationProps {
  data: PortfolioData['education'];
}

export function Education({ data }: EducationProps) {
  return (
    <section aria-labelledby="edu-title" className="py-24 md:py-36 border-b border-hairline" id="education">
      <div className="max-w-7xl mx-auto px-6">
        {/* Specimen Index Header */}
        <div className="flex items-center space-x-3 mb-10 text-xs font-mono">
          <span className="text-accent font-bold">[{data.index_meta}]</span>
          <span className="uppercase tracking-widest text-foreground-muted">{data.label}</span>
          <span className="h-[1px] flex-1 bg-hairline" />
          <span className="text-foreground-muted uppercase">ACADEMIC TRAJECTORY</span>
        </div>

        <h2 id="edu-title" className="specimen-title text-foreground mb-16">
          {data.title}
        </h2>

        {/* Clinical Chronology Timeline */}
        <div className="relative border-l border-hairline ml-3 md:ml-6 pl-8 md:pl-12 space-y-14 mb-24">
          {data.items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Timeline Indicator Pin */}
              <div
                className={`absolute -left-[41px] md:-left-[57px] top-1.5 w-4 h-4 rounded-full border-2 ${
                  item.status === 'In progress'
                    ? 'border-accent bg-background ring-4 ring-accent/20'
                    : 'border-foreground-muted bg-foreground'
                }`}
              />

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono mb-2">
                <span
                  className={`px-2.5 py-0.5 border ${
                    item.status === 'In progress'
                      ? 'border-accent bg-accent/10 text-accent font-bold flex items-center space-x-1.5'
                      : 'border-hairline text-foreground-muted'
                  }`}
                >
                  {item.status === 'In progress' ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                      <span>{item.status}</span>
                    </>
                  ) : (
                    <span>{item.status}</span>
                  )}
                </span>
                {item.dates && <span className="text-foreground-muted">{item.dates}</span>}
              </div>

              <div className="p-6 md:p-8 border border-hairline bg-background crosshair-corner mt-3">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-1.5">
                  {item.degree}
                </h3>

                {item.institution && (
                  <p className="text-xs font-mono uppercase tracking-wider text-accent font-semibold mb-4">
                    {item.institution}
                  </p>
                )}

                {item.description && (
                  <p className="body-reading text-sm md:text-base text-foreground-muted leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.list_items && (
                  <ul className="mt-4 space-y-2 text-sm text-foreground-muted font-mono list-disc list-inside">
                    {item.list_items.map((li, lIdx) => (
                      <li key={lIdx}>{li}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Download Curriculum Vitae Dossier */}
        <div className="p-8 md:p-12 border border-hairline bg-background-alt crosshair-corner flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div>
            <span className="mono-tag text-accent font-bold mb-2 block">OFFICIAL DOSSIER</span>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {data.cv.title}
            </h3>
            <p className="text-sm md:text-base text-foreground-muted">
              {data.cv.description}
            </p>
          </div>

          <a
            href={data.cv.file_url}
            download
            className="inline-flex items-center space-x-2.5 px-8 py-4 text-xs font-mono uppercase tracking-widest text-background bg-foreground hover:bg-accent transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{data.cv.button_text}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
