import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/Contexts/ThemeContext';

export default function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`p-2 rounded-button transition-colors duration-200 ${
                theme === 'dark'
                    ? 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
            } ${className}`}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
}
