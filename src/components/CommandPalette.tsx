'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
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
  FileCode,
  Sparkles,
} from 'lucide-react';

interface CommandPaletteProps {
  onSelectFilter?: (category: string) => void;
}

interface CommandItem {
  label: string;
  action: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface CommandGroup {
  group: string;
  items: CommandItem[];
}

export function CommandPalette({ onSelectFilter }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Listen for Cmd+K or Ctrl+K
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const commands: CommandGroup[] = [
    // Sections
    {
      group: 'Navigation',
      items: [
        { label: '01 Identity — Top', action: () => (window.location.hash = '#top') },
        { label: '02 About — Story & Quote', action: () => (window.location.hash = '#about') },
        { label: '03 Practice — What I do', action: () => (window.location.hash = '#practice') },
        { label: '04 Currently — Live Snapshot', action: () => (window.location.hash = '#now') },
        { label: '05 Selected Work — Portfolio', action: () => (window.location.hash = '#work') },
        { label: '06 Certificates — Credentials', action: () => (window.location.hash = '#certificates') },
        { label: '07 Lab — Experiments', action: () => (window.location.hash = '#lab') },
        { label: '08 Education — Background & CV', action: () => (window.location.hash = '#education') },
        { label: '09 Skills — Toolkit', action: () => (window.location.hash = '#skills') },
        { label: '10 Contact — Send Inquiry', action: () => (window.location.hash = '#contact') },
      ],
    },
    // Filter Works
    {
      group: 'Filter Portfolio',
      items: [
        {
          label: 'Show All Projects',
          action: () => {
            window.location.hash = '#work';
            if (onSelectFilter) onSelectFilter('all');
          },
        },
        {
          label: 'Filter: YouTube Thumbnails',
          action: () => {
            window.location.hash = '#work';
            if (onSelectFilter) onSelectFilter('youtube-thumbnails');
          },
        },
        {
          label: 'Filter: Posters',
          action: () => {
            window.location.hash = '#work';
            if (onSelectFilter) onSelectFilter('posters');
          },
        },
        {
          label: 'Filter: Banners',
          action: () => {
            window.location.hash = '#work';
            if (onSelectFilter) onSelectFilter('banners');
          },
        },
        {
          label: 'Filter: Branding',
          action: () => {
            window.location.hash = '#work';
            if (onSelectFilter) onSelectFilter('branding');
          },
        },
        {
          label: 'Filter: Event Design',
          action: () => {
            window.location.hash = '#work';
            if (onSelectFilter) onSelectFilter('event-design');
          },
        },
      ],
    },
    // Actions
    {
      group: 'Actions & Utilities',
      items: [
        {
          label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
          icon: theme === 'light' ? Moon : Sun,
          action: toggleTheme,
        },
        {
          label: copied ? 'Email Copied!' : 'Copy Email Address (mintesnoh@gmail.com)',
          icon: copied ? Check : Copy,
          action: copyEmail,
        },
        {
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
    },
  ];

  const filteredGroups = commands
    .map((grp) => ({
      ...grp,
      items: grp.items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      ),
    }))
    .filter((grp) => grp.items.length > 0);

  return (
    <>
      {/* Global Shortcut Button Indicator (can also trigger on click) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="hidden lg:inline-flex items-center space-x-2 px-2.5 py-1 text-[11px] font-mono border border-hairline bg-background hover:bg-background-alt text-foreground-muted hover:text-foreground transition-colors"
      >
        <Command className="w-3 h-3" />
        <span>Cmd+K</span>
      </button>

      {/* Palette Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-xl bg-background border border-hairline shadow-2xl overflow-hidden crosshair-corner"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input bar */}
              <div className="flex items-center px-4 py-3 border-b border-hairline">
                <Search className="w-4 h-4 text-foreground-muted mr-3 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Type a command or jump to section..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none placeholder:text-foreground-muted"
                />
                <span className="text-[10px] font-mono uppercase tracking-widest text-foreground-muted border border-hairline px-1.5 py-0.5 ml-2">
                  ESC
                </span>
              </div>

              {/* Command results list */}
              <div className="max-h-96 overflow-y-auto p-2 divide-y divide-hairline">
                {filteredGroups.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono text-foreground-muted">
                    No matching commands found.
                  </div>
                ) : (
                  filteredGroups.map((grp) => (
                    <div key={grp.group} className="py-2 first:pt-0 last:pb-0">
                      <p className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-foreground-muted">
                        {grp.group}
                      </p>
                      <div className="space-y-0.5 mt-1">
                        {grp.items.map((item, idx) => {
                          const Icon = item.icon || ArrowRight;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => runCommand(item.action)}
                              className="w-full flex items-center justify-between px-3 py-2 text-xs text-foreground hover:bg-background-alt text-left transition-colors group"
                            >
                              <span className="font-medium group-hover:text-accent transition-colors">
                                {item.label}
                              </span>
                              <Icon className="w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground transition-colors shrink-0 ml-2" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-hairline bg-background-alt flex items-center justify-between text-[10px] font-mono text-foreground-muted">
                <span>Navigation &amp; Actions</span>
                <span>Press ↵ to select</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
