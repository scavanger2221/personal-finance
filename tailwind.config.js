import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            colors: {
                // CSS Variable-based colors for theme switching
                background: 'var(--color-bg)',
                surface: 'var(--color-surface)',
                'surface-elevated': 'var(--color-surface-elevated)',
                
                border: 'var(--color-border)',
                'border-strong': 'var(--color-border-strong)',
                
                'text-primary': 'var(--color-text-primary)',
                'text-secondary': 'var(--color-text-secondary)',
                'text-tertiary': 'var(--color-text-tertiary)',
                'text-disabled': 'var(--color-text-disabled)',
                
                accent: 'var(--color-accent)',
                'accent-hover': 'var(--color-accent-hover)',
                success: 'var(--color-success)',
                danger: 'var(--color-danger)',
                warning: 'var(--color-warning)',
            },
            spacing: {
                '1': '4px',
                '2': '8px',
                '3': '12px',
                '4': '16px',
                '5': '20px',
                '6': '24px',
                '8': '32px',
                '10': '40px',
            },
            maxWidth: {
                'container': '1200px',
            },
            borderRadius: {
                'card': '8px',
                'button': '6px',
                'input': '6px',
            },
            transitionDuration: {
                'fast': '150ms',
                'normal': '200ms',
                'slow': '300ms',
            },
            transitionTimingFunction: {
                'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'enter': 'cubic-bezier(0, 0, 0.2, 1)',
                'exit': 'cubic-bezier(0.4, 0, 1, 1)',
            },
        },
    },

    plugins: [forms],
};
