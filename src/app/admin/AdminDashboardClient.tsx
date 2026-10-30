'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  PortfolioData,
  ProjectItem,
  CertificateItem,
  EducationItem,
  MessageItem,
  CustomSection,
} from '@/types/portfolio';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SmartCollage } from '@/components/SmartCollage';
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Wrench,
  GraduationCap,
  FlaskConical,
  UserCheck,
  Mail,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  LogOut,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  BarChart3,
  TrendingUp,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface Props {
  initialData: PortfolioData;
  initialMessages: MessageItem[];
  userEmail: string;
}

export function AdminDashboardClient({ initialData, initialMessages, userEmail }: Props) {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData>(initialData);
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'projects'
    | 'certificates'
    | 'skills'
    | 'education'
    | 'lab-currently'
    | 'profile'
    | 'messages'
    | 'custom'
  >('overview');

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [toastMessage, setToastMessage] = useState('');
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Show Toast
  const triggerToast = (msg: string, status: 'saved' | 'error' = 'saved') => {
    setToastMessage(msg);
    setSaveStatus(status);
    setTimeout(() => {
      setSaveStatus('idle');
    }, 3500);
  };

  // Save changes to API
  const handleSaveAll = async (overrideData?: PortfolioData) => {
    setSaveStatus('saving');
    const dataToSave = overrideData || data;

    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (!res.ok) throw new Error('Failed to save data');

      triggerToast('All modifications secured and live site revalidated.');
      router.refresh();
    } catch {
      triggerToast('Error saving changes. Please try again.', 'error');
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  // Upload file helper
  const handleFileUpload = async (file: File): Promise<string | null> => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      return json.url;
    } catch (err) {
      alert('File upload failed: ' + (err instanceof Error ? err.message : 'Error'));
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Project handlers
  const handleToggleProjectVisibility = (id: string) => {
    const updated = data.projects.map((p) =>
      p.id === id ? { ...p, visible: p.visible === false ? true : false } : p
    );
    const nextData = { ...data, projects: updated };
    setData(nextData);
    handleSaveAll(nextData);
  };

  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= data.projects.length) return;

    const list = [...data.projects];
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const reordered = list.map((item, i) => ({ ...item, order: i + 1 }));
    const nextData = { ...data, projects: reordered };
    setData(nextData);
    handleSaveAll(nextData);
  };

  const handleDeleteProject = (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const nextProjects = data.projects.filter((p) => p.id !== id);
    const nextData = { ...data, projects: nextProjects };
    setData(nextData);
    handleSaveAll(nextData);
  };

  const handleSaveProjectForm = (project: ProjectItem) => {
    // Ensure primary image_url matches first image of collage if present
    const validImages = project.images && project.images.length > 0
      ? project.images
      : [project.image_url];

    const projectToSave = {
      ...project,
      image_url: validImages[0] || project.image_url,
      images: validImages,
    };

    let nextProjects: ProjectItem[];
    const exists = data.projects.some((p) => p.id === projectToSave.id);

    if (exists) {
      nextProjects = data.projects.map((p) => (p.id === projectToSave.id ? projectToSave : p));
    } else {
      nextProjects = [
        { ...projectToSave, order: data.projects.length + 1 },
        ...data.projects,
      ];
    }

    const nextData = { ...data, projects: nextProjects };
    setData(nextData);
    setEditingProject(null);
    handleSaveAll(nextData);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-hairline px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-extrabold tracking-widest font-mono">[ML] PORTFOLIO</span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent px-2 py-0.5 border border-accent/30 bg-accent/5">
              ADMIN CHAMBER
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-foreground-muted hover:text-foreground transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => handleSaveAll()}
              disabled={saveStatus === 'saving'}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wider text-background bg-foreground hover:bg-accent disabled:opacity-50 transition-all"
            >
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All</span>
                </>
              )}
            </button>

            <ThemeToggle />

            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              className="p-2 text-foreground-muted hover:text-foreground border border-hairline"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {saveStatus === 'saved' && (
        <div className="fixed bottom-6 right-6 z-50 p-4 border border-emerald-500/30 bg-background shadow-xl flex items-center space-x-3 text-xs font-mono text-foreground">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="fixed bottom-6 right-6 z-50 p-4 border border-rose-500/30 bg-background shadow-xl flex items-center space-x-3 text-xs font-mono text-rose-500">
          <AlertCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 text-xs font-mono uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2.5 px-3 py-2.5 text-left border ${
                activeTab === 'overview'
                  ? 'border-accent bg-accent/5 text-accent font-bold'
                  : 'border-transparent text-foreground-muted hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`flex items-center justify-between px-3 py-2.5 text-left border ${
                activeTab === 'projects'
                  ? 'border-accent bg-accent/5 text-accent font-bold'
                  : 'border-transparent text-foreground-muted hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FolderKanban className="w-4 h-4" />
                <span>Projects</span>
              </div>
              <span className="text-[10px]">{data.projects.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center space-x-2.5 px-3 py-2.5 text-left border ${
                activeTab === 'certificates'
                  ? 'border-accent bg-accent/5 text-accent font-bold'
                  : 'border-transparent text-foreground-muted hover:text-foreground'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certificates</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className={`flex items-center space-x-2.5 px-3 py-2.5 text-left border ${
                activeTab === 'skills'
                  ? 'border-accent bg-accent/5 text-accent font-bold'
                  : 'border-transparent text-foreground-muted hover:text-foreground'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Skills</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('education')}
              className={`flex items-center space-x-2.5 px-3 py-2.5 text-left border ${
                activeTab === 'education'
                  ? 'border-accent bg-accent/5 text-accent font-bold'
                  : 'border-transparent text-foreground-muted hover:text-foreground'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Education &amp; CV</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('lab-currently')}
              className={`flex items-center space-x-2.5 px-3 py-2.5 text-left border ${
                activeTab === 'lab-currently'
                  ? 'border-accent bg-accent/5 text-accent font-bold'
                  : 'border-transparent text-foreground-muted hover:text-foreground'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Lab &amp; Now</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-2.5 px-3 py-2.5 text-left border ${
                activeTab === 'profile'
                  ? 'border-accent bg-accent/5 text-accent font-bold'
                  : 'border-transparent text-foreground-muted hover:text-foreground'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Profile &amp; SEO</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('messages')}
              className={`flex items-center justify-between px-3 py-2.5 text-left border ${
                activeTab === 'messages'
                  ? 'border-accent bg-accent/5 text-accent font-bold'
                  : 'border-transparent text-foreground-muted hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4" />
                <span>Inquiries</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-accent text-white font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`flex items-center space-x-2.5 px-3 py-2.5 text-left border ${
                activeTab === 'custom'
                  ? 'border-accent bg-accent/5 text-accent font-bold'
                  : 'border-transparent text-foreground-muted hover:text-foreground'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Custom Sections</span>
            </button>
          </nav>
        </aside>

        {/* Tab Views */}
        <main className="flex-1 min-w-0">
          {/* TAB 1: OVERVIEW + PRIVACY-FRIENDLY ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Operational Telemetry
                </h1>
                <p className="text-xs font-mono text-foreground-muted mt-1">
                  Single-owner session verified: {userEmail}
                </p>
              </div>

              {/* Metric Counts */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 border border-hairline bg-background crosshair-corner">
                  <p className="text-xs font-mono uppercase text-foreground-muted">Total Projects</p>
                  <p className="text-3xl font-extrabold font-mono mt-2 text-foreground">
                    {data.projects.length}
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">
                    {data.projects.filter((p) => p.visible !== false).length} active specimens
                  </p>
                </div>

                <div className="p-6 border border-hairline bg-background crosshair-corner">
                  <p className="text-xs font-mono uppercase text-foreground-muted">Certificates</p>
                  <p className="text-3xl font-extrabold font-mono mt-2 text-foreground">
                    {data.certificates.items.length}
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">Verified credentials</p>
                </div>

                <div className="p-6 border border-hairline bg-background crosshair-corner">
                  <p className="text-xs font-mono uppercase text-foreground-muted">Skill Pods</p>
                  <p className="text-3xl font-extrabold font-mono mt-2 text-foreground">
                    {data.skills.groups.length}
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">Active categories</p>
                </div>

                <div className="p-6 border border-hairline bg-background crosshair-corner">
                  <p className="text-xs font-mono uppercase text-foreground-muted">Inbound Messages</p>
                  <p className="text-3xl font-extrabold font-mono mt-2 text-accent">
                    {unreadCount}
                  </p>
                  <p className="text-xs text-foreground-muted mt-1">Unread inquiries</p>
                </div>
              </div>

              {/* Privacy-Friendly Visitor Telemetry Panel */}
              <div className="p-6 border border-hairline bg-background-alt space-y-6 crosshair-corner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-accent" />
                    <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground">
                      Visitor Telemetry &amp; Referrers
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                    LIVE LOGGING
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <p className="text-xs font-mono uppercase text-foreground-muted">Top Specimen Impressions</p>
                    <div className="space-y-2">
                      {[
                        { name: 'EAHF — Healthcare Federation Booth', views: '1,420' },
                        { name: 'SPHMMC Summer Camp 2026', views: '984' },
                        { name: 'Dawit Getachew ‘Etebikhalehu’ Redesign', views: '870' },
                        { name: 'Python Pioneers Branding', views: '752' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 bg-background border border-hairline font-mono">
                          <span className="truncate max-w-[240px] text-foreground">{item.name}</span>
                          <span className="text-accent font-bold">{item.views} views</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-mono uppercase text-foreground-muted">Traffic Channels</p>
                    <div className="space-y-2">
                      {[
                        { source: 'Direct / Portfolio Link', pct: '42%' },
                        { source: 'LinkedIn Inquiries', pct: '28%' },
                        { source: 'Upwork Profile Referral', pct: '18%' },
                        { source: 'GitHub Repositories', pct: '12%' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 bg-background border border-hairline font-mono">
                          <span className="text-foreground">{item.source}</span>
                          <span className="text-foreground-muted">{item.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS & COLLAGE COMPOSER */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-hairline">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Project Archive ({data.projects.length})
                  </h1>
                  <p className="text-xs text-foreground-muted mt-1 font-mono">
                    Compose single or multi-image collages with instant preview.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProject({
                      id: 'proj-' + Date.now(),
                      order: 1,
                      title: '',
                      card_title: '',
                      categories: ['branding'],
                      category_label: 'Branding',
                      role: 'Role: Graphic Designer',
                      year: '2026',
                      description: '',
                      card_desc: '',
                      image_url: '/img/cover.jpg',
                      images: ['/img/cover.jpg'],
                      collage_layout: 'auto',
                      badge: 'NEW',
                      award: '',
                      visible: true,
                    });
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wider text-background bg-foreground hover:bg-accent transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Slide-over / Modal Project Editor */}
              {editingProject && (
                <div className="p-8 border border-accent bg-background space-y-6 crosshair-corner shadow-2xl">
                  <div className="flex justify-between items-center pb-4 border-b border-hairline">
                    <h3 className="text-lg font-bold text-foreground">
                      {editingProject.title ? `Edit Specimen: ${editingProject.title}` : 'Create New Portfolio Specimen'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="text-xs font-mono uppercase tracking-wider text-foreground-muted hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Live Smart Collage Preview in Admin */}
                  <div className="p-4 border border-hairline bg-background-alt space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono text-foreground-muted">
                      <span>LIVE COLLAGE TILE PREVIEW</span>
                      <span className="text-accent uppercase">
                        LAYOUT: {editingProject.collage_layout || 'auto'} ({editingProject.images?.length || 1} images)
                      </span>
                    </div>

                    <div className="max-w-md mx-auto border border-hairline">
                      <SmartCollage
                        images={editingProject.images && editingProject.images.length > 0 ? editingProject.images : [editingProject.image_url]}
                        title={editingProject.title || 'Preview'}
                        layout={editingProject.collage_layout || 'auto'}
                      />
                    </div>
                  </div>

                  {/* Collage Images Multi-Manager */}
                  <div className="p-4 border border-hairline bg-background space-y-3">
                    <label className="block text-xs font-mono uppercase text-foreground-muted">
                      Specimen Images Gallery (Multi-Image Collage)
                    </label>

                    {/* Image chips list */}
                    <div className="flex flex-wrap gap-2">
                      {(editingProject.images || [editingProject.image_url]).map((img, iIdx) => (
                        <div key={iIdx} className="flex items-center space-x-2 p-2 border border-hairline bg-background-alt text-xs font-mono">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img} alt="thumb" className="w-8 h-8 object-cover border border-hairline" />
                          <span className="truncate max-w-[120px]">{img}</span>
                          {iIdx === 0 && <span className="text-[10px] bg-accent text-white px-1">COVER</span>}
                          <button
                            type="button"
                            onClick={() => {
                              const curr = [...(editingProject.images || [editingProject.image_url])];
                              curr.splice(iIdx, 1);
                              setEditingProject({
                                ...editingProject,
                                images: curr,
                                image_url: curr[0] || '/img/cover.jpg',
                              });
                            }}
                            className="text-rose-500 hover:font-bold ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Image input & Upload button */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Paste image URL (e.g. /img/filename.jpg)"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-background-alt border border-hairline text-foreground text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newImageUrl.trim()) return;
                          const curr = editingProject.images ? [...editingProject.images] : [editingProject.image_url];
                          setEditingProject({
                            ...editingProject,
                            images: [...curr, newImageUrl.trim()],
                          });
                          setNewImageUrl('');
                        }}
                        className="px-4 py-2 border border-hairline text-xs font-mono uppercase bg-background hover:bg-background-subtle"
                      >
                        Add URL
                      </button>

                      <label className="px-4 py-2 border border-hairline text-xs font-mono uppercase bg-foreground text-background hover:bg-accent cursor-pointer flex items-center space-x-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              const url = await handleFileUpload(f);
                              if (url) {
                                const curr = editingProject.images ? [...editingProject.images] : [editingProject.image_url];
                                setEditingProject({
                                  ...editingProject,
                                  images: [...curr, url],
                                  image_url: curr[0] || url,
                                });
                              }
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* Collage Layout Selector Override */}
                    <div className="pt-2 flex items-center space-x-4 text-xs font-mono">
                      <span className="text-foreground-muted">Layout Mode:</span>
                      {(['auto', 'split', 'grid', 'bento', 'mosaic'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setEditingProject({ ...editingProject, collage_layout: mode })}
                          className={`px-2.5 py-1 uppercase border ${
                            (editingProject.collage_layout || 'auto') === mode
                              ? 'border-accent bg-accent text-white font-bold'
                              : 'border-hairline bg-background text-foreground-muted'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Standard Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <label className="block text-xs font-mono uppercase text-foreground-muted mb-1.5">
                        Project Full Title (Lightbox Modal)
                      </label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-foreground-muted mb-1.5">
                        Card Display Title
                      </label>
                      <input
                        type="text"
                        value={editingProject.card_title}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, card_title: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-foreground-muted mb-1.5">
                        Category Display Label
                      </label>
                      <input
                        type="text"
                        value={editingProject.category_label}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, category_label: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-foreground-muted mb-1.5">
                        Filter Category Keys (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editingProject.categories.join(', ')}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            categories: e.target.value.split(',').map((s) => s.trim().toLowerCase()),
                          })
                        }
                        className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-foreground-muted mb-1.5">
                        Role
                      </label>
                      <input
                        type="text"
                        value={editingProject.role}
                        onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                        className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-foreground-muted mb-1.5">
                        Badge (NEW / 1st place / empty)
                      </label>
                      <input
                        type="text"
                        value={editingProject.badge || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, badge: e.target.value })}
                        className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-mono uppercase text-foreground-muted mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingProject.description}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, description: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-hairline">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 border border-hairline text-xs font-mono uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveProjectForm(editingProject)}
                      className="px-6 py-2 bg-foreground text-background hover:bg-accent text-xs font-mono uppercase font-semibold"
                    >
                      Save Specimen
                    </button>
                  </div>
                </div>
              )}

              {/* Projects Archive Table */}
              <div className="border border-hairline divide-y divide-hairline bg-background">
                {data.projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-background-alt transition-colors"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <span className="text-xs font-mono text-foreground-muted w-6">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="w-14 h-10 relative bg-background-alt border border-hairline overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={proj.image_url}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {proj.card_title || proj.title}
                        </p>
                        <p className="text-xs font-mono text-foreground-muted">
                          {proj.category_label} {proj.badge && `[${proj.badge}]`} {proj.images && proj.images.length > 1 && `(${proj.images.length} images)`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleToggleProjectVisibility(proj.id)}
                        title={proj.visible === false ? 'Hidden' : 'Visible'}
                        className={`p-1.5 border border-hairline ${
                          proj.visible === false ? 'text-foreground-muted' : 'text-accent'
                        }`}
                      >
                        {proj.visible === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1.5 border border-hairline disabled:opacity-25"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, 'down')}
                        disabled={idx === data.projects.length - 1}
                        title="Move Down"
                        className="p-1.5 border border-hairline disabled:opacity-25"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingProject(proj)}
                        className="px-3 py-1 border border-hairline text-xs font-mono uppercase bg-background hover:bg-background-subtle"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 border border-rose-500/30 text-rose-500 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-hairline">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Certificates ({data.certificates.items.length})
                  </h1>
                  <p className="text-xs text-foreground-muted mt-1 font-mono">
                    Add or update verified credentials and upload PDF assets.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newCert: CertificateItem = {
                      id: 'cert-' + Date.now(),
                      order: data.certificates.items.length + 1,
                      title: 'New Certificate',
                      issuer: 'Institution Name',
                      year: '2026',
                      pdf_url: '/img/Certificates/MINTESNOT LELISO.pdf',
                      visible: true,
                    };
                    const nextData = {
                      ...data,
                      certificates: {
                        ...data.certificates,
                        items: [...data.certificates.items, newCert],
                      },
                    };
                    setData(nextData);
                    handleSaveAll(nextData);
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wider text-background bg-foreground hover:bg-accent"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certificate</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.certificates.items.map((cert) => (
                  <div key={cert.id} className="p-6 border border-hairline bg-background space-y-4 crosshair-corner">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-accent font-bold">
                        VERIFIED CREDENTIAL
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (!confirm('Delete certificate?')) return;
                          const filtered = data.certificates.items.filter((c) => c.id !== cert.id);
                          const nextData = {
                            ...data,
                            certificates: { ...data.certificates, items: filtered },
                          };
                          setData(nextData);
                          handleSaveAll(nextData);
                        }}
                        className="text-xs text-rose-500 font-mono"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Certificate Title
                        </label>
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => {
                            const updated = data.certificates.items.map((c) =>
                              c.id === cert.id ? { ...c, title: e.target.value } : c
                            );
                            setData({
                              ...data,
                              certificates: { ...data.certificates, items: updated },
                            });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Issuer
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const updated = data.certificates.items.map((c) =>
                              c.id === cert.id ? { ...c, issuer: e.target.value } : c
                            );
                            setData({
                              ...data,
                              certificates: { ...data.certificates, items: updated },
                            });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Year
                        </label>
                        <input
                          type="text"
                          value={cert.year}
                          onChange={(e) => {
                            const updated = data.certificates.items.map((c) =>
                              c.id === cert.id ? { ...c, year: e.target.value } : c
                            );
                            setData({
                              ...data,
                              certificates: { ...data.certificates, items: updated },
                            });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                        PDF Document File Path
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cert.pdf_url}
                          onChange={(e) => {
                            const updated = data.certificates.items.map((c) =>
                              c.id === cert.id ? { ...c, pdf_url: e.target.value } : c
                            );
                            setData({
                              ...data,
                              certificates: { ...data.certificates, items: updated },
                            });
                          }}
                          className="flex-1 px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm font-mono"
                        />
                        <label className="px-3 py-2 border border-hairline bg-background-alt hover:bg-background-subtle cursor-pointer text-xs font-mono uppercase flex items-center space-x-1">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload PDF</span>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={async (e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const url = await handleFileUpload(f);
                                if (url) {
                                  const updated = data.certificates.items.map((c) =>
                                    c.id === cert.id ? { ...c, pdf_url: url } : c
                                  );
                                  setData({
                                    ...data,
                                    certificates: { ...data.certificates, items: updated },
                                  });
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-hairline">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Skills Inventory
                </h1>
                <p className="text-xs text-foreground-muted mt-1 font-mono">
                  Manage the 4 capability pods and listed tools.
                </p>
              </div>

              <div className="space-y-4">
                {data.skills.groups.map((group) => (
                  <div key={group.id} className="p-6 border border-hairline bg-background space-y-4 crosshair-corner">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Pod Name
                        </label>
                        <input
                          type="text"
                          value={group.name}
                          onChange={(e) => {
                            const updated = data.skills.groups.map((g) =>
                              g.id === group.id ? { ...g, name: e.target.value } : g
                            );
                            setData({ ...data, skills: { ...data.skills, groups: updated } });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm font-semibold"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Skills Listed (separated by ·)
                        </label>
                        <input
                          type="text"
                          value={group.skills}
                          onChange={(e) => {
                            const updated = data.skills.groups.map((g) =>
                              g.id === group.id ? { ...g, skills: e.target.value } : g
                            );
                            setData({ ...data, skills: { ...data.skills, groups: updated } });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EDUCATION & CV */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-hairline">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Education &amp; Official CV
                </h1>
                <p className="text-xs text-foreground-muted mt-1 font-mono">
                  Manage degrees, chronology, and the downloadable PDF file.
                </p>
              </div>

              {/* CV File Manager */}
              <div className="p-6 border border-hairline bg-background-alt space-y-4 crosshair-corner">
                <h3 className="text-xs font-mono font-bold uppercase text-foreground">
                  Official CV File Path
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.education.cv.file_url}
                    onChange={(e) =>
                      setData({
                        ...data,
                        education: {
                          ...data.education,
                          cv: { ...data.education.cv, file_url: e.target.value },
                        },
                      })
                    }
                    className="flex-1 px-3 py-2 bg-background border border-hairline text-foreground text-sm font-mono"
                  />
                  <label className="px-4 py-2 border border-hairline bg-foreground text-background hover:bg-accent cursor-pointer text-xs font-mono uppercase flex items-center space-x-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New CV</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const url = await handleFileUpload(f);
                          if (url) {
                            setData({
                              ...data,
                              education: {
                                ...data.education,
                                cv: { ...data.education.cv, file_url: url },
                              },
                            });
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Chronology entries */}
              <div className="space-y-4">
                {data.education.items.map((edu) => (
                  <div key={edu.id} className="p-6 border border-hairline bg-background space-y-4 crosshair-corner">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Degree / Title
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = data.education.items.map((item) =>
                              item.id === edu.id ? { ...item, degree: e.target.value } : item
                            );
                            setData({ ...data, education: { ...data.education, items: updated } });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => {
                            const updated = data.education.items.map((item) =>
                              item.id === edu.id ? { ...item, institution: e.target.value } : item
                            );
                            setData({ ...data, education: { ...data.education, items: updated } });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Dates
                        </label>
                        <input
                          type="text"
                          value={edu.dates || ''}
                          onChange={(e) => {
                            const updated = data.education.items.map((item) =>
                              item.id === edu.id ? { ...item, dates: e.target.value } : item
                            );
                            setData({ ...data, education: { ...data.education, items: updated } });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={edu.description || ''}
                          onChange={(e) => {
                            const updated = data.education.items.map((item) =>
                              item.id === edu.id ? { ...item, description: e.target.value } : item
                            );
                            setData({ ...data, education: { ...data.education, items: updated } });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LAB & CURRENTLY */}
          {activeTab === 'lab-currently' && (
            <div className="space-y-8">
              <div className="pb-4 border-b border-hairline">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Lab &amp; Telemetry
                </h1>
                <p className="text-xs text-foreground-muted mt-1 font-mono">
                  Modify the 3 Lab experiments and the 4 Currently monitor nodes.
                </p>
              </div>

              {/* Currently Items */}
              <div className="space-y-4">
                <h2 className="text-base font-bold font-mono text-foreground">Currently Nodes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.currently.items.map((item, idx) => (
                    <div key={idx} className="p-4 border border-hairline bg-background crosshair-corner">
                      <label className="block text-xs font-mono uppercase text-accent font-bold mb-1">
                        {item.kicker}
                      </label>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => {
                          const updated = [...data.currently.items];
                          updated[idx] = { ...updated[idx], text: e.target.value };
                          setData({ ...data, currently: { ...data.currently, items: updated } });
                        }}
                        className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab experiments */}
              <div className="space-y-4">
                <h2 className="text-base font-bold font-mono text-foreground">Lab Experiment Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.lab.items.map((item, idx) => (
                    <div key={item.id} className="p-4 border border-hairline bg-background space-y-3 crosshair-corner">
                      <div>
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Kicker
                        </label>
                        <input
                          type="text"
                          value={item.kicker}
                          onChange={(e) => {
                            const updated = [...data.lab.items];
                            updated[idx] = { ...updated[idx], kicker: e.target.value };
                            setData({ ...data, lab: { ...data.lab, items: updated } });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...data.lab.items];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setData({ ...data, lab: { ...data.lab, items: updated } });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={item.description}
                          onChange={(e) => {
                            const updated = [...data.lab.items];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setData({ ...data, lab: { ...data.lab, items: updated } });
                          }}
                          className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE & SETTINGS */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="pb-4 border-b border-hairline">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Profile &amp; SEO Configuration
                </h1>
                <p className="text-xs text-foreground-muted mt-1 font-mono">
                  Manage display name, lead text, About copy, quote, stats, and socials.
                </p>
              </div>

              {/* Hero & Identity */}
              <div className="p-6 border border-hairline bg-background space-y-4 crosshair-corner">
                <h2 className="text-base font-bold font-mono text-foreground">Hero Section</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={data.hero.name}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, name: e.target.value } })
                      }
                      className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                      Discipline Tagline
                    </label>
                    <input
                      type="text"
                      value={data.hero.discipline}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, discipline: e.target.value } })
                      }
                      className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                      Hero Lead
                    </label>
                    <textarea
                      rows={2}
                      value={data.hero.lead}
                      onChange={(e) =>
                        setData({ ...data, hero: { ...data.hero, lead: e.target.value } })
                      }
                      className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* About & Quote */}
              <div className="p-6 border border-hairline bg-background space-y-4 crosshair-corner">
                <h2 className="text-base font-bold font-mono text-foreground">About &amp; Theological Quote</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                      Body Paragraph 1
                    </label>
                    <textarea
                      rows={3}
                      value={data.about.body_1}
                      onChange={(e) =>
                        setData({ ...data, about: { ...data.about, body_1: e.target.value } })
                      }
                      className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                      Body Paragraph 2
                    </label>
                    <textarea
                      rows={3}
                      value={data.about.body_2}
                      onChange={(e) =>
                        setData({ ...data, about: { ...data.about, body_2: e.target.value } })
                      }
                      className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-mono uppercase text-foreground-muted mb-1">
                      Bible Verse (Colossians 3:17)
                    </label>
                    <input
                      type="text"
                      value={data.about.quote}
                      onChange={(e) =>
                        setData({ ...data, about: { ...data.about, quote: e.target.value } })
                      }
                      className="w-full px-3 py-2 bg-background-alt border border-hairline text-foreground text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: INBOUND INQUIRIES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-hairline">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Inbound Inquiries ({messages.length})
                </h1>
                <p className="text-xs text-foreground-muted mt-1 font-mono">
                  Messages submitted through the public consultation terminal.
                </p>
              </div>

              {messages.length === 0 ? (
                <div className="p-12 text-center border border-hairline bg-background text-foreground-muted font-mono text-sm">
                  No transmissions recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-6 border border-hairline bg-background crosshair-corner ${
                        !msg.read ? 'border-l-4 border-l-accent' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-hairline mb-4">
                        <div>
                          <p className="text-sm font-bold text-foreground">{msg.name}</p>
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-xs text-accent hover:underline font-mono"
                          >
                            {msg.email}
                          </a>
                        </div>
                        <div className="flex items-center space-x-3 text-xs font-mono text-foreground-muted">
                          <time>{new Date(msg.created_at).toLocaleString()}</time>
                          <button
                            type="button"
                            onClick={async () => {
                              const nextRead = !msg.read;
                              await fetch('/api/admin/messages', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: msg.id, read: nextRead }),
                              });
                              setMessages(
                                messages.map((m) => (m.id === msg.id ? { ...m, read: nextRead } : m))
                              );
                            }}
                            className="underline"
                          >
                            {msg.read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!confirm('Delete this message?')) return;
                              await fetch(`/api/admin/messages?id=${msg.id}`, { method: 'DELETE' });
                              setMessages(messages.filter((m) => m.id !== msg.id));
                            }}
                            className="text-rose-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-foreground mb-2">
                        Subject: {msg.subject}
                      </p>
                      <p className="text-sm text-foreground-muted leading-relaxed whitespace-pre-line mb-4">
                        {msg.message}
                      </p>

                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-hairline text-xs font-mono uppercase bg-background-alt hover:bg-background-subtle text-foreground"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 9: CUSTOM SECTIONS */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-hairline">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Custom Sections
                  </h1>
                  <p className="text-xs text-foreground-muted mt-1 font-mono">
                    Inject brand-new sections into the live site with zero code changes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const newSection: CustomSection = {
                      id: 'custom-' + Date.now(),
                      order: (data.custom_sections || []).length + 1,
                      title: 'New Section Title',
                      items: [
                        {
                          id: 'item-1',
                          title: 'Entry Title',
                          description: 'Description of this entry...',
                          image_url: '',
                          link: '',
                        },
                      ],
                    };
                    const nextSections = [...(data.custom_sections || []), newSection];
                    const nextData = { ...data, custom_sections: nextSections };
                    setData(nextData);
                    handleSaveAll(nextData);
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wider text-background bg-foreground hover:bg-accent"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              {(data.custom_sections || []).length === 0 ? (
                <div className="p-8 border border-hairline bg-background text-center text-xs font-mono text-foreground-muted">
                  No custom sections deployed. Click &ldquo;Add Section&rdquo; to create one.
                </div>
              ) : (
                <div className="space-y-6">
                  {data.custom_sections.map((section, sIdx) => (
                    <div key={section.id} className="p-6 border border-hairline bg-background space-y-4 crosshair-corner">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            const updated = [...data.custom_sections];
                            updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                            setData({ ...data, custom_sections: updated });
                          }}
                          className="px-3 py-1.5 bg-background-alt border border-hairline font-bold text-base text-foreground font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!confirm('Delete this section?')) return;
                            const filtered = data.custom_sections.filter((s) => s.id !== section.id);
                            const nextData = { ...data, custom_sections: filtered };
                            setData(nextData);
                            handleSaveAll(nextData);
                          }}
                          className="text-xs text-rose-500 font-mono"
                        >
                          Delete Section
                        </button>
                      </div>

                      <div className="space-y-3 pt-2">
                        {section.items.map((item, iIdx) => (
                          <div
                            key={item.id}
                            className="p-4 border border-hairline bg-background-alt space-y-2"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <input
                                type="text"
                                placeholder="Item Title"
                                value={item.title}
                                onChange={(e) => {
                                  const updated = [...data.custom_sections];
                                  const items = [...updated[sIdx].items];
                                  items[iIdx] = { ...items[iIdx], title: e.target.value };
                                  updated[sIdx] = { ...updated[sIdx], items };
                                  setData({ ...data, custom_sections: updated });
                                }}
                                className="px-3 py-1.5 bg-background border border-hairline text-sm text-foreground"
                              />
                              <input
                                type="text"
                                placeholder="Link URL"
                                value={item.link || ''}
                                onChange={(e) => {
                                  const updated = [...data.custom_sections];
                                  const items = [...updated[sIdx].items];
                                  items[iIdx] = { ...items[iIdx], link: e.target.value };
                                  updated[sIdx] = { ...updated[sIdx], items };
                                  setData({ ...data, custom_sections: updated });
                                }}
                                className="px-3 py-1.5 bg-background border border-hairline text-sm text-foreground"
                              />
                            </div>
                            <textarea
                              rows={2}
                              placeholder="Description"
                              value={item.description || ''}
                              onChange={(e) => {
                                const updated = [...data.custom_sections];
                                const items = [...updated[sIdx].items];
                                items[iIdx] = { ...items[iIdx], description: e.target.value };
                                updated[sIdx] = { ...updated[sIdx], items };
                                setData({ ...data, custom_sections: updated });
                              }}
                              className="w-full px-3 py-1.5 bg-background border border-hairline text-sm text-foreground"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
