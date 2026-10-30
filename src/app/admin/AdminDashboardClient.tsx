'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  PortfolioData,
  ProjectItem,
  CertificateItem,
  SkillGroup,
  MessageItem,
} from '@/types/portfolio';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  Wrench,
  Mail,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  Upload,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

interface AdminDashboardClientProps {
  initialData: PortfolioData;
  initialMessages: MessageItem[];
  userEmail: string;
}

export function AdminDashboardClient({
  initialData,
  initialMessages,
  userEmail,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [data, setData] = useState<PortfolioData>(initialData);
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'certificates' | 'content' | 'messages'>('overview');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Project Editor state
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [uploading, setUploading] = useState(false);

  // Certificate Editor state
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);

  // File upload helper
  const handleFileUpload = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Upload failed');
      return result.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Save all portfolio data
  const handleSaveData = async (newData: PortfolioData) => {
    setSaveStatus('saving');
    setStatusMessage('Saving changes...');
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      if (!res.ok) throw new Error('Failed to save');
      setData(newData);
      setSaveStatus('saved');
      setStatusMessage('All changes saved and live.');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch {
      setSaveStatus('error');
      setStatusMessage('Error saving changes.');
    }
  };

  // Sign out
  const handleSignOut = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  // Save Project
  const handleSaveProject = (project: ProjectItem) => {
    const validImages = project.images && project.images.length > 0
      ? project.images
      : [project.image_url];

    const projectToSave = {
      ...project,
      image_url: validImages[0] || project.image_url,
      images: validImages,
    };

    const exists = data.projects.some((p) => p.id === projectToSave.id);
    const updatedProjects = exists
      ? data.projects.map((p) => (p.id === projectToSave.id ? projectToSave : p))
      : [projectToSave, ...data.projects];

    const nextData = { ...data, projects: updatedProjects };
    handleSaveData(nextData);
    setEditingProject(null);
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const nextData = {
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    };
    handleSaveData(nextData);
  };

  // Toggle Project Visibility
  const handleToggleProjectVisibility = (id: string) => {
    const nextProjects = data.projects.map((p) =>
      p.id === id ? { ...p, visible: p.visible === false } : p
    );
    handleSaveData({ ...data, projects: nextProjects });
  };

  // Reorder Projects
  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.projects.length) return;
    const items = [...data.projects];
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    handleSaveData({ ...data, projects: items });
  };

  // Save Certificate
  const handleSaveCert = (cert: CertificateItem) => {
    const exists = data.certificates.items.some((c) => c.id === cert.id);
    const updatedItems = exists
      ? data.certificates.items.map((c) => (c.id === cert.id ? cert : c))
      : [...data.certificates.items, cert];

    const nextData = {
      ...data,
      certificates: { ...data.certificates, items: updatedItems },
    };
    handleSaveData(nextData);
    setEditingCert(null);
  };

  // Delete Certificate
  const handleDeleteCert = (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    const nextData = {
      ...data,
      certificates: {
        ...data.certificates,
        items: data.certificates.items.filter((c) => c.id !== id),
      },
    };
    handleSaveData(nextData);
  };

  // Reorder Certificate
  const handleMoveCert = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= data.certificates.items.length) return;
    const items = [...data.certificates.items];
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;
    handleSaveData({
      ...data,
      certificates: { ...data.certificates, items: items },
    });
  };

  // Message Actions
  const handleMarkMessageRead = async (id: string) => {
    await fetch('/api/admin/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read: true }),
    });
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch('/api/admin/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMessages(messages.filter((m) => m.id !== id));
  };

  // Unread count
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-site mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-sm tracking-tight text-foreground">
              Admin Dashboard
            </span>
            <span className="text-xs text-foreground-muted hidden sm:inline">
              · {userEmail}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {statusMessage && (
              <span className="text-xs text-foreground-muted hidden md:inline">
                {statusMessage}
              </span>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3 inline-flex items-center space-x-1.5 rounded-md border border-border text-xs font-medium hover:border-foreground transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="min-h-[44px] px-3 inline-flex items-center space-x-1.5 rounded-md border border-border hover:border-foreground text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-border bg-surface/50">
          <div className="max-w-site mx-auto px-6 flex items-center space-x-2 overflow-x-auto scrollbar-none py-2">
            {[
              { key: 'overview', label: 'Overview', icon: LayoutDashboard },
              { key: 'projects', label: `Projects (${data.projects.length})`, icon: FolderKanban },
              { key: 'certificates', label: `Certificates (${data.certificates.items.length})`, icon: Award },
              { key: 'content', label: 'Skills & Education', icon: Wrench },
              { key: 'messages', label: `Messages (${unreadCount})`, icon: Mail },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-md text-xs font-medium inline-flex items-center space-x-2 whitespace-nowrap transition-colors border ${
                    isActive
                      ? 'bg-foreground text-background border-foreground font-semibold'
                      : 'border-transparent text-foreground-muted hover:text-foreground hover:bg-surface'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-site mx-auto px-6 py-8">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Overview
              </h1>
              <p className="text-sm text-foreground-muted mt-1">
                Portfolio performance summary and quick management shortcuts.
              </p>
            </div>

            {/* Counts Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-md border border-border bg-surface/30">
                <p className="text-xs text-foreground-muted">Projects</p>
                <p className="text-2xl font-semibold text-foreground mt-2">
                  {data.projects.length}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  className="mt-3 text-xs text-foreground hover:underline inline-flex items-center space-x-1"
                >
                  <span>Manage</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="p-5 rounded-md border border-border bg-surface/30">
                <p className="text-xs text-foreground-muted">Certificates</p>
                <p className="text-2xl font-semibold text-foreground mt-2">
                  {data.certificates.items.length}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('certificates')}
                  className="mt-3 text-xs text-foreground hover:underline inline-flex items-center space-x-1"
                >
                  <span>Manage</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="p-5 rounded-md border border-border bg-surface/30">
                <p className="text-xs text-foreground-muted">Skill Pods</p>
                <p className="text-2xl font-semibold text-foreground mt-2">
                  {data.skills.groups.length}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  className="mt-3 text-xs text-foreground hover:underline inline-flex items-center space-x-1"
                >
                  <span>Edit</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="p-5 rounded-md border border-border bg-surface/30">
                <p className="text-xs text-foreground-muted">Unread Messages</p>
                <p className="text-2xl font-semibold text-foreground mt-2">
                  {unreadCount}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('messages')}
                  className="mt-3 text-xs text-foreground hover:underline inline-flex items-center space-x-1"
                >
                  <span>View Inbox</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-6 border-t border-border">
              <h2 className="text-base font-semibold text-foreground mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('projects');
                    setEditingProject({
                      id: 'proj-' + Date.now(),
                      order: 1,
                      title: 'New Project',
                      card_title: 'New Project',
                      categories: ['branding'],
                      category_label: 'Branding',
                      role: 'Role: Graphic Designer',
                      year: '2026',
                      description: 'Project description here...',
                      card_desc: '',
                      image_url: '/img/cover.jpg',
                      images: ['/img/cover.jpg'],
                      badge: 'NEW',
                      visible: true,
                    });
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-md bg-foreground text-background text-xs font-medium inline-flex items-center space-x-1.5 hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                  <span>Add New Project</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('certificates');
                    setEditingCert({
                      id: 'cert-' + Date.now(),
                      order: data.certificates.items.length + 1,
                      title: 'New Certificate',
                      issuer: 'Institution Name',
                      year: '2026',
                      image_url: '',
                      pdf_url: '',
                      visible: true,
                    });
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-md border border-border text-foreground text-xs font-medium inline-flex items-center space-x-1.5 hover:border-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" strokeWidth={1.5} />
                  <span>Add New Certificate</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Projects
                </h1>
                <p className="text-sm text-foreground-muted">
                  Add, edit, reorder, or toggle visibility of portfolio work.
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
                    badge: 'None',
                    visible: true,
                  });
                }}
                className="min-h-[44px] px-4 py-2 rounded-md bg-foreground text-background text-xs font-medium inline-flex items-center space-x-1.5 hover:opacity-90 transition-opacity self-start"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                <span>Add Project</span>
              </button>
            </div>

            {/* Project Edit/Add Modal or Form */}
            {editingProject && (
              <div className="p-6 rounded-md border border-border bg-surface/40 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h2 className="text-base font-semibold text-foreground">
                    {editingProject.title ? `Edit: ${editingProject.title}` : 'Create New Project'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    aria-label="Close project editor"
                    className="p-1 rounded text-foreground-muted hover:text-foreground"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground-muted mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground"
                      placeholder="e.g. EAHF Booth Design"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground-muted mb-1">
                      Category Label
                    </label>
                    <input
                      type="text"
                      value={editingProject.category_label || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, category_label: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground"
                      placeholder="e.g. Event Design · Exhibition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground-muted mb-1">
                      Role / Tools
                    </label>
                    <input
                      type="text"
                      value={editingProject.role || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, role: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground"
                      placeholder="e.g. Role: Graphic designer · Photoshop"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground-muted mb-1">
                      Badge
                    </label>
                    <select
                      value={editingProject.badge || 'None'}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, badge: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground"
                    >
                      <option value="None">None</option>
                      <option value="NEW">NEW</option>
                      <option value="1st place">1st place</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground-muted mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={editingProject.description || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground resize-none"
                    placeholder="Project details..."
                  />
                </div>

                {/* Multiple Images Manager */}
                <div className="pt-4 border-t border-border space-y-3">
                  <label className="block text-xs font-semibold text-foreground">
                    Project Images ({editingProject.images?.length || 1})
                  </label>
                  <p className="text-xs text-foreground-muted">
                    The first image is used as the cover on the public grid. Additional images display in the lightbox gallery.
                  </p>

                  {/* Thumbnail gallery strip */}
                  <div className="flex flex-wrap gap-3">
                    {(editingProject.images || [editingProject.image_url]).map((img, iIdx) => (
                      <div
                        key={iIdx}
                        className="p-2 rounded-md border border-border bg-background flex flex-col items-center space-y-1.5"
                      >
                        <div className="relative w-24 h-16 rounded border border-border overflow-hidden bg-surface">
                          <Image src={img} alt="Thumbnail" fill className="object-cover" />
                        </div>
                        <div className="flex items-center space-x-1">
                          {iIdx === 0 ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-foreground text-background">
                              COVER
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const current = [...(editingProject.images || [editingProject.image_url])];
                                const selected = current.splice(iIdx, 1)[0];
                                current.unshift(selected);
                                setEditingProject({
                                  ...editingProject,
                                  images: current,
                                  image_url: current[0],
                                });
                              }}
                              className="text-[10px] text-foreground hover:underline"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const current = [...(editingProject.images || [editingProject.image_url])];
                              current.splice(iIdx, 1);
                              setEditingProject({
                                ...editingProject,
                                images: current,
                                image_url: current[0] || '/img/cover.jpg',
                              });
                            }}
                            className="text-xs text-foreground-muted hover:text-foreground px-1"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Image Controls */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Image URL (e.g. /img/filename.jpg)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 min-w-[200px] px-3 py-2 text-xs rounded-md border border-border bg-background text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newImageUrl.trim()) return;
                        const current = editingProject.images ? [...editingProject.images] : [editingProject.image_url];
                        setEditingProject({
                          ...editingProject,
                          images: [...current, newImageUrl.trim()],
                        });
                        setNewImageUrl('');
                      }}
                      className="min-h-[44px] px-3 py-2 text-xs rounded-md border border-border hover:border-foreground text-foreground"
                    >
                      Add URL
                    </button>
                    <label className="min-h-[44px] px-3 py-2 text-xs rounded-md border border-border hover:border-foreground text-foreground cursor-pointer inline-flex items-center space-x-1.5">
                      <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              const current = editingProject.images ? [...editingProject.images] : [editingProject.image_url];
                              setEditingProject({
                                ...editingProject,
                                images: [...current, url],
                              });
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="min-h-[44px] px-4 py-2 text-xs rounded-md border border-border hover:border-foreground text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveProject(editingProject)}
                    className="min-h-[44px] px-5 py-2 text-xs font-medium rounded-md bg-foreground text-background hover:opacity-90"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            )}

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-foreground-muted" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-md border border-border bg-background text-foreground"
              />
            </div>

            {/* Projects List */}
            <div className="space-y-3">
              {data.projects
                .filter((p) =>
                  p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
                  p.categories.some((c) => c.toLowerCase().includes(projectSearch.toLowerCase()))
                )
                .map((project, idx) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-md border border-border bg-surface/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className="relative w-14 h-12 rounded border border-border overflow-hidden bg-surface flex-shrink-0">
                        <Image src={project.image_url} alt={project.title} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-foreground truncate">
                          {project.title}
                        </h3>
                        <p className="text-xs text-foreground-muted truncate">
                          {project.category_label || project.categories.join(' · ')}
                          {project.images && project.images.length > 1 && ` · ${project.images.length} images`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      {/* Reorder */}
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, 'up')}
                        disabled={idx === 0}
                        aria-label="Move project up"
                        className="p-2 rounded border border-border text-foreground disabled:opacity-30 hover:border-foreground"
                      >
                        <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, 'down')}
                        disabled={idx === data.projects.length - 1}
                        aria-label="Move project down"
                        className="p-2 rounded border border-border text-foreground disabled:opacity-30 hover:border-foreground"
                      >
                        <ArrowDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>

                      {/* Visibility */}
                      <button
                        type="button"
                        onClick={() => handleToggleProjectVisibility(project.id)}
                        aria-label={project.visible === false ? 'Make visible' : 'Hide project'}
                        className="p-2 rounded border border-border text-foreground hover:border-foreground"
                      >
                        {project.visible === false ? (
                          <EyeOff className="w-3.5 h-3.5 text-foreground-muted" strokeWidth={1.5} />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-foreground" strokeWidth={1.5} />
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => setEditingProject(project)}
                        className="min-h-[36px] px-3 py-1.5 rounded text-xs font-medium border border-border hover:border-foreground text-foreground"
                      >
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(project.id)}
                        aria-label="Delete project"
                        className="p-2 rounded border border-border text-foreground-muted hover:text-foreground hover:border-foreground"
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* CERTIFICATES TAB (Supports TWO uploads: JPEG + PDF) */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Certificates
                </h1>
                <p className="text-sm text-foreground-muted">
                  Supports two file uploads per certificate: a JPEG preview image and a full PDF document.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCert({
                    id: 'cert-' + Date.now(),
                    order: data.certificates.items.length + 1,
                    title: '',
                    issuer: '',
                    year: '2026',
                    image_url: '',
                    pdf_url: '',
                    visible: true,
                  });
                }}
                className="min-h-[44px] px-4 py-2 rounded-md bg-foreground text-background text-xs font-medium inline-flex items-center space-x-1.5 hover:opacity-90 transition-opacity self-start"
              >
                <Plus className="w-4 h-4" strokeWidth={1.5} />
                <span>Add Certificate</span>
              </button>
            </div>

            {/* Certificate Add / Edit Form */}
            {editingCert && (
              <div className="p-6 rounded-md border border-border bg-surface/40 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h2 className="text-base font-semibold text-foreground">
                    {editingCert.title ? `Edit Certificate: ${editingCert.title}` : 'Add New Certificate'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    aria-label="Close certificate editor"
                    className="p-1 rounded text-foreground-muted hover:text-foreground"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground-muted mb-1">
                      Certificate Title
                    </label>
                    <input
                      type="text"
                      value={editingCert.title}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, title: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground"
                      placeholder="e.g. Medical Volunteer Service"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground-muted mb-1">
                      Issuer
                    </label>
                    <input
                      type="text"
                      value={editingCert.issuer}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, issuer: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground"
                      placeholder="e.g. St. Paul's Hospital"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground-muted mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={editingCert.year}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, year: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground"
                      placeholder="e.g. 2025"
                    />
                  </div>
                </div>

                {/* File Option 1: JPEG Preview Image */}
                <div className="p-4 rounded-md border border-border bg-background space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-foreground">
                      1. Preview Image (JPEG / PNG / WebP)
                    </label>
                    {editingCert.image_url && (
                      <span className="text-[10px] text-foreground-muted">Image attached</span>
                    )}
                  </div>
                  <p className="text-xs text-foreground-muted">
                    This image is displayed on the certificate card and opens in the zoomable viewer.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={editingCert.image_url || ''}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, image_url: e.target.value })
                      }
                      className="flex-1 min-w-[200px] px-3 py-2 text-xs rounded-md border border-border bg-surface text-foreground font-mono"
                      placeholder="e.g. /img/Certificates/preview.jpg"
                    />
                    <label className="min-h-[44px] px-3 py-2 text-xs rounded-md border border-border hover:border-foreground text-foreground cursor-pointer inline-flex items-center space-x-1.5">
                      <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{uploading ? 'Uploading...' : 'Upload JPEG'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setEditingCert({ ...editingCert, image_url: url });
                            }
                          }
                        }}
                      />
                    </label>
                  </div>

                  {editingCert.image_url && (
                    <div className="pt-2">
                      <div className="relative w-32 h-20 rounded border border-border overflow-hidden bg-surface">
                        <Image src={editingCert.image_url} alt="Preview" fill className="object-cover" />
                      </div>
                    </div>
                  )}
                </div>

                {/* File Option 2: PDF Document */}
                <div className="p-4 rounded-md border border-border bg-background space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-foreground">
                      2. Document File (PDF)
                    </label>
                    {editingCert.pdf_url && (
                      <span className="text-[10px] text-foreground-muted">PDF attached</span>
                    )}
                  </div>
                  <p className="text-xs text-foreground-muted">
                    This document enables the &ldquo;View PDF&rdquo; and &ldquo;Download PDF&rdquo; actions in the viewer.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={editingCert.pdf_url || ''}
                      onChange={(e) =>
                        setEditingCert({ ...editingCert, pdf_url: e.target.value })
                      }
                      className="flex-1 min-w-[200px] px-3 py-2 text-xs rounded-md border border-border bg-surface text-foreground font-mono"
                      placeholder="e.g. /img/Certificates/document.pdf"
                    />
                    <label className="min-h-[44px] px-3 py-2 text-xs rounded-md border border-border hover:border-foreground text-foreground cursor-pointer inline-flex items-center space-x-1.5">
                      <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>{uploading ? 'Uploading...' : 'Upload PDF'}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            if (url) {
                              setEditingCert({ ...editingCert, pdf_url: url });
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setEditingCert(null)}
                    className="min-h-[44px] px-4 py-2 text-xs rounded-md border border-border hover:border-foreground text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveCert(editingCert)}
                    className="min-h-[44px] px-5 py-2 text-xs font-medium rounded-md bg-foreground text-background hover:opacity-90"
                  >
                    Save Certificate
                  </button>
                </div>
              </div>
            )}

            {/* Certificate List */}
            <div className="space-y-3">
              {data.certificates.items.map((cert, idx) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-md border border-border bg-surface/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="relative w-14 h-12 rounded border border-border overflow-hidden bg-surface flex items-center justify-center flex-shrink-0">
                      {cert.image_url ? (
                        <Image src={cert.image_url} alt={cert.title} fill className="object-cover" />
                      ) : (
                        <FileText className="w-5 h-5 text-foreground-muted" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-foreground-muted truncate">
                        {cert.issuer} · {cert.year}
                        {cert.pdf_url && ' · PDF'}
                        {cert.image_url && ' · JPEG'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleMoveCert(idx, 'up')}
                      disabled={idx === 0}
                      aria-label="Move certificate up"
                      className="p-2 rounded border border-border text-foreground disabled:opacity-30 hover:border-foreground"
                    >
                      <ArrowUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveCert(idx, 'down')}
                      disabled={idx === data.certificates.items.length - 1}
                      aria-label="Move certificate down"
                      className="p-2 rounded border border-border text-foreground disabled:opacity-30 hover:border-foreground"
                    >
                      <ArrowDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCert(cert)}
                      className="min-h-[36px] px-3 py-1.5 rounded text-xs font-medium border border-border hover:border-foreground text-foreground"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCert(cert.id)}
                      aria-label="Delete certificate"
                      className="p-2 rounded border border-border text-foreground-muted hover:text-foreground hover:border-foreground"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS & EDUCATION TAB */}
        {activeTab === 'content' && (
          <div className="space-y-10">
            {/* Skills */}
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Toolkit & Skills
              </h1>
              <p className="text-sm text-foreground-muted">
                Edit skill groups and skills list (Design, Development, Workflow, Learning).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.skills.groups.map((group, gIdx) => (
                  <div key={group.id} className="p-4 rounded-md border border-border bg-surface/30 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground-muted mb-1">
                        Group Name
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
                        className="w-full px-3 py-1.5 text-sm rounded-md border border-border bg-background text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-foreground-muted mb-1">
                        Skills (separated by · or commas)
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
                        className="w-full px-3 py-1.5 text-sm rounded-md border border-border bg-background text-foreground"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleSaveData(data)}
                className="min-h-[44px] px-5 py-2 text-xs font-medium rounded-md bg-foreground text-background hover:opacity-90"
              >
                Save Skills
              </button>
            </div>

            {/* Education & CV */}
            <div className="pt-8 border-t border-border space-y-4">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Education & CV File
              </h2>
              <div className="p-4 rounded-md border border-border bg-surface/30 space-y-3">
                <label className="block text-xs font-medium text-foreground-muted">
                  CV PDF File Path or URL
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={data.education.cv?.file_url || '/doc/resume-mntsnt.pdf'}
                    onChange={(e) => {
                      setData({
                        ...data,
                        education: {
                          ...data.education,
                          cv: { ...data.education.cv, file_url: e.target.value },
                        },
                      });
                    }}
                    className="flex-1 min-w-[200px] px-3 py-2 text-xs rounded-md border border-border bg-background text-foreground font-mono"
                  />
                  <label className="min-h-[44px] px-3 py-2 text-xs rounded-md border border-border hover:border-foreground text-foreground cursor-pointer inline-flex items-center space-x-1.5">
                    <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Upload New CV</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          if (url) {
                            const next = {
                              ...data,
                              education: {
                                ...data.education,
                                cv: { ...data.education.cv, file_url: url },
                              },
                            };
                            setData(next);
                            handleSaveData(next);
                          }
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSaveData(data)}
                    className="min-h-[44px] px-4 py-2 text-xs font-medium rounded-md bg-foreground text-background hover:opacity-90"
                  >
                    Save CV Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Messages Inbox ({messages.length})
              </h1>
              <p className="text-sm text-foreground-muted">
                Direct submissions from the public site contact form.
              </p>
            </div>

            {messages.length === 0 ? (
              <div className="p-12 text-center rounded-md border border-border bg-surface/30 text-foreground-muted">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" strokeWidth={1.5} />
                <p className="text-sm">No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-md border transition-colors ${
                      msg.read
                        ? 'border-border bg-background'
                        : 'border-foreground/30 bg-surface/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                      <div className="flex items-center space-x-2">
                        {!msg.read && (
                          <span className="w-2 h-2 rounded-full bg-foreground" aria-hidden="true" />
                        )}
                        <h3 className="text-sm font-semibold text-foreground">
                          {msg.name}
                        </h3>
                        <span className="text-xs text-foreground-muted">
                          &lt;{msg.email}&gt;
                        </span>
                      </div>
                      <span className="text-xs font-mono text-foreground-muted">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-foreground mt-2">
                      Subject: {msg.subject}
                    </p>
                    <p className="text-sm text-foreground-muted mt-2 leading-relaxed whitespace-pre-line">
                      {msg.message}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-end space-x-3">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="text-xs font-medium text-foreground hover:underline"
                      >
                        Reply via Email
                      </a>
                      {!msg.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkMessageRead(msg.id)}
                          className="text-xs text-foreground-muted hover:text-foreground"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-xs text-foreground-muted hover:text-foreground"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
