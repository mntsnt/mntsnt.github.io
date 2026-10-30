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
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-hairline hover:bg-background-alt text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" aria-hidden="true" />
      ) : (
        <Sun className="w-4 h-4" aria-hidden="true" />
      )}
    </button>
  );
}
