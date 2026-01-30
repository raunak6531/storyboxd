'use client';

/**
 * Process an image using canvas to apply blur, brightness, and saturation filters.
 * This creates a new image with the filters baked in, which html2canvas can properly capture.
 */
export async function processImageWithFilters(
    imageUrl: string,
    blur: number = 0,
    brightness: number = 100,
    saturation: number = 100,
    scale: number = 0.5 // Scale down for performance
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            try {
                // Create canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Scale dimensions for performance
                const width = Math.round(img.width * scale);
                const height = Math.round(img.height * scale);

                canvas.width = width;
                canvas.height = height;

                // Apply filters using canvas filter property
                // Note: blur needs to be scaled too
                const scaledBlur = Math.round(blur * scale);
                ctx.filter = `blur(${scaledBlur}px) brightness(${brightness}%) saturate(${saturation}%)`;

                // Draw the image with filters applied
                ctx.drawImage(img, 0, 0, width, height);

                // Export as data URL
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                resolve(dataUrl);
            } catch (err) {
                reject(err);
            }
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        // Handle proxied URLs
        img.src = imageUrl;
    });
}

/**
 * Debounce helper for processing
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
