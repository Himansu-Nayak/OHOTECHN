import { defineTheme } from '@astryxdesign/core';

/**
 * OHO TECH Enterprise Brand Theme for Astryx v0.7.1
 * 
 * Maps OHO TECH design tokens to Astryx component system:
 * - Brand Deep Studio Dark: #0d0d0e / #0a0f1d
 * - Page Background: #f7f7f5 / #090d16
 * - Surface Cards: #ffffff / #0f172a
 * - Primary Brand Indigo: #4f46e5 / #6366f1
 * - Sapphire Accent: #2563eb / #3b82f6
 * - Purple Accent: #7c3aed / #8b5cf6
 * - Emerald Success: #059669 / #10b981
 * - Crisp High-Contrast Typography & Container Borders
 */
export const ohotechTheme = defineTheme({
  name: 'ohotech',
  tokens: {
    // Colors - Page & Surfaces
    '--color-background-body': ['#f7f7f5', '#090d16'],
    '--color-background-surface': ['#ffffff', '#0f172a'],
    '--color-background-card': ['#ffffff', '#111827'],
    '--color-background-muted': ['#f1f5f9', '#1e293b'],

    // Text & Hierarchy
    '--color-text-primary': ['#0d0d0e', '#f8fafc'],
    '--color-text-secondary': ['#475569', '#94a3b8'],
    '--color-text-accent': ['#4f46e5', '#818cf8'],

    // Interactive & Brand Accents
    '--color-accent': ['#4f46e5', '#6366f1'],
    '--color-accent-muted': ['#eef2ff', '#1e1b4b'],

    // Borders & Dividers
    '--color-border': ['rgba(0, 0, 0, 0.08)', 'rgba(255, 255, 255, 0.12)'],
    '--color-border-emphasized': ['rgba(0, 0, 0, 0.18)', 'rgba(255, 255, 255, 0.25)'],

    // Status Feedback
    '--color-success': ['#059669', '#10b981'],
    '--color-warning': ['#d97706', '#f59e0b'],
    '--color-error': ['#e11d48', '#f43f5e'],

    // Geometry & Radius
    '--radius-inner': '6px',
    '--radius-element': '10px',
    '--radius-container': '16px',
    '--radius-page': '24px',
    '--radius-full': '9999px',
  },
});
