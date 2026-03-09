/**
 * Format currency to Rupiah format
 * Per PUEBI: Rp (tanpa titik) diikuti langsung nominal tanpa spasi
 * Contoh: Rp10000, Rp50000, Rp1.500.000, Rp50.000,00
 * 
 * @param {number|string} value - The amount to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.showDecimal - Whether to show decimal places (default: false)
 * @param {boolean} options.useCurrencyCode - Whether to use IDR instead of Rp (default: false)
 * @returns {string} Formatted Rupiah string
 */
export function formatRupiah(value, options = {}) {
    const { showDecimal = false, useCurrencyCode = false } = options;
    
    if (value === null || value === undefined || value === '') {
        return useCurrencyCode ? 'IDR 0' : 'Rp0';
    }
    
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) {
        return useCurrencyCode ? 'IDR 0' : 'Rp0';
    }
    
    const prefix = useCurrencyCode ? 'IDR ' : 'Rp';
    
    if (showDecimal) {
        // Format with 2 decimal places
        const formatted = num.toLocaleString('id-ID', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return prefix + formatted;
    } else {
        // Format without decimal places
        const formatted = Math.floor(num).toLocaleString('id-ID');
        return prefix + formatted;
    }
}

/**
 * Parse Rupiah string back to number
 * Removes Rp prefix, dots, and other non-numeric characters
 * 
 * @param {string} value - The Rupiah string to parse
 * @returns {number} Parsed number value
 */
export function parseRupiah(value) {
    if (!value) return 0;
    
    // Remove Rp, IDR, spaces, dots, and commas
    const cleaned = value.toString()
        .replace(/^Rp/i, '')
        .replace(/^IDR\s?/i, '')
        .replace(/\./g, '')
        .replace(/,/g, '.');
    
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

/**
 * Format number for input display (allows typing)
 * @param {string|number} value - Raw input value (can be decimal from DB)
 * @returns {string} Formatted Rupiah string for display
 */
export function formatRupiahInput(value) {
    if (!value && value !== 0) return '';
    
    // Handle decimal numbers from database
    const num = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num) || num === 0) return '';
    
    // Format with Indonesian locale (dots for thousands, comma for decimals)
    return 'Rp' + num.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

/**
 * Parse input value back to raw number string
 * Handles both user input and formatted values
 * @param {string} value - Display value
 * @returns {string} Raw number string (decimal supported)
 */
export function parseRupiahInput(value) {
    if (!value) return '';
    
    // Remove Rp prefix
    let cleaned = value.toString().replace(/^Rp/i, '');
    
    // Convert Indonesian format to standard decimal
    // Remove dots (thousands separator), replace comma with dot (decimal separator)
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    
    // Extract numeric value
    const match = cleaned.match(/[\d.]+/);
    return match ? match[0] : '';
}