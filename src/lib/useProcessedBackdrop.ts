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

    // Check if filters are at default values (no processing needed)
    const needsProcessing = blur > 0 || brightness !== 100 || saturation !== 100;

    const processImage = useCallback(async () => {
        if (!sourceUrl) {
            setProcessedUrl(null);
            return;
        }

        // If no filters applied, use original URL
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
                0.5 // Scale factor for performance
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
