'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6">
      <div className="flex justify-between items-center max-w-site w-full mx-auto">
        <a
          href="/"
          className="text-xs font-medium text-foreground-muted hover:text-foreground transition-colors"
        >
          ← Return to site
        </a>
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full mx-auto my-auto py-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-2">
            Mintesnot Portfolio
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Admin Sign In
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Manage projects, certificates, toolkit, and incoming messages.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 border border-border rounded-md bg-surface text-foreground text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground-muted">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mintesnoh@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border focus:border-foreground focus:outline-none text-foreground rounded-md transition-colors min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground-muted mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-foreground-muted">
                <Lock className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border focus:border-foreground focus:outline-none text-foreground rounded-md transition-colors min-h-[44px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[44px] py-2.5 px-4 text-sm font-medium text-background bg-foreground hover:opacity-90 disabled:opacity-50 transition-opacity rounded-md flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center text-xs text-foreground-muted">
        Private dashboard. Protected by secure session cookies.
      </div>
    </div>
  );
}
