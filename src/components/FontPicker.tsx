'use client';

import { useState, useEffect, useMemo } from 'react';
import { POPULAR_GOOGLE_FONTS, FONT_CATEGORIES, GoogleFont } from '@/lib/googleFontsList';

interface FontPickerProps {
    currentFont: string;
    onFontSelect: (font: string) => void;
}

export default function FontPicker({ currentFont, onFontSelect }: FontPickerProps) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter fonts
    const filteredFonts = useMemo(() => {
        return POPULAR_GOOGLE_FONTS.filter(font => {
            const matchesCategory = selectedCategory === 'All' ||
                (selectedCategory === 'Sans Serif' && font.category === 'sans-serif') ||
                (selectedCategory === 'Serif' && font.category === 'serif') ||
                (selectedCategory === 'Display' && font.category === 'display') ||
                (selectedCategory === 'Handwriting' && font.category === 'handwriting') ||
                (selectedCategory === 'Monospace' && font.category === 'monospace');

            const matchesSearch = font.family.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    // Load preview fonts (lazy load only visible ones? Or batch load)
    // For 50 fonts, we can batch load them in one request or a few.
    useEffect(() => {
        // We'll load the Regular (400) weight for previews to keep it light
        const families = POPULAR_GOOGLE_FONTS.map(f => f.family.replace(/\s+/g, '+'));

        // Chunk into groups of 20 to avoid URL length limits
        const chunkSize = 20;
        for (let i = 0; i < families.length; i += chunkSize) {
            const chunk = families.slice(i, i + chunkSize);
            const fontRequest = chunk.map(f => `family=${f}:wght@400`).join('&');

            const linkId = `google-fonts-preview-${i}`;
            if (!document.getElementById(linkId)) {
                const link = document.createElement('link');
                link.id = linkId;
                link.href = `https://fonts.googleapis.com/css2?${fontRequest}&display=swap`;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
        }
    }, []);

    return (
        <div className="flex flex-col gap-4">
            {/* Search and Category Filter */}
            <div className="flex flex-col gap-2">
                <input
                    type="text"
                    placeholder="Search fonts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#333] text-white px-3 py-2 rounded-lg text-sm border border-[#444] focus:border-[#00e054] outline-none"
                />

                <div className="flex flex-wrap gap-2">
                    {FONT_CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat
                                    ? 'bg-[#00e054] text-black'
                                    : 'bg-[#222] text-zinc-400 hover:bg-[#333]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {filteredFonts.map((font) => (
                    <button
                        key={font.family}
                        onClick={() => onFontSelect(font.family)}
                        className={`p-3 rounded-lg border text-left transition-all ${currentFont === font.family
                                ? 'bg-[#222] border-[#00e054]'
                                : 'bg-[#1a1a1a] border-[#333] hover:border-[#555]'
                            }`}
                    >
                        <div className="text-xs text-zinc-500 mb-1">{font.family}</div>
                        <div
                            style={{ fontFamily: font.family, fontSize: '18px' }}
                            className="text-white truncate"
                        >
                            Storyboxd
                        </div>
                    </button>
                ))}

                {filteredFonts.length === 0 && (
                    <div className="col-span-2 text-center text-zinc-500 py-4 text-sm">
                        No fonts found
                    </div>
                )}
            </div>
        </div>
    );
}
