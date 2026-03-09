import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
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
                // Background colors
                background: '#0F0F0F',
                surface: '#141414',
                'surface-elevated': '#1A1A1A',
                
                // Border colors
                border: '#262626',
                'border-strong': '#333333',
                
                // Text colors
                'text-primary': '#FAFAFA',
                'text-secondary': '#A3A3A3',
                'text-tertiary': '#737373',
                'text-disabled': '#525252',
                
                // Accent colors
                accent: '#E5E5E5',
                'accent-hover': '#FFFFFF',
                success: '#22C55E',
                danger: '#EF4444',
                warning: '#F59E0B',
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
