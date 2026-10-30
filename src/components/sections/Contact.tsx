'use client';

import React, { useState } from 'react';
import { ContactData, SocialLinks } from '@/types/portfolio';
import { Mail, MapPin, Linkedin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ContactProps {
  data: ContactData;
  socials: SocialLinks;
}

export function Contact({ data, socials }: ContactProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _gotcha: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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
    <section aria-labelledby="contact-title" id="contact" className="py-16 sm:py-20 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-2">
          {data.label}
        </p>
        <h2 id="contact-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground whitespace-pre-line">
          {data.title}
        </h2>
        {data.intro && (
          <p className="mt-3 text-base text-foreground-muted max-w-[65ch]">
            {data.intro}
          </p>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          {/* Left Column: Contact details & "What I'm looking for" (5 cols) */}
          <div className="md:col-span-5 space-y-8">
            <div className="space-y-4 text-sm">
              <a
                href={`mailto:${data.email}`}
                className="flex items-center space-x-3 text-foreground hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span>{data.email}</span>
              </a>

              <div className="flex items-center space-x-3 text-foreground">
                <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span>{data.location}</span>
              </div>

              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-foreground hover:opacity-80 transition-opacity"
                >
                  <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center flex-shrink-0">
                    <Linkedin className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <span>{data.linkedin_label}</span>
                </a>
              )}
            </div>

            {/* What I'm looking for */}
            {data.looking_for_items && data.looking_for_items.length > 0 && (
              <div className="pt-6 border-t border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {data.looking_for_title}
                </h3>
                <ul className="space-y-2 text-sm text-foreground-muted">
                  {data.looking_for_items.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground-muted mt-2 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Clean Form (7 cols) */}
          <div className="md:col-span-7">
            <div className="p-6 sm:p-8 rounded-md border border-border bg-surface/30">
              {status === 'success' ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-foreground" strokeWidth={1.5} />
                  <h3 className="text-lg font-semibold text-foreground">Message delivered</h3>
                  <p className="text-sm text-foreground-muted max-w-sm mx-auto">
                    Thank you. Your message has been sent directly to Mintesnot and recorded.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-4 py-2 rounded-md border border-border text-xs font-medium hover:border-foreground transition-colors"
                  >
                    Send another note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot anti-spam field */}
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
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors min-h-[44px]"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-foreground-muted mb-1">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors min-h-[44px]"
                        placeholder="name@example.com"
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
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors min-h-[44px]"
                      placeholder="Project inquiry or collaboration"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-foreground-muted mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
                      placeholder="Tell me about what you are planning..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="p-3 rounded-md border border-border text-xs text-foreground flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full min-h-[44px] px-5 py-2.5 rounded-md bg-foreground text-background font-medium text-sm inline-flex items-center justify-center hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>{data.cta_button_text}</span>
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
