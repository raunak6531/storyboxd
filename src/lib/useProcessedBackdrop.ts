'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { processImageWithFilters } from './processImage';

interface UseProcessedBackdropProps {
    originalUrl: string | null | undefined;
    customBackdropUrl: string | null;
    blur: number;
    brightness: number;
    saturation: number;
}

/**
 * Hook to manage canvas-processed backdrop images.
 * Automatically re-processes when filters change (debounced).
 */
export function useProcessedBackdrop({
    originalUrl,
    customBackdropUrl,
    blur,
    brightness,
    saturation,
}: UseProcessedBackdropProps) {
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const processingRef = useRef<number>(0);

    // Determine source URL
    const sourceUrl = customBackdropUrl || originalUrl || null;

    // Check if filters are applied.
    // CRITICAL FIX: If the sourceUrl is an external HTTP URL (like TMDB), it ALWAYS needs processing
    // so it gets fetched via our proxy and converted to a local Base64 canvas data URL.
    // Otherwise, html2canvas on mobile Chrome/Safari will fail to render it due to cross-origin CSS background rules.
    const hasFilters = blur > 0 || brightness !== 100 || saturation !== 100;
    const isExternalUrl = typeof sourceUrl === 'string' && sourceUrl.startsWith('http') && !sourceUrl.startsWith('blob:') && !sourceUrl.startsWith('data:');
    const needsProcessing = hasFilters || isExternalUrl;

    const processImage = useCallback(async () => {
        if (!sourceUrl) {
            setProcessedUrl(null);
            return;
        }

        // If no filters applied AND it's a local/safe URL (like an uploaded base64 data URI), use original URL
        if (!needsProcessing) {
            setProcessedUrl(null);
            return;
        }

        // Handle gradient backgrounds (don't process)
        if (sourceUrl.includes('gradient')) {
            setProcessedUrl(null);
            return;
        }

        const currentProcess = ++processingRef.current;
        setIsProcessing(true);

        try {
            // Add proxy for external URLs
            let urlToProcess = sourceUrl;
            if (sourceUrl.startsWith('http') && !sourceUrl.startsWith('blob:') && !sourceUrl.startsWith('data:')) {
                urlToProcess = `/api/proxy-image?url=${encodeURIComponent(sourceUrl)}`;
            }

            const result = await processImageWithFilters(
                urlToProcess,
                blur,
                brightness,
                saturation,
                1.0 // Scale factor (1.0 = native resolution, ensures no quality loss)
            );

            // Only update if this is still the current process
            if (currentProcess === processingRef.current) {
                setProcessedUrl(result);
            }
        } catch (err) {
            console.error('Failed to process image:', err);
            // Fall back to null (will use CSS filters in preview)
            if (currentProcess === processingRef.current) {
                setProcessedUrl(null);
            }
        } finally {
            if (currentProcess === processingRef.current) {
                setIsProcessing(false);
            }
        }
    }, [sourceUrl, blur, brightness, saturation, needsProcessing]);

    // Debounced processing effect
    useEffect(() => {
        const timeout = setTimeout(() => {
            processImage();
        }, 300); // 300ms debounce

        return () => clearTimeout(timeout);
    }, [processImage]);

    return {
        // Return processed URL if available, otherwise null (templates will use CSS fallback)
        processedBackdropUrl: processedUrl,
        isProcessing,
        // If we have a processed URL, templates should NOT apply CSS filters
        filtersApplied: processedUrl !== null,
    };
}
