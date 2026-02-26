/**
 * Sleep utility — pauses async execution for the given duration.
 * Used by all sorting algorithms to create visualization delays.
 * @param {number} ms - milliseconds to sleep
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
