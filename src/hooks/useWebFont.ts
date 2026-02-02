import { useEffect } from 'react';

export function useWebFont(fontFamily: string) {
    useEffect(() => {
        if (!fontFamily) return;

        // Skip built-in presets that are mapped to system/local vars, 
        // unless they are actual Google Fonts we want to support explicitly.
        // However, our presets like 'sans' map to Inter var, which is local.
        // 'marker' maps to 'Permanent Marker' which is a Google Font, so we might need to load it if not locally available.
        // But currently shared.tsx handles presets via CSS variables which are assumed loaded in layout.

        if (['sans', 'serif', 'mono', 'courier', 'marker', 'anton'].includes(fontFamily)) {
            return;
        }

        // Check if stylesheet already exists
        const fontId = `storyboxd-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
        if (document.getElementById(fontId)) return;

        const link = document.createElement('link');
        link.id = fontId;
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@300;400;500;700;900&display=swap`;
        link.rel = 'stylesheet';

        document.head.appendChild(link);

        // No cleanup - keep fonts loaded for performance when switching back
    }, [fontFamily]);
}
