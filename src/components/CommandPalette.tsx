'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { ProjectItem, CertificateItem } from '@/types/portfolio';
import {
  Search,
  Command,
  Sun,
  Moon,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Download,
  FileText,
  FolderKanban,
  Award,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  projects?: ProjectItem[];
  certificates?: CertificateItem[];
  onSelectFilter?: (category: string) => void;
}

interface CommandItem {
  id: string;
  label: string;
  subtitle?: string;
  badge?: string;
  action: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CommandGroup {
  group: string;
  items: CommandItem[];
}

export function CommandPalette({
  projects = [],
  certificates = [],
  onSelectFilter,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Listen for Cmd+K, Ctrl+K, and custom open-command-palette event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [open]);

  const runCommand = (action: () => void) => {
    action();
    setOpen(false);
    setQuery('');
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('mintesnoh@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openProjectModal = (projectId: string) => {
    window.location.hash = '#work';
    const url = new URL(window.location.href);
    url.searchParams.set('project', projectId);
    window.history.pushState({}, '', url.pathname + url.search + '#work');
    window.dispatchEvent(
      new CustomEvent('open-project-modal', { detail: { id: projectId } })
    );
  };

  const commands: CommandGroup[] = useMemo(() => {
    const list: CommandGroup[] = [];

    // 1. Quick Actions & Navigation
    list.push({
      group: 'Quick Navigation',
      items: [
        { id: 'nav-top', label: 'Top / Hero', action: () => (window.location.hash = '#top') },
        { id: 'nav-about', label: 'About & Story', action: () => (window.location.hash = '#about') },
        { id: 'nav-focus', label: 'Focus & Disciplines (Med × Design × Dev)', action: () => (window.location.hash = '#practice') },
        { id: 'nav-work', label: 'Selected Work & Projects', action: () => (window.location.hash = '#work') },
        { id: 'nav-cert', label: 'Certificates & Credentials', action: () => (window.location.hash = '#certificates') },
        { id: 'nav-skills', label: 'Skills & Toolkit', action: () => (window.location.hash = '#skills') },
        { id: 'nav-edu', label: 'Education & Journey', action: () => (window.location.hash = '#education') },
        { id: 'nav-contact', label: 'Contact & Inquiry', action: () => (window.location.hash = '#contact') },
      ],
    });

    // 2. Projects (searchable)
    if (projects.length > 0) {
      list.push({
        group: 'Projects',
        items: projects.map((p) => ({
          id: `proj-${p.id}`,
          label: p.title,
          subtitle: p.category_label || p.categories?.join(', '),
          badge: p.badge || p.year,
          icon: FolderKanban,
          action: () => openProjectModal(p.id),
        })),
      });
    }

    // 3. Certificates
    if (certificates.length > 0) {
      list.push({
        group: 'Certificates',
        items: certificates.map((c) => ({
          id: `cert-${c.id}`,
          label: c.title,
          subtitle: `${c.issuer} · ${c.year}`,
          badge: c.year,
          icon: Award,
          action: () => {
            window.location.hash = '#certificates';
          },
        })),
      });
    }

    // 4. Filter categories
    list.push({
      group: 'Filter Projects by Category',
      items: [
        {
          id: 'filter-all',
          label: 'Show All Projects',
          action: () => {
            window.location.hash = '#work';
            if (onSelectFilter) onSelectFilter('all');
          },
        },
        {
          id: 'filter-thumbnails',
          label: 'Filter: YouTube Thumbnails',
          action: () => {
            window.location.hash = '#work';
            if (onSelectFilter) onSelectFilter('youtube-thumbnails');
          },
        },
        {
          id: 'filter-posters',
          label: 'Filter: Posters & Flyers',
          action: () => {
            window.location.hash = '#work';
            if (onSelectFilter) onSelectFilter('posters');
          },
        },
        {
          id: 'filter-branding',
          label: 'Filter: Brand Identities & Logos',
          action: () => {
            window.location.hash = '#work';
            if (onSelectFilter) onSelectFilter('branding');
          },
        },
        {
          id: 'filter-booth',
          label: 'Filter: Exhibition & Booth Design',
          action: () => {
            window.location.hash = '#work';
            if (onSelectFilter) onSelectFilter('exhibition-design');
          },
        },
      ],
    });

    // 5. Utility Actions
    list.push({
      group: 'Utilities',
      items: [
        {
          id: 'util-theme',
          label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
          icon: theme === 'light' ? Moon : Sun,
          action: toggleTheme,
        },
        {
          id: 'util-copy',
          label: copied ? 'Email Copied!' : 'Copy Email (mintesnoh@gmail.com)',
          icon: copied ? Check : Copy,
          action: copyEmail,
        },
        {
          id: 'util-cv',
          label: 'Download Curriculum Vitae (PDF)',
          icon: Download,
          action: () => {
            const a = document.createElement('a');
            a.href = '/doc/resume-mntsnt.pdf';
            a.download = 'resume-mntsnt.pdf';
            a.click();
          },
        },
      ],
    });

    return list;
  }, [projects, certificates, onSelectFilter, theme, toggleTheme, copied]);

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();

    return commands
      .map((grp) => ({
        ...grp,
        items: grp.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.subtitle?.toLowerCase().includes(q) ||
            item.badge?.toLowerCase().includes(q)
        ),
      }))
      .filter((grp) => grp.items.length > 0);
  }, [commands, query]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: -8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full max-w-xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-border space-x-3">
              <Search className="w-4 h-4 text-foreground-muted flex-shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                autoFocus
                placeholder="Search projects, sections, certificates, or actions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-foreground placeholder-foreground-muted focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="p-1 text-foreground-muted hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-surface text-foreground-muted">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-border/40">
              {filteredGroups.length === 0 ? (
                <div className="py-12 text-center text-sm text-foreground-muted">
                  No matching results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredGroups.map((grp) => (
                  <div key={grp.group} className="py-2 first:pt-0 last:pb-0">
                    <p className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-foreground-muted">
                      {grp.group}
                    </p>
                    <div className="space-y-0.5">
                      {grp.items.slice(0, 10).map((item) => {
                        const Icon = item.icon || ArrowRight;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => runCommand(item.action)}
                            className="w-full min-h-[40px] px-3 py-2 text-left rounded-md flex items-center justify-between text-xs text-foreground hover:bg-surface transition-colors group"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                              <Icon
                                className="w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-medium truncate block">
                                  {item.label}
                                </span>
                                {item.subtitle && (
                                  <span className="text-[11px] text-foreground-muted truncate block">
                                    {item.subtitle}
                                  </span>
                                )}
                              </div>
                            </div>
                            {item.badge && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-foreground-muted flex-shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Hint */}
            <div className="px-4 py-2 bg-surface/40 border-t border-border flex items-center justify-between text-[11px] text-foreground-muted">
              <span>Navigate with arrow keys or click</span>
              <span className="font-mono">Press ⌘K anytime</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
