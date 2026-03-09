import { motion } from 'framer-motion';
import TextInput from '@/Components/TextInput';
import React from 'react';

const rowVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
        opacity: 1,
        transition: {
            delay: i * 0.02,
            duration: 0.2,
            ease: [0.4, 0, 0.2, 1]
        }
    })
};

/**
 * Table wrapper component with loading animation
 * @param {Object} props
 * @param {React.ReactNode} props.children - Table content
 * @param {boolean} props.isLoading - Whether the table is loading
 * @param {string} props.resultsKey - Unique key for forcing re-render on data change
 * @param {string} props.className - Additional CSS classes
 */
export function TableWrapper({ children, isLoading, resultsKey, className = '' }) {
    return (
        <div
            key={resultsKey}
            className={`overflow-hidden transition-opacity duration-200 ${isLoading ? 'opacity-70' : 'opacity-100'} ${className}`}
        >
            {children}
        </div>
    );
}

/**
 * Sortable table header component
 * @param {Object} props
 * @param {string} props.field - The sort field name
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Header content
 * @param {React.Component} props.SortIcon - Sort icon component
 * @param {string} props.align - Text alignment ('left' or 'right')
 * @param {string} props.className - Additional CSS classes
 */
export function SortableHeader({ 
    field, 
    onClick, 
    children, 
    SortIcon, 
    align = 'left',
    className = '' 
}) {
    const alignClass = align === 'right' ? 'text-right' : '';
    const flexClass = align === 'right' ? 'flex items-center justify-end gap-1' : 'flex items-center gap-1';

    return (
        <th
            onClick={() => onClick(field)}
            className={`px-4 py-3 text-xs font-medium text-text-tertiary tracking-wider border-b border-border cursor-pointer hover:text-text-primary transition-colors duration-200 select-none ${alignClass} ${className}`}
        >
            <span className={flexClass}>
                {children} <SortIcon field={field} />
            </span>
        </th>
    );
}

/**
 * Table cell component with automatic border styling
 * @param {Object} props
 * @param {React.ReactNode} props.children - Cell content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.last - Whether this is the last cell in the row (no right border)
 * @param {string} props.align - Text alignment ('left' | 'center' | 'right')
 */
export function TableCell({ children, className = '', align = 'left' }) {
    const alignClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    return (
        <td className={`px-4 py-3 whitespace-nowrap text-sm ${alignClasses[align]} ${className}`}>
            {children}
        </td>
    );
}

/**
 * Animated table row component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Row content
 * @param {number} props.index - Row index for stagger animation
 * @param {string} props.className - Additional CSS classes
 */
export function AnimatedTableRow({ children, index, className = '' }) {
    return (
        <motion.tr
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            className={`group hover:bg-surface-elevated/50 transition-colors duration-200 ${className}`}
        >
            {children}
        </motion.tr>
    );
}

/**
 * Empty state component for tables
 * @param {Object} props
 * @param {React.Component} props.icon - Icon component
 * @param {string} props.title - Empty state title
 * @param {string} props.description - Empty state description
 */
export function EmptyTableState({ icon: Icon, title, description }) {
    return (
        <div className="py-24 flex flex-col items-center justify-center text-text-tertiary">
            <Icon className="w-20 h-20 opacity-20 mb-6" />
            <p className="text-xl font-semibold text-text-secondary">{title}</p>
            <p className="text-sm mt-2">{description}</p>
        </div>
    );
}

/**
 * Action buttons container with hover reveal
 * @param {Object} props
 * @param {React.ReactNode} props.children - Action buttons
 * @param {string} props.className - Additional CSS classes
 */
export function TableActions({ children, className = '' }) {
    return (
        <div className={`flex justify-end space-x-2 ${className}`}>
            {children}
        </div>
    );
}

/**
 * Action button component
 * @param {Object} props
 * @param {Function} props.onClick - Click handler
 * @param {React.Component} props.icon - Icon component
 * @param {string} props.color - Color theme ('indigo' | 'rose' | 'gray')
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {string} props.title - Button title/tooltip
 * @param {string} props.className - Additional CSS classes
 */
export function TableActionButton({ 
    onClick, 
    icon: Icon, 
    color = 'accent',
    disabled = false,
    title,
    className = '' 
}) {
    const colorClasses = {
        accent: 'text-text-tertiary hover:text-text-primary hover:bg-surface-elevated',
        danger: 'text-text-tertiary hover:text-danger hover:bg-danger/10',
        gray: 'text-text-disabled cursor-not-allowed',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-button transition-colors duration-200 ${colorClasses[color]} ${className}`}
        >
            <Icon size={16} />
        </button>
    );
}

/**
 * Search input component with clear button and spinner
 * @param {Object} props
 * @param {string} props.value - Search value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onClear - Clear handler
 * @param {boolean} props.isLoading - Whether search is loading
 * @param {string} props.placeholder - Placeholder text
 * @param {React.Component} props.searchIcon - Search icon component
 * @param {React.Component} props.clearIcon - Clear icon component
 */
export function SearchInput({ 
    value, 
    onChange, 
    onClear, 
    isLoading,
    placeholder = 'Search...',
    searchIcon: SearchIcon,
    clearIcon: ClearIcon,
}) {
    return (
        <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
                <SearchIcon className="w-5 h-5" />
            </div>
            <TextInput
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full pl-10 pr-10"
            />
            {value && !isLoading && (
                <button
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors duration-200 p-1 hover:bg-surface-elevated rounded"
                >
                    <ClearIcon className="w-4 h-4" />
                </button>
            )}
            {isLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-border-strong border-t-accent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}

/**
 * Results count display component
 * @param {Object} props
 * @param {number} props.count - Results count
 * @param {string} props.label - Label text
 * @param {boolean} props.visible - Whether to show the component
 */
export function ResultsCount({ count, label = 'results found', visible = true }) {
    if (!visible) return null;

    return (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span className="px-2 py-1 bg-surface-elevated text-text-primary rounded-md font-medium">
                {count}
            </span>
            <span>{label}</span>
        </div>
    );
}