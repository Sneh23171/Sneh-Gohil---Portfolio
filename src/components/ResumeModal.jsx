import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
} from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function ResumeModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derive preview and direct download links from the Drive URL
  const driveIdMatch = personalInfo.resumeUrl?.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const fileId = driveIdMatch ? driveIdMatch[1] : '1RtT-4cBQOhEHyZP0LcpbjQcOmi399PRf';

  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset loading state when opened
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
        >
          {/* Backdrop with solid blur to bring modal cleanly to front */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card - sits in front of all page headers/navbars */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[88vh] max-h-[900px] bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex flex-col z-10"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200/90 dark:border-neutral-800 bg-slate-50/90 dark:bg-neutral-900/95 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-white/10 flex items-center justify-center text-blue-600 dark:text-white shrink-0 border border-blue-500/20 dark:border-white/10 shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2
                      id="resume-modal-title"
                      className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate"
                    >
                      {personalInfo.name} — Resume
                    </h2>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Live Preview
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 truncate">
                    {personalInfo.role} • Updated 2026
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Download Direct */}
                <a
                  href={directDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold text-xs transition-colors shadow-sm cursor-pointer"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>

                {/* Open in Drive */}
                <a
                  href={personalInfo.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 font-medium text-xs transition-colors border border-slate-200 dark:border-neutral-700 cursor-pointer"
                  title="Open in Google Drive"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden md:inline">Open in Drive</span>
                </a>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors ml-1 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="relative flex-1 bg-slate-100 dark:bg-neutral-950 overflow-hidden">
              {/* Loading Spinner */}
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/85 dark:bg-neutral-950/85 backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 text-blue-600 dark:text-white animate-spin" />
                  <div className="text-sm font-medium text-slate-600 dark:text-neutral-400">
                    Loading resume preview...
                  </div>
                </div>
              )}

              {/* PDF Preview Iframe */}
              <iframe
                src={previewUrl}
                title="Resume Preview"
                className="w-full h-full border-0"
                allow="autoplay"
                onLoad={() => setIsLoading(false)}
              />
            </div>

            {/* Footer Bar */}
            <div className="px-4 sm:px-6 py-3 bg-slate-50/95 dark:bg-neutral-900/95 border-t border-slate-200/90 dark:border-neutral-800 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400 shrink-0">
              {/* Left info */}
              <div className="text-slate-500 dark:text-neutral-400 text-xs">
                <span>Open for freelance & full-time opportunities</span>
              </div>

              {/* Right CTA / Exit helper */}
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="#contact"
                  onClick={onClose}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Me</span>
                </a>
                <span className="hidden sm:inline text-slate-300 dark:text-neutral-700">|</span>
                <span className="hidden sm:inline text-[11px] text-slate-400 dark:text-neutral-500">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-neutral-800 font-mono text-[10px]">ESC</kbd> to exit
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
