'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ProjectItem, PortfolioData, SocialLinks } from '@/types/portfolio';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  Award,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface WorkProps {
  header: PortfolioData['work_header'];
  projects: ProjectItem[];
  socials: SocialLinks;
}

const CATEGORY_MAP: { [key: string]: string } = {
  all: 'All',
  'youtube-thumbnails': 'Thumbnails',
  posters: 'Posters',
  branding: 'Branding',
  'event-design': 'Events',
  'exhibition-design': 'Exhibition / Booths',
  banners: 'Banners',
};

export function Work({ header, projects, socials }: WorkProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [activeGalleryImageIdx, setActiveGalleryImageIdx] = useState<number>(0);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: 0 };
    projects
      .filter((p) => p.visible !== false)
      .forEach((p) => {
        counts.all++;
        p.categories?.forEach((c) => {
          const norm = c.toLowerCase().trim();
          counts[norm] = (counts[norm] || 0) + 1;
        });
      });
    return counts;
  }, [projects]);

  // Filter projects by category and search query
  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return projects
      .filter((p) => p.visible !== false)
      .filter((p) => {
        // Category check
        if (selectedFilter !== 'all') {
          const normalized = selectedFilter.toLowerCase().replace(/-/g, '');
          const matchesCat = p.categories.some((c) =>
            c.toLowerCase().replace(/-/g, '').includes(normalized)
          );
          if (!matchesCat) return false;
        }

        // Search query check
        if (q) {
          const inTitle = p.title.toLowerCase().includes(q);
          const inDesc = p.card_desc?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
          const inCat = p.categories.some((c) => c.toLowerCase().includes(q));
          const inBadge = p.badge?.toLowerCase().includes(q) || p.award?.toLowerCase().includes(q);
          if (!inTitle && !inDesc && !inCat && !inBadge) return false;
        }

        return true;
      });
  }, [projects, selectedFilter, searchQuery]);

  const activeProject = activeModalIndex !== null ? filteredProjects[activeModalIndex] : null;

  // Active gallery list
  const currentImages = useMemo(() => {
    if (!activeProject) return [];
    if (activeProject.images && activeProject.images.length > 0) {
      return activeProject.images;
    }
    return [activeProject.image_url];
  }, [activeProject]);

  // Deep linking and custom event listener for CommandPalette
  useEffect(() => {
    const handleOpenProject = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id) {
        const idx = filteredProjects.findIndex((p) => p.id === customEvent.detail.id);
        if (idx !== -1) {
          setActiveModalIndex(idx);
          setActiveGalleryImageIdx(0);
        }
      }
    };

    window.addEventListener('open-project-modal', handleOpenProject);
    return () => window.removeEventListener('open-project-modal', handleOpenProject);
  }, [filteredProjects]);

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

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeProject) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProject, closeModal, handleNext, handlePrev]);

  // Lock background scroll
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

  return (
    <section aria-labelledby="work-title" id="work" className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-foreground-muted font-mono font-medium mb-2">
              04 · Portfolio Showcase
            </p>
            <h2 id="work-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Selected Work
            </h2>
            <p className="mt-2 text-sm sm:text-base text-foreground-muted max-w-[62ch]">
              Curated visual identities, event booths, YouTube thumbnails, and editorial designs shipped for healthcare, education, and creators.
            </p>
          </div>

          {socials.upwork && (
            <a
              href={socials.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-foreground-muted hover:text-foreground inline-flex items-center space-x-1.5 self-start sm:self-end"
            >
              <span>Available on Upwork</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Search Bar & Filter Controls */}
        <div className="space-y-4 mb-8">
          {/* Live Search Input */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search by keyword, client, or topic (e.g. Dawit, SPHMMC, thumbnail)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-md border border-border bg-surface/40 focus:bg-surface focus:outline-none focus:border-foreground text-xs text-foreground placeholder-foreground-muted transition-colors min-h-[38px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-foreground-muted hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6 sm:mx-0 sm:px-0">
            {Object.entries(CATEGORY_MAP).map(([key, label]) => {
              const isActive = selectedFilter === key;
              const count = categoryCounts[key] || 0;
              if (key !== 'all' && count === 0) return null;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedFilter(key)}
                  className={`min-h-[36px] px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors duration-150 border flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-foreground text-background border-foreground font-semibold shadow-2xs'
                      : 'border-border text-foreground-muted hover:text-foreground hover:border-foreground/40 bg-surface/30'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-background/20 text-background' : 'bg-surface text-foreground-muted'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid: 1 col phones, 2 cols tablets, 3 cols desktop */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-border rounded-lg bg-surface/20">
            <p className="text-sm text-foreground-muted">No projects found matching your search.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-medium text-foreground underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => {
              const isNew = project.badge?.toLowerCase().includes('new');
              const isFirstPlace =
                project.award?.toLowerCase().includes('1st') ||
                project.badge?.toLowerCase().includes('1st');

              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    setActiveModalIndex(idx);
                    setActiveGalleryImageIdx(0);
                  }}
                  className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-lg transition-transform duration-150"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] relative rounded-lg border border-border overflow-hidden bg-surface">
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />

                    {/* Format Badges */}
                    <div className="absolute top-2.5 right-2.5 flex items-center space-x-1">
                      {isFirstPlace && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-500 backdrop-blur-xs flex items-center space-x-1">
                          <Award className="w-3 h-3" />
                          <span>1st Place</span>
                        </span>
                      )}
                      {isNew && !isFirstPlace && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-border bg-background/90 text-foreground backdrop-blur-xs">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Multi-photo indicator */}
                    {project.images && project.images.length > 1 && (
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-background/90 text-foreground backdrop-blur-xs flex items-center space-x-1">
                          <Layers className="w-3 h-3" />
                          <span>{project.images.length} photos</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Metadata below image */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground line-clamp-1">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                    <p className="mt-0.5 text-xs text-foreground-muted line-clamp-1">
                      {project.card_desc || project.category_label || project.categories.join(' · ')}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox / Project Viewer Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-4xl max-h-[92vh] bg-background border border-border rounded-xl overflow-y-auto p-5 sm:p-7 space-y-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-foreground-muted">
                  {activeProject.category_label || activeProject.categories.join(' · ')}
                </span>
                <h3
                  id="modal-project-title"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5"
                >
                  {activeProject.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous project (Left arrow)"
                  className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next project (Right arrow)"
                  className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close modal (Escape)"
                  className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Image Display */}
            <div className="aspect-[16/10] relative rounded-lg border border-border overflow-hidden bg-surface">
              <Image
                src={currentImages[activeGalleryImageIdx] || activeProject.image_url}
                alt={`${activeProject.title} preview`}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-contain"
                priority
              />
            </div>

            {/* Thumbnail Strip (if multi-image) */}
            {currentImages.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveGalleryImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-md overflow-hidden border flex-shrink-0 transition-opacity ${
                      activeGalleryImageIdx === idx
                        ? 'border-foreground ring-1 ring-foreground opacity-100'
                        : 'border-border opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`thumb ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Project Details & Client Description */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-start justify-between gap-6">
              <div className="max-w-[65ch] space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-foreground-muted">
                  Project Background
                </h4>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {activeProject.description || activeProject.card_desc || 'No description provided.'}
                </p>
                {activeProject.award && (
                  <div className="pt-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 inline-flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>{activeProject.award}</span>
                    </span>
                  </div>
                )}
              </div>

              {activeProject.external_url && (
                <a
                  href={activeProject.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[40px] px-4 py-2 rounded-md bg-foreground text-background text-xs font-medium inline-flex items-center space-x-1.5 hover:opacity-90 transition-opacity self-start"
                >
                  <span>View Project</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
