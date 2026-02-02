export interface GoogleFont {
    family: string;
    category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
}

export const POPULAR_GOOGLE_FONTS: GoogleFont[] = [
    // Sans Serif
    { family: 'Roboto', category: 'sans-serif' },
    { family: 'Open Sans', category: 'sans-serif' },
    { family: 'Lato', category: 'sans-serif' },
    { family: 'Montserrat', category: 'sans-serif' },
    { family: 'Poppins', category: 'sans-serif' },
    { family: 'Inter', category: 'sans-serif' },
    { family: 'Oswald', category: 'sans-serif' },
    { family: 'Raleway', category: 'sans-serif' },
    { family: 'Nunito', category: 'sans-serif' },
    { family: 'Rubik', category: 'sans-serif' },

    // Serif
    { family: 'Playfair Display', category: 'serif' },
    { family: 'Merriweather', category: 'serif' },
    { family: 'Lora', category: 'serif' },
    { family: 'PT Serif', category: 'serif' },
    { family: 'Roboto Slab', category: 'serif' },
    { family: 'Cinzel', category: 'serif' },
    { family: 'Prata', category: 'serif' },
    { family: 'Libre Baskerville', category: 'serif' },

    // Display
    { family: 'Bebas Neue', category: 'display' },
    { family: 'Anton', category: 'display' },
    { family: 'Lobster', category: 'display' },
    { family: 'Pacifico', category: 'display' },
    { family: 'Abril Fatface', category: 'display' },
    { family: 'Righteous', category: 'display' },
    { family: 'Bangers', category: 'display' },
    { family: 'Orbitron', category: 'display' },
    { family: 'Press Start 2P', category: 'display' },
    { family: 'Unbounded', category: 'display' },

    // Handwriting
    { family: 'Caveat', category: 'handwriting' },
    { family: 'Satisfy', category: 'handwriting' },
    { family: 'Great Vibes', category: 'handwriting' },
    { family: 'Dancing Script', category: 'handwriting' },
    { family: 'Shadows Into Light', category: 'handwriting' },
    { family: 'Indie Flower', category: 'handwriting' },
    { family: 'Permanent Marker', category: 'handwriting' },

    // Monospace
    { family: 'Roboto Mono', category: 'monospace' },
    { family: 'Space Mono', category: 'monospace' },
    { family: 'Fira Code', category: 'monospace' },
    { family: 'Inconsolata', category: 'monospace' },
    { family: 'IBM Plex Mono', category: 'monospace' }
];

export const FONT_CATEGORIES = ['All', 'Sans Serif', 'Serif', 'Display', 'Handwriting', 'Monospace'];
