'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { CertificateItem, PortfolioData } from '@/types/portfolio';
import { FileText, Download, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface CertificatesProps {
  data: PortfolioData['certificates'];
}

function PdfPagePreview({ pdfUrl, title }: { pdfUrl: string; title: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let active = true;

    async function renderPage() {
      try {
        let pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const existingScript = document.getElementById('pdfjs-cdn-script');
            if (existingScript) {
              if ((window as any).pdfjsLib) {
                resolve();
                return;
              }
              existingScript.addEventListener('load', () => resolve());
              existingScript.addEventListener('error', () => reject());
              return;
            }
            const script = document.createElement('script');
            script.id = 'pdfjs-cdn-script';
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.head.appendChild(script);
          });
          pdfjsLib = (window as any).pdfjsLib;
        }

        if (!pdfjsLib || !active) return;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        if (!active || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (active) setRendered(true);
        }
      } catch {
        // Fallback gracefully to clean card
      }
    }

    renderPage();
    return () => {
      active = false;
    };
  }, [pdfUrl]);

  return (
    <div className="w-full h-full relative flex items-center justify-center bg-surface">
      <canvas
        ref={canvasRef}
        aria-label={`Preview of ${title}`}
        className={`w-full h-full object-contain ${rendered ? 'block' : 'hidden'}`}
      />
      {!rendered && (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <FileText className="w-8 h-8 text-foreground-muted mb-2" strokeWidth={1.5} />
          <span className="text-xs font-medium text-foreground-muted">PDF Document</span>
        </div>
      )}
    </div>
  );
}

export function Certificates({ data }: CertificatesProps) {
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const visibleCerts = data.items.filter((item) => item.visible !== false);

  const openCertModal = (cert: CertificateItem) => {
    setActiveCert(cert);
    setZoomLevel(1);
  };

  const closeCertModal = useCallback(() => {
    setActiveCert(null);
    setZoomLevel(1);
  }, []);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeCert) {
        closeCertModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCert, closeCertModal]);

  // Lock scroll
  useEffect(() => {
    if (activeCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeCert]);

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <section aria-labelledby="certificates-title" id="certificates" className="py-16 sm:py-20 border-t border-border">
      <div className="max-w-site mx-auto px-6">
        <p className="text-xs uppercase tracking-wider text-foreground-muted font-medium mb-2">
          {data.label}
        </p>
        <h2 id="certificates-title" className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          {data.title}
        </h2>
        {data.lede && (
          <p className="mt-3 text-base text-foreground-muted max-w-[65ch]">
            {data.lede}
          </p>
        )}

        {/* Certificate Cards Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCerts.map((cert) => {
            const hasImage = Boolean(cert.image_url);
            const hasPdf = Boolean(cert.pdf_url);

            return (
              <button
                key={cert.id}
                type="button"
                onClick={() => openCertModal(cert)}
                className="group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-md"
              >
                {/* Certificate Preview Card */}
                <div className="aspect-[4/3] relative rounded-md border border-border overflow-hidden bg-surface">
                  {hasImage ? (
                    <Image
                      src={cert.image_url!}
                      alt={`Certificate: ${cert.title}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                    />
                  ) : hasPdf ? (
                    <PdfPagePreview pdfUrl={cert.pdf_url!} title={cert.title} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-foreground-muted">
                      <FileText className="w-8 h-8 mb-2" strokeWidth={1.5} />
                      <span className="text-xs">Document</span>
                    </div>
                  )}

                  {/* Format tag */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-background/90 text-foreground">
                      {hasPdf && hasImage ? 'JPEG + PDF' : hasPdf ? 'PDF' : 'JPEG'}
                    </span>
                  </div>
                </div>

                {/* Details below card */}
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-foreground line-clamp-1">
                    {cert.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-foreground-muted">
                    {cert.issuer}
                  </p>
                  <p className="mt-0.5 text-xs font-mono text-foreground-muted">
                    {cert.year}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Certificate Lightbox / Viewer */}
      {activeCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-viewer-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs"
          onClick={closeCertModal}
        >
          <div
            className="w-full max-w-3xl max-h-[92vh] bg-background border border-border rounded-lg overflow-y-auto p-6 sm:p-8 space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between">
              <div>
                <h3
                  id="cert-viewer-title"
                  className="text-lg sm:text-xl font-semibold text-foreground tracking-tight"
                >
                  {activeCert.title}
                </h3>
                <p className="text-xs text-foreground-muted mt-0.5">
                  {activeCert.issuer} · {activeCert.year}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Zoom Controls */}
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.5, 3))}
                  aria-label="Zoom in"
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors"
                >
                  <ZoomIn className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.5, 1))}
                  aria-label="Zoom out"
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors"
                >
                  <ZoomOut className="w-4 h-4" strokeWidth={1.5} />
                </button>
                {zoomLevel !== 1 && (
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    aria-label="Reset zoom"
                    className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                )}
                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeCertModal}
                  aria-label="Close certificate viewer"
                  className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md border border-border hover:border-foreground text-foreground transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Certificate Large Preview Area */}
            <div className="aspect-[4/3] sm:aspect-[16/11] relative rounded-md border border-border overflow-auto bg-surface flex items-center justify-center">
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 150ms ease-out',
                }}
                className={`relative w-full h-full flex items-center justify-center ${
                  zoomLevel === 1 ? 'cursor-zoom-in' : 'cursor-zoom-out'
                }`}
                onClick={toggleZoom}
              >
                {activeCert.image_url ? (
                  <Image
                    src={activeCert.image_url}
                    alt={`Certificate: ${activeCert.title}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-contain"
                    priority
                  />
                ) : activeCert.pdf_url ? (
                  <PdfPagePreview pdfUrl={activeCert.pdf_url} title={activeCert.title} />
                ) : (
                  <div className="p-8 text-center text-foreground-muted">
                    <FileText className="w-12 h-12 mx-auto mb-3" strokeWidth={1.5} />
                    <p className="text-sm">No preview file available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: View PDF & Download PDF (hidden if only JPEG) */}
            {activeCert.pdf_url && (
              <div className="pt-2 border-t border-border flex flex-wrap items-center justify-end gap-3">
                <a
                  href={activeCert.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] px-4 py-2 rounded-md border border-border text-foreground hover:border-foreground text-xs font-medium inline-flex items-center space-x-2 transition-colors"
                >
                  <FileText className="w-4 h-4" strokeWidth={1.5} />
                  <span>View PDF</span>
                </a>
                <a
                  href={activeCert.pdf_url}
                  download={`${activeCert.title}.pdf`}
                  className="min-h-[44px] px-4 py-2 rounded-md bg-foreground text-background hover:opacity-90 text-xs font-medium inline-flex items-center space-x-2 transition-opacity"
                >
                  <Download className="w-4 h-4" strokeWidth={1.5} />
                  <span>Download PDF</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
