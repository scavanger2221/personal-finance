import { motion } from 'framer-motion';

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
        <motion.div
            key={resultsKey}
            className={`overflow-hidden ${className}`}
            animate={{ opacity: isLoading ? 0.72 : 1 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
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
            className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-border cursor-pointer hover:text-gray-300 transition-colors select-none ${alignClass} ${className}`}
        >
            <span className={flexClass}>
                {children} <SortIcon field={field} />
            </span>
        </th>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`group bg-surfaceHighlight/30 hover:bg-surfaceHighlight/80 transition-colors ${className}`}
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
        <div className="py-24 flex flex-col items-center justify-center text-gray-500">
            <Icon className="w-20 h-20 opacity-10 mb-6" />
            <p className="text-xl font-display text-gray-400">{title}</p>
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
        <div className={`flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ${className}`}>
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
    color = 'indigo',
    disabled = false,
    title,
    className = '' 
}) {
    const colorClasses = {
        indigo: 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10',
        rose: 'text-gray-400 hover:text-rose-400 hover:bg-rose-500/10',
        gray: 'text-gray-600 cursor-not-allowed',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-lg transition-colors ${colorClasses[color]} ${className}`}
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
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <SearchIcon className="w-5 h-5" />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full pl-12 pr-12 py-3 bg-surface border border-border rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors duration-200"
            />
            {value && !isLoading && (
                <button
                    onClick={onClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1.5 hover:bg-surfaceHighlight rounded-lg"
                >
                    <ClearIcon className="w-4 h-4" />
                </button>
            )}
            {isLoading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
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
        <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md font-medium">
                {count}
            </span>
            <span>{label}</span>
        </div>
    );
}
