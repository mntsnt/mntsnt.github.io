'use client';

import React, { useState } from 'react';
import { ContactData, SocialLinks } from '@/types/portfolio';
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2, Mail, MapPin, Linkedin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <section aria-labelledby="contact-title" className="py-24 md:py-36 border-b border-hairline" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        {/* Specimen Index Header */}
        <div className="flex items-center space-x-3 mb-10 text-xs font-mono">
          <span className="text-accent font-bold">[{data.index_meta}]</span>
          <span className="uppercase tracking-widest text-foreground-muted">{data.label}</span>
          <span className="h-[1px] flex-1 bg-hairline" />
          <span className="text-foreground-muted uppercase">CONSULTATION &amp; INQUIRY</span>
        </div>

        <div className="max-w-4xl mb-16">
          <h2 id="contact-title" className="display-hero text-foreground mb-6 whitespace-pre-line tracking-tight">
            {data.title}
          </h2>
          <p className="body-reading text-lg text-foreground-muted">
            {data.intro}
          </p>
        </div>

        {/* 12-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Channels & Looking For List (5 cols) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="border border-hairline p-6 bg-background space-y-6 crosshair-corner">
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold block">
                DIRECT TRANSMISSION
              </span>

              <div className="space-y-4">
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center space-x-3 p-3 border border-hairline bg-background-alt hover:border-accent transition-colors group"
                >
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-mono text-foreground-muted uppercase">Email Address</p>
                    <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                      {data.email}
                    </p>
                  </div>
                </a>

                <div className="flex items-center space-x-3 p-3 border border-hairline bg-background-alt">
                  <MapPin className="w-4 h-4 text-accent shrink-0" />
                  <div>
                    <p className="text-[10px] font-mono text-foreground-muted uppercase">Base Location</p>
                    <p className="text-sm font-semibold text-foreground">{data.location}</p>
                  </div>
                </div>

                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-hairline bg-background-alt hover:border-accent transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-4 h-4 text-accent shrink-0" />
                    <div>
                      <p className="text-[10px] font-mono text-foreground-muted uppercase">Professional Network</p>
                      <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                        {data.linkedin_label}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-foreground-muted group-hover:text-foreground" />
                </a>
              </div>
            </div>

            {/* What I'm Looking For */}
            <div className="p-6 border border-hairline bg-background-alt crosshair-corner">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-foreground mb-4">
                {data.looking_for_title}
              </h3>
              <ul className="space-y-2.5 text-sm text-foreground-muted list-disc list-inside">
                {data.looking_for_items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Consultation Terminal Form (7 cols) */}
          <div className="lg:col-span-7">
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 border border-emerald-500/40 bg-background crosshair-corner space-y-4"
              >
                <div className="flex items-center space-x-3 text-emerald-500">
                  <CheckCircle2 className="w-8 h-8" />
                  <span className="text-xl font-bold text-foreground">Message Dispatched Successfully</span>
                </div>
                <p className="text-sm text-foreground-muted">
                  Thank you! Your inquiry has been secured in the database and forwarded to mintesnoh@gmail.com. I will review and reply promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-3 text-xs font-mono uppercase tracking-wider border border-hairline bg-background-alt hover:bg-background-subtle text-foreground"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-hairline p-8 bg-background crosshair-corner space-y-6">
                {/* Honeypot hidden input for spam protection */}
                <input
                  type="text"
                  name="_gotcha"
                  value={formState._gotcha}
                  onChange={(e) => setFormState({ ...formState, _gotcha: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-3 bg-background-alt border border-hairline focus:border-accent focus:outline-none text-foreground text-sm font-medium transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-4 py-3 bg-background-alt border border-hairline focus:border-accent focus:outline-none text-foreground text-sm font-medium transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-background-alt border border-hairline focus:border-accent focus:outline-none text-foreground text-sm font-medium transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-foreground-muted mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3 bg-background-alt border border-hairline focus:border-accent focus:outline-none text-foreground text-sm font-medium transition-colors resize-y"
                  />
                </div>

                {status === 'error' && (
                  <div className="p-4 border border-rose-500/30 bg-rose-500/10 text-rose-500 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 text-xs font-mono uppercase tracking-widest text-background bg-foreground hover:bg-accent disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{data.cta_button_text}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
