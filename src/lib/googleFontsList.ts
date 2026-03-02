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
    { family: 'DM Sans', category: 'sans-serif' },
    { family: 'Outfit', category: 'sans-serif' },
    { family: 'Sora', category: 'sans-serif' },
    { family: 'Urbanist', category: 'sans-serif' },
    { family: 'Plus Jakarta Sans', category: 'sans-serif' },
    { family: 'Manrope', category: 'sans-serif' },
    { family: 'Space Grotesk', category: 'sans-serif' },
    { family: 'Lexend', category: 'sans-serif' },

    // Serif — Film & Editorial
    { family: 'Playfair Display', category: 'serif' },
    { family: 'Merriweather', category: 'serif' },
    { family: 'Lora', category: 'serif' },
    { family: 'PT Serif', category: 'serif' },
    { family: 'Roboto Slab', category: 'serif' },
    { family: 'Cinzel', category: 'serif' },
    { family: 'Prata', category: 'serif' },
    { family: 'Libre Baskerville', category: 'serif' },
    { family: 'Cormorant Garamond', category: 'serif' },
    { family: 'DM Serif Display', category: 'serif' },
    { family: 'Bodoni Moda', category: 'serif' },
    { family: 'Fraunces', category: 'serif' },
    { family: 'Instrument Serif', category: 'serif' },
    { family: 'Newsreader', category: 'serif' },
    { family: 'Source Serif 4', category: 'serif' },

    // Display — Bold & Cinematic
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
    { family: 'Dela Gothic One', category: 'display' },
    { family: 'Bungee', category: 'display' },
    { family: 'Staatliches', category: 'display' },
    { family: 'Monoton', category: 'display' },
    { family: 'Vast Shadow', category: 'display' },
    { family: 'Alfa Slab One', category: 'display' },
    { family: 'Passion One', category: 'display' },
    { family: 'Teko', category: 'display' },

    // Handwriting
    { family: 'Caveat', category: 'handwriting' },
    { family: 'Satisfy', category: 'handwriting' },
    { family: 'Great Vibes', category: 'handwriting' },
    { family: 'Dancing Script', category: 'handwriting' },
    { family: 'Shadows Into Light', category: 'handwriting' },
    { family: 'Indie Flower', category: 'handwriting' },
    { family: 'Permanent Marker', category: 'handwriting' },
    { family: 'Kalam', category: 'handwriting' },
    { family: 'Architects Daughter', category: 'handwriting' },

    // Monospace
    { family: 'Roboto Mono', category: 'monospace' },
    { family: 'Space Mono', category: 'monospace' },
    { family: 'Fira Code', category: 'monospace' },
    { family: 'Inconsolata', category: 'monospace' },
    { family: 'IBM Plex Mono', category: 'monospace' },
    { family: 'JetBrains Mono', category: 'monospace' },
];

export const FONT_CATEGORIES = ['All', 'Sans Serif', 'Serif', 'Display', 'Handwriting', 'Monospace'];
