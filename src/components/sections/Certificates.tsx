'use client';

import React, { useState } from 'react';
import { CertificateItem, PortfolioData } from '@/types/portfolio';
import { FileText, Download, X, ExternalLink, ShieldCheck, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CertificatesProps {
  data: PortfolioData['certificates'];
}

export function Certificates({ data }: CertificatesProps) {
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);

  const openCertModal = (cert: CertificateItem) => {
    setActiveCert(cert);
    document.body.classList.add('modal-open');
  };

  const closeCertModal = () => {
    setActiveCert(null);
    document.body.classList.remove('modal-open');
  };

  const visibleCerts = data.items.filter((item) => item.visible !== false);

  return (
    <section aria-labelledby="certificates-title" className="py-24 md:py-36 border-b border-hairline" id="certificates">
      <div className="max-w-7xl mx-auto px-6">
        {/* Specimen Index Header */}
        <div className="flex items-center space-x-3 mb-10 text-xs font-mono">
          <span className="text-accent font-bold">[{data.index_meta}]</span>
          <span className="uppercase tracking-widest text-foreground-muted">{data.label}</span>
          <span className="h-[1px] flex-1 bg-hairline" />
          <span className="text-foreground-muted uppercase">VERIFIED CREDENTIALS</span>
        </div>

        <div className="max-w-3xl mb-16">
          <h2 id="certificates-title" className="specimen-title text-foreground mb-4">
            {data.title}
          </h2>
          <p className="body-reading text-foreground-muted">
            {data.lede}
          </p>
        </div>

        {/* Dynamic Fanned Deck / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleCerts.map((cert, index) => (
            <motion.article
              key={cert.id}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => openCertModal(cert)}
              className="group relative p-8 border border-hairline bg-background hover:border-accent/60 transition-all duration-300 cursor-pointer flex flex-col justify-between crosshair-corner shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-8">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 border border-hairline bg-background-alt text-accent font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>VERIFIED</span>
                  </span>
                  <span className="text-foreground-muted font-bold">{cert.year}</span>
                </div>

                <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors leading-snug mb-3">
                  {cert.title}
                </h3>

                <p className="text-xs font-mono text-foreground-muted leading-relaxed">
                  {cert.issuer}
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-hairline flex items-center justify-between text-xs font-mono text-foreground-muted group-hover:text-foreground">
                <span className="flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-accent" />
                  <span>INSPECT PDF</span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Fullscreen Document Inspection Modal */}
      <AnimatePresence>
        {activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
            onClick={closeCertModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl w-full h-[88vh] flex flex-col bg-background border border-hairline shadow-2xl overflow-hidden crosshair-corner"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-background">
                <div>
                  <h3 id="cert-modal-title" className="text-base font-bold text-foreground">
                    {activeCert.title}
                  </h3>
                  <p className="text-xs text-foreground-muted font-mono">
                    {activeCert.issuer} · {activeCert.year}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <a
                    href={activeCert.pdf_url}
                    download
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono uppercase border border-hairline bg-foreground text-background hover:bg-accent transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                  <button
                    type="button"
                    onClick={closeCertModal}
                    aria-label="Close modal"
                    className="p-1.5 text-foreground-muted hover:text-foreground border border-hairline"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PDF Viewer Frame */}
              <div className="flex-1 bg-background-alt w-full h-full relative">
                <iframe
                  src={`${activeCert.pdf_url}#view=FitH`}
                  title={activeCert.title}
                  className="w-full h-full border-0"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
