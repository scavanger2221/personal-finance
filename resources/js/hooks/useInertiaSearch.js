import { useState, useEffect, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';

/**
 * Hook for managing search functionality with debouncing
 * @param {Object} options
 * @param {Object} options.filters - Current filters from props
 * @param {string} options.routeName - The route name to navigate to
 * @param {number} options.searchDelay - Delay before triggering search (default: 450ms)
 * @param {number} options.spinnerDelay - Delay before showing spinner (default: 150ms)
 * @param {Function} options.buildParams - Function to build query params from search query
 * @returns {Object} Search state and handlers
 */
export function useInertiaSearch({ 
    filters,
    routeName,
    searchDelay = 450,
    spinnerDelay = 150,
    buildParams,
}) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const lastSubmittedSearch = useRef((filters?.search || '').trim());
    const spinnerTimeoutId = useRef(null);

    const performSearch = useCallback((search, additionalParams = {}) => {
        const normalizedSearch = search.trim();
        lastSubmittedSearch.current = normalizedSearch;

        const params = buildParams ? buildParams(normalizedSearch, additionalParams) : 
            (normalizedSearch ? { search: normalizedSearch, ...additionalParams } : additionalParams);

        router.get(
            route(routeName),
            params,
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onStart: () => {
                    spinnerTimeoutId.current = window.setTimeout(() => setIsSearching(true), spinnerDelay);
                },
                onFinish: () => {
                    window.clearTimeout(spinnerTimeoutId.current);
                    setIsSearching(false);
                },
            }
        );
    }, [routeName, buildParams, spinnerDelay]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const normalizedQuery = searchQuery.trim();
            const currentSearch = lastSubmittedSearch.current;

            if (normalizedQuery !== currentSearch) {
                performSearch(normalizedQuery);
            }
        }, searchDelay);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, performSearch, searchDelay]);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        performSearch('');
    }, [performSearch]);

    return {
        searchQuery,
        setSearchQuery,
        isSearching,
        clearSearch,
        lastSubmittedSearch: lastSubmittedSearch.current,
        performSearch,
    };
}
