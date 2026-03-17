/**
 * Generates a snapshot of the current session
 * @param {string} originalUri - Path to the original file
 * @param {Object} settings - The current filter values (exposure, contrast, etc.)
 */
export const createEditManifest = (originalUri, settings) => {
    return {
        manifestId: `manifest_${Date.now()}`,
        timestamp: new Date().toISOString(),
        assetSource: originalUri,
        // We only store the math, not the modified pixels, to save space and allow for future re-edits
        adjustments: { ...settings },
        exportSettings: {
            format: 'png',
            quality: 0.9
        }
    };
};