import React from 'react';
import Image from 'next/image';
import { CustomSection } from '@/types/portfolio';
import { ArrowUpRight } from 'lucide-react';

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
          className="section-spacing hairline-b"
          id={`section-${section.id}`}
        >
          <div className="max-w-container mx-auto px-6">
            <h2 className="section-title-swiss text-foreground mb-16">
              {section.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.items.map((item) => (
                <article
                  key={item.id}
                  className="p-6 border border-hairline bg-background flex flex-col justify-between"
                >
                  <div>
                    {item.image_url && (
                      <div className="aspect-[16/10] relative bg-background-alt border border-hairline overflow-hidden mb-4">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-foreground-muted leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {item.link && (
                    <div className="pt-6 mt-6 hairline-t">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-foreground hover:text-accent transition-colors"
                      >
                        <span>Explore</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
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
