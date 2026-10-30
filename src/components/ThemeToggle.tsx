'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color mode"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground ${className}`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Sun className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}
