import React from 'react';
import Image from 'next/image';
import { CustomSection } from '@/types/portfolio';
import { ExternalLink } from 'lucide-react';

interface CustomSectionsProps {
  sections: CustomSection[];
}

export function CustomSections({ sections }: CustomSectionsProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, idx) => (
        <section
          key={section.id || idx}
          className="py-16 sm:py-20 border-t border-border"
          id={`section-${section.id}`}
        >
          <div className="max-w-site mx-auto px-6">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-10">
              {section.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item) => (
                <article
                  key={item.id}
                  className="p-6 rounded-md border border-border bg-surface/30 flex flex-col justify-between"
                >
                  <div>
                    {item.image_url && (
                      <div className="aspect-[16/10] relative rounded-md border border-border overflow-hidden mb-4 bg-surface">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 320px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {item.link && (
                    <div className="pt-4 mt-4 border-t border-border">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs font-medium text-foreground hover:opacity-80 transition-opacity"
                      >
                        <span>Visit link</span>
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
