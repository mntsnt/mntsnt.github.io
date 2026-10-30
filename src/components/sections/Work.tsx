'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ProjectItem, PortfolioData, SocialLinks } from '@/types/portfolio';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface WorkProps {
  header: PortfolioData['work_header'];
  projects: ProjectItem[];
  socials: SocialLinks;
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'youtube-thumbnails', label: 'YouTube Thumbnails' },
  { key: 'posters', label: 'Posters' },
  { key: 'banners', label: 'Banners' },
  { key: 'branding', label: 'Branding' },
  { key: 'event-design', label: 'Event Design' },
  { key: 'exhibition-design', label: 'Exhibition / Booth Design' },
  { key: 'product-designs', label: 'Product Designs' },
];

export function Work({ header, projects, socials }: WorkProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [activeGalleryImageIdx, setActiveGalleryImageIdx] = useState<number>(0);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => p.visible !== false)
      .filter((p) => {
        if (selectedFilter === 'all') return true;
        const normalized = selectedFilter.toLowerCase().replace(/-/g, '');
        return p.categories.some((c) =>
          c.toLowerCase().replace(/-/g, '').includes(normalized)
        );
      });
  }, [projects, selectedFilter]);

  const activeProject = activeModalIndex !== null ? filteredProjects[activeModalIndex] : null;

  // Active gallery list
  const currentImages = useMemo(() => {
    if (!activeProject) return [];
    if (activeProject.images && activeProject.images.length > 0) {
      return activeProject.images;
    }
    return [activeProject.image_url];
  }, [activeProject]);

  // Deep linking ?project=proj-id
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    if (projectId) {
      const idx = filteredProjects.findIndex((p) => p.id === projectId);
      if (idx !== -1) {
        setActiveModalIndex(idx);
        setActiveGalleryImageIdx(0);
      }
    }
  }, [filteredProjects]);

  const handleNext = useCallback(() => {
    if (activeModalIndex !== null) {
      const nextIdx = (activeModalIndex + 1) % filteredProjects.length;
      setActiveModalIndex(nextIdx);
      setActiveGalleryImageIdx(0);
    }
  }, [activeModalIndex, filteredProjects]);

  const handlePrev = useCallback(() => {
    if (activeModalIndex !== null) {
      const prevIdx = (activeModalIndex - 1 + filteredProjects.length) % filteredProjects.length;
      setActiveModalIndex(prevIdx);
      setActiveGalleryImageIdx(0);
    }
  }, [activeModalIndex, filteredProjects]);

  const closeModal = useCallback(() => {
    setActiveModalIndex(null);
    setActiveGalleryImageIdx(0);
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.replaceState({}, '', url.pathname + url.hash);
  }, []);

  // Keyboard navigation: Esc and arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalIndex, closeModal, handleNext, handlePrev]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (activeModalIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeModalIndex]);

  // Touch swipe support on modal
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) handleNext();
    else if (diff < -50) handlePrev();
    setTouchStart(null);
  };

  return (
    <section aria-labelledby="work-title" id="work" className="py-16 sm:py-20 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        {/* Section Header */}
        <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-2">
          {header.label}
        </p>
        <h2 id="work-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {header.title}
        </h2>
        {header.lede && (
          <p className="mt-3 text-base text-foreground-muted max-w-[65ch]">
            {header.lede}
          </p>
        )}

        {/* Filter Bar (Horizontally scrollable on mobile) */}
        <div className="mt-8 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6 sm:mx-0 sm:px-0">
          {FILTERS.map((f) => {
            const isActive = selectedFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setSelectedFilter(f.key)}
                className={`min-h-[44px] px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors duration-150 border ${
                  isActive
                    ? 'bg-foreground text-background border-foreground font-semibold'
                    : 'border-border text-foreground-muted hover:text-foreground hover:border-foreground/40 bg-surface/30'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid: 1 col phones, 2 cols tablets, 3 cols desktop */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => {
            const isNew = project.badge?.toLowerCase().includes('new');
            const isFirstPlace = project.award?.toLowerCase().includes('1st') || project.badge?.toLowerCase().includes('1st');

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  setActiveModalIndex(idx);
                  setActiveGalleryImageIdx(0);
                }}
                className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-md"
              >
                {/* Single Cover Image */}
                <div className="aspect-[4/3] relative rounded-md border border-border overflow-hidden bg-surface">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                  />

                  {/* Badges: Small, quiet tags */}
                  {(isNew || isFirstPlace) && (
                    <div className="absolute top-2.5 right-2.5 flex items-center space-x-1">
                      {isNew && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-border bg-background text-foreground">
                          NEW
                        </span>
                      )}
                      {isFirstPlace && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-border bg-background text-foreground">
                          1st Place
                        </span>
                      )}
                    </div>
                  )}

                  {/* Multi-image count indicator */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-background/90 text-foreground">
                        {project.images.length} photos
                      </span>
                    </div>
                  )}
                </div>

                {/* Info below image */}
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-foreground-muted">
                    {project.category_label || project.categories.join(' · ')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Upwork section below grid */}
        <div className="mt-16 p-6 rounded-md border border-border bg-surface/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-foreground font-medium">
              {header.upwork_text}
            </p>
          </div>
          <a
            href={socials.upwork}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-4 py-2 rounded-md border border-border text-foreground hover:border-foreground text-xs font-medium inline-flex items-center space-x-1.5 transition-colors whitespace-nowrap"
          >
            <span>{header.upwork_btn_text}</span>
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* Project Lightbox / Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-3xl max-h-[92vh] bg-background border border-border rounded-lg overflow-y-auto p-6 sm:p-8 space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Modal Top Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous project"
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next project"
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                </button>
                <span className="text-xs font-mono text-foreground-muted ml-2">
                  {(activeModalIndex ?? 0) + 1} / {filteredProjects.length}
                </span>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Large Image View */}
            <div className="aspect-[16/10] sm:aspect-[16/9] relative rounded-md border border-border overflow-hidden bg-surface">
              <Image
                src={currentImages[activeGalleryImageIdx] || activeProject.image_url}
                alt={activeProject.title}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-contain"
                priority
              />
            </div>

            {/* Thumbnail Strip (if multi-image project) */}
            {currentImages.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-1 scrollbar-none">
                {currentImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveGalleryImageIdx(i)}
                    className={`relative w-20 h-14 rounded-md border overflow-hidden flex-shrink-0 transition-all ${
                      activeGalleryImageIdx === i
                        ? 'border-foreground ring-1 ring-foreground'
                        : 'border-border opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Title, Category · Role, and Description */}
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3
                  id="modal-project-title"
                  className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight"
                >
                  {activeProject.title}
                </h3>
                {activeProject.year && (
                  <span className="text-xs font-mono text-foreground-muted">
                    {activeProject.year}
                  </span>
                )}
              </div>

              <p className="text-xs font-mono text-foreground-muted">
                {activeProject.category_label || activeProject.categories.join(' · ')}
                {activeProject.role && ` · ${activeProject.role}`}
              </p>

              <p className="text-sm sm:text-base text-foreground leading-relaxed pt-2 max-w-[65ch]">
                {activeProject.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
