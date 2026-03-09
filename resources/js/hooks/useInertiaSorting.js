import { useCallback } from 'react';
import { router } from '@inertiajs/react';

/**
 * Hook for managing table sorting
 * @param {Object} options
 * @param {Object} options.filters - Current filters from props  
 * @param {string} options.routeName - The route name to navigate to
 * @param {string} options.defaultSort - Default sort field
 * @param {string} options.defaultDirection - Default sort direction ('asc' or 'desc')
 * @param {Array} options.only - Array of data keys to refresh (default: ['data', 'filters'])
 * @returns {Object} Sorting state and handlers
 */
export function useInertiaSorting({ 
    filters,
    routeName,
    defaultSort = 'name',
    defaultDirection = 'asc',
    only = ['data', 'filters'],
}) {
    const currentSort = filters?.sort || defaultSort;
    const currentDirection = filters?.direction || defaultDirection;

    const handleSort = useCallback((field) => {
        const newDirection = currentSort === field && currentDirection === 'asc' ? 'desc' : 'asc';

        router.get(
            route(routeName),
            {
                ...filters,
                sort: field,
                direction: newDirection,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only,
            }
        );
    }, [currentSort, currentDirection, filters, routeName, only]);

    const SortIcon = useCallback(({ field }) => {
        if (currentSort !== field) {
            return <span className="inline-block w-3 h-3 text-gray-600 opacity-50">↕</span>;
        }
        return <span className="inline-block w-3 h-3 text-indigo-400">{currentDirection === 'asc' ? '↑' : '↓'}</span>;
    }, [currentSort, currentDirection]);

    return {
        currentSort,
        currentDirection,
        handleSort,
        SortIcon,
    };
}
