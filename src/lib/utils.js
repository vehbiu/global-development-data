/**
 * @param {Array<any>} array
 * @param {number} pageSize
 * @param {number} pageNumber
 * @returns {Array<any>}
 */
export function paginate(array, pageSize, pageNumber) {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

/**
 * @param {any} value
 * @returns {string | number}
 */
export function formatValue(value) {
    if (typeof value !== 'number') return value;
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    return value.toFixed(2);
}
