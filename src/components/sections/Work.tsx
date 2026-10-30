'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ProjectItem, PortfolioData, SocialLinks } from '@/types/portfolio';
import { SmartCollage } from '@/components/SmartCollage';
import {
  ArrowUpRight,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [shareCopied, setShareCopied] = useState(false);

  // Filter projects (also ensure visible !== false)
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

  // Check URL param on mount for deep linking (?project=proj-id)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    if (projectId) {
      const idx = filteredProjects.findIndex((p) => p.id === projectId);
      if (idx !== -1) {
        setActiveModalIndex(idx);
        document.body.classList.add('modal-open');
      }
    }
  }, [filteredProjects]);

  // Keyboard navigation & Esc handler for Lightbox
  const handleNext = useCallback(() => {
    if (activeModalIndex !== null) {
      const nextIdx = (activeModalIndex + 1) % filteredProjects.length;
      setActiveModalIndex(nextIdx);
      setActiveGalleryImageIdx(0);
      const nextProj = filteredProjects[nextIdx];
      if (nextProj) {
        const url = new URL(window.location.href);
        url.searchParams.set('project', nextProj.id);
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [activeModalIndex, filteredProjects]);

  const handlePrev = useCallback(() => {
    if (activeModalIndex !== null) {
      const prevIdx = (activeModalIndex - 1 + filteredProjects.length) % filteredProjects.length;
      setActiveModalIndex(prevIdx);
      setActiveGalleryImageIdx(0);
      const prevProj = filteredProjects[prevIdx];
      if (prevProj) {
        const url = new URL(window.location.href);
        url.searchParams.set('project', prevProj.id);
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [activeModalIndex, filteredProjects]);

  const closeModal = useCallback(() => {
    setActiveModalIndex(null);
    setActiveGalleryImageIdx(0);
    document.body.classList.remove('modal-open');
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.replaceState({}, '', url.toString());
  }, []);

  const openModal = (index: number) => {
    setActiveModalIndex(index);
    setActiveGalleryImageIdx(0);
    document.body.classList.add('modal-open');
    const proj = filteredProjects[index];
    if (proj) {
      const url = new URL(window.location.href);
      url.searchParams.set('project', proj.id);
      window.history.replaceState({}, '', url.toString());
    }
  };

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

  // Touch swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    setTouchStart(null);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <section aria-labelledby="work-title" className="py-24 md:py-36 border-b border-hairline" id="work">
      <div className="max-w-7xl mx-auto px-6">
        {/* Specimen Index Header */}
        <div className="flex items-center space-x-3 mb-10 text-xs font-mono">
          <span className="text-accent font-bold">[{header.index_meta}]</span>
          <span className="uppercase tracking-widest text-foreground-muted">{header.label}</span>
          <span className="h-[1px] flex-1 bg-hairline" />
          <span className="text-foreground-muted uppercase">ARCHIVE SPECIMENS</span>
        </div>

        <div className="max-w-3xl mb-14">
          <h2 id="work-title" className="specimen-title text-foreground mb-4">
            {header.title}
          </h2>
          <p className="body-reading text-foreground-muted">
            {header.lede}
          </p>
        </div>

        {/* Dynamic Filter Toolbar */}
        <div
          role="toolbar"
          aria-label="Filter projects"
          className="flex flex-wrap items-center gap-x-6 gap-y-3 pb-6 mb-16 border-b border-hairline overflow-x-auto text-xs font-mono uppercase tracking-wider"
        >
          {FILTERS.map((f) => {
            const isActive = selectedFilter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setSelectedFilter(f.key)}
                aria-pressed={isActive}
                className={`py-1.5 relative transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-foreground font-bold'
                    : 'text-foreground-muted hover:text-foreground'
                }`}
              >
                <span>{f.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="workFilterUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Animated Work Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          <AnimatePresence>
            {filteredProjects.map((project, index) => {
              const projectImages = project.images && project.images.length > 0
                ? project.images
                : [project.image_url];

              return (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  key={project.id || index}
                  className="group flex flex-col border border-hairline bg-background p-4 crosshair-corner cursor-pointer hover:border-foreground/30 transition-all shadow-sm"
                  onClick={() => openModal(index)}
                >
                  {/* Smart Collage Frame */}
                  <div className="relative border border-hairline overflow-hidden mb-4 bg-background-alt">
                    <SmartCollage
                      images={projectImages}
                      title={project.title}
                      layout={project.collage_layout || 'auto'}
                    />

                    {/* Quiet Specimen Badges */}
                    <div className="absolute top-3 left-3 flex items-center space-x-2 z-10">
                      {project.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-background/90 text-foreground border border-hairline backdrop-blur-sm">
                          {project.badge}
                        </span>
                      )}
                      {project.award && (
                        <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-foreground text-background">
                          {project.award}
                        </span>
                      )}
                    </div>

                    {projectImages.length > 1 && (
                      <div className="absolute top-3 right-3 px-1.5 py-0.5 text-[10px] font-mono bg-background/90 border border-hairline backdrop-blur-sm text-foreground-muted flex items-center space-x-1 z-10">
                        <Layers className="w-3 h-3" />
                        <span>{projectImages.length}</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-wider text-accent mb-1.5 font-semibold">
                        {project.category_label}
                      </p>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors leading-snug">
                        {project.card_title || project.title}
                      </h3>
                      {project.card_desc && (
                        <p className="text-xs text-foreground-muted line-clamp-2 mt-2 leading-relaxed">
                          {project.card_desc}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-hairline mt-4 flex items-center justify-between text-xs font-mono text-foreground-muted group-hover:text-foreground">
                      <span>OPEN SPECIMEN</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Upwork Verified Banner */}
        <div className="p-8 md:p-12 border border-hairline bg-background-alt crosshair-corner flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="mono-tag text-accent font-bold mb-2 block">FREELANCE CLIENT WORK</span>
            <p className="text-lg md:text-xl font-medium text-foreground">
              {header.upwork_text}
            </p>
          </div>
          <a
            href={socials.upwork}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-7 py-3.5 text-xs font-mono uppercase tracking-wider text-background bg-foreground hover:bg-accent transition-colors shrink-0"
          >
            <span>{header.upwork_btn_text}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Immersive Project Case Viewer Lightbox */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-project-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
            onClick={closeModal}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-background border border-hairline shadow-2xl overflow-hidden crosshair-corner"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-background">
                <div className="flex items-center space-x-3 text-xs font-mono text-foreground-muted">
                  <span className="text-accent font-bold">
                    SPECIMEN {String(activeModalIndex! + 1).padStart(2, '0')} / {String(filteredProjects.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={copyShareLink}
                    title="Copy share link"
                    className="p-1.5 text-foreground-muted hover:text-foreground border border-hairline text-xs font-mono flex items-center space-x-1"
                  >
                    {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{shareCopied ? 'Copied' : 'Share'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    aria-label="Close modal"
                    className="p-1.5 text-foreground-muted hover:text-foreground border border-hairline transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Scrollable Content */}
              <div className="overflow-y-auto p-6 md:p-8 space-y-8">
                {/* Active Image Spotlight */}
                {(() => {
                  const gallery = activeProject.images && activeProject.images.length > 0
                    ? activeProject.images
                    : [activeProject.image_url];
                  const currentImg = gallery[activeGalleryImageIdx] || gallery[0];

                  return (
                    <div className="space-y-4">
                      <div className="relative aspect-[16/10] w-full bg-background-alt border border-hairline overflow-hidden">
                        <Image
                          src={currentImg}
                          alt={activeProject.title}
                          fill
                          sizes="100vw"
                          className="object-contain"
                          priority
                        />
                      </div>

                      {/* Multi-Image Gallery Strip */}
                      {gallery.length > 1 && (
                        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                          {gallery.map((gImg, gIdx) => (
                            <button
                              key={gIdx}
                              type="button"
                              onClick={() => setActiveGalleryImageIdx(gIdx)}
                              className={`relative w-20 h-14 shrink-0 border overflow-hidden ${
                                activeGalleryImageIdx === gIdx
                                  ? 'border-accent ring-2 ring-accent/30'
                                  : 'border-hairline opacity-60 hover:opacity-100'
                              }`}
                            >
                              <Image
                                src={gImg}
                                alt={`thumb ${gIdx + 1}`}
                                fill
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Project Details */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {activeProject.badge && (
                      <span className="px-2 py-0.5 text-xs font-mono uppercase bg-accent text-white">
                        {activeProject.badge}
                      </span>
                    )}
                    {activeProject.award && (
                      <span className="px-2 py-0.5 text-xs font-mono uppercase bg-foreground text-background">
                        {activeProject.award}
                      </span>
                    )}
                  </div>

                  <h3
                    id="modal-project-title"
                    className="text-2xl md:text-3xl font-bold text-foreground"
                  >
                    {activeProject.title}
                  </h3>

                  <p className="text-xs md:text-sm font-mono text-accent uppercase tracking-wider">
                    {activeProject.category_label} <span aria-hidden="true">·</span> {activeProject.role}
                  </p>

                  <p className="text-sm md:text-base leading-relaxed text-foreground-muted border-t border-hairline pt-4">
                    {activeProject.description}
                  </p>
                </div>
              </div>

              {/* Modal Navigation Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-hairline bg-background-alt text-xs font-mono uppercase">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center space-x-2 text-foreground-muted hover:text-foreground"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="hidden sm:inline text-foreground-muted text-[10px]">
                  Use Arrow Keys or Swipe to Navigate
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center space-x-2 text-foreground-muted hover:text-foreground"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
