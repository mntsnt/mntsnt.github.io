'use client';

import React, { useState } from 'react';
import { ContactData, SocialLinks } from '@/types/portfolio';
import {
  Mail,
  MapPin,
  Linkedin,
  Send,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

interface ContactProps {
  data: ContactData;
  socials: SocialLinks;
}

export function Contact({ data, socials }: ContactProps) {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _gotcha: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const copyEmail = () => {
    navigator.clipboard.writeText('mintesnoh@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to send message');
      }

      setStatus('success');
      setFormState({ name: '', email: '', subject: '', message: '', _gotcha: '' });
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <section aria-labelledby="contact-title" id="contact" className="py-20 sm:py-24 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        <p className="text-xs uppercase tracking-widest text-foreground-muted font-mono font-medium mb-2">
          07 · Inquiry & Collaboration
        </p>
        <h2 id="contact-title" className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
          Let&apos;s build something together.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-foreground-muted max-w-[62ch]">
          Have a design challenge, a web development project, or a creative collaboration in mind? Feel free to reach out directly.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          {/* Left Column: Direct Reachout Channels (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-lg border border-border bg-surface/30 space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-mono text-foreground-muted font-medium pb-2 border-b border-border/60">
                Direct Channels
              </h3>

              {/* Copy Email Button */}
              <button
                type="button"
                onClick={copyEmail}
                className="w-full text-left p-3 rounded-md border border-border/80 bg-background hover:border-foreground transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <Mail className="w-4 h-4 text-foreground-muted group-hover:text-foreground flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-xs font-mono text-foreground truncate">
                    mintesnoh@gmail.com
                  </span>
                </div>
                {copied ? (
                  <span className="text-[11px] text-emerald-500 font-medium flex items-center space-x-1 flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground flex-shrink-0 opacity-60" />
                )}
              </button>

              {/* Location */}
              <div className="p-3 rounded-md border border-border/80 bg-background flex items-center space-x-3 text-xs text-foreground">
                <MapPin className="w-4 h-4 text-foreground-muted flex-shrink-0" strokeWidth={1.5} />
                <span>Addis Ababa, Ethiopia (UTC+3)</span>
              </div>

              {/* Telegram */}
              {socials.telegram && (
                <a
                  href={socials.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-md border border-border/80 bg-background hover:border-foreground transition-colors flex items-center justify-between text-xs text-foreground group"
                >
                  <div className="flex items-center space-x-3">
                    <Send className="w-4 h-4 text-foreground-muted group-hover:text-foreground flex-shrink-0" strokeWidth={1.5} />
                    <span>Telegram: @bale_helm</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground" />
                </a>
              )}

              {/* LinkedIn */}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-md border border-border/80 bg-background hover:border-foreground transition-colors flex items-center justify-between text-xs text-foreground group"
                >
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-4 h-4 text-foreground-muted group-hover:text-foreground flex-shrink-0" strokeWidth={1.5} />
                    <span>LinkedIn Profile</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-foreground-muted group-hover:text-foreground" />
                </a>
              )}
            </div>

            {/* What I can help with */}
            <div className="p-6 rounded-lg border border-border bg-surface/30">
              <h4 className="text-xs uppercase tracking-wider font-mono text-foreground-muted font-medium mb-3">
                Open For
              </h4>
              <ul className="space-y-2 text-xs text-foreground-muted">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                  <span>Freelance design projects & brand identities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                  <span>High-CTR YouTube thumbnail packages</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                  <span>Frontend web development & UI engineering</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
                  <span>Health communication campaigns & creative outreach</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Clean Form (7 cols) */}
          <div className="md:col-span-7">
            <div className="p-6 sm:p-8 rounded-lg border border-border bg-surface/30 shadow-xs">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Send a message directly
              </h3>

              {status === 'success' ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" strokeWidth={1.5} />
                  <h4 className="text-base font-semibold text-foreground">Message received!</h4>
                  <p className="text-xs text-foreground-muted max-w-sm mx-auto">
                    Thank you for reaching out. I usually reply within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-4 py-2 rounded-md border border-border text-xs font-medium text-foreground hover:border-foreground transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="_gotcha"
                    value={formState._gotcha}
                    onChange={(e) => setFormState({ ...formState, _gotcha: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-foreground-muted mb-1">
                        Your Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground transition-colors min-h-[42px]"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-foreground-muted mb-1">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground transition-colors min-h-[42px]"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-medium text-foreground-muted mb-1">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      required
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground transition-colors min-h-[42px]"
                      placeholder="Project inquiry or consultation"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-foreground-muted mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-md border border-border bg-background text-foreground text-xs focus:outline-none focus:border-foreground transition-colors resize-none"
                      placeholder="Tell me a bit about your project or what you are looking to build..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="p-3 rounded-md border border-red-500/30 bg-red-500/10 text-xs text-red-500 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full min-h-[44px] px-5 py-2.5 rounded-md bg-foreground text-background font-medium text-xs inline-flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
