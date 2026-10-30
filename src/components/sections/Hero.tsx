'use client';

import React from 'react';
import { HeroData, SocialLinks } from '@/types/portfolio';
import { Github, Linkedin, Send, Mail, ExternalLink } from 'lucide-react';

interface HeroProps {
  data: HeroData;
  socials: SocialLinks;
}

export function Hero({ data, socials }: HeroProps) {
  return (
    <section aria-labelledby="hero-name" id="top" className="py-20 sm:py-24 md:py-28">
      <div className="max-w-site mx-auto px-6">
        {/* Availability status */}
        <div className="inline-flex items-center space-x-2 text-xs text-foreground-muted mb-8">
          <span className="w-2 h-2 rounded-full bg-foreground" aria-hidden="true" />
          <span>{data.status}</span>
        </div>

        {/* Name & Role */}
        <div className="space-y-3">
          <h1
            id="hero-name"
            className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground"
          >
            Mintesnot Leliso
          </h1>
          <p className="text-base sm:text-lg text-foreground-muted font-normal">
            {data.eyebrow}
          </p>
        </div>

        {/* Tagline / Lead */}
        <p className="mt-6 text-base sm:text-lg text-foreground leading-relaxed max-w-[65ch]">
          {data.lead}
        </p>

        {/* Buttons & Socials */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className="min-h-[44px] px-5 py-2.5 rounded-md bg-foreground text-background font-medium text-sm inline-flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {data.explore_btn_text}
          </a>
          <a
            href="#contact"
            className="min-h-[44px] px-5 py-2.5 rounded-md border border-border text-foreground font-medium text-sm inline-flex items-center justify-center hover:border-foreground transition-colors"
          >
            {data.contact_btn_text}
          </a>
        </div>

        {/* Social Icons (1.5px stroke, >=44px touch targets) */}
        <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-2">
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border text-foreground-muted hover:text-foreground hover:border-foreground transition-colors"
            >
              <Github className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border text-foreground-muted hover:text-foreground hover:border-foreground transition-colors"
            >
              <Linkedin className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
          {socials.upwork && (
            <a
              href={socials.upwork}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Upwork Freelancer Profile"
              className="min-w-[44px] min-h-[44px] px-3 inline-flex items-center space-x-1.5 rounded-md border border-border text-xs font-medium text-foreground-muted hover:text-foreground hover:border-foreground transition-colors"
            >
              <span>Upwork</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
          )}
          {socials.telegram && (
            <a
              href={socials.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram Channel / Contact"
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border text-foreground-muted hover:text-foreground hover:border-foreground transition-colors"
            >
              <Send className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
          {socials.email && (
            <a
              href={`mailto:${socials.email}`}
              aria-label={`Send email to ${socials.email}`}
              className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border text-foreground-muted hover:text-foreground hover:border-foreground transition-colors"
            >
              <Mail className="w-4 h-4" strokeWidth={1.5} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
