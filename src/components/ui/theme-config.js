// Theme Configuration - Centralized and Maintainable
export const ThemeConfig = {
    // Theme Categories for better organization
    categories: {
        basic: {
            name: 'Basic',
            icon: '🎨',
            description: 'Simple and clean themes'
        },
        gradient: {
            name: 'Gradients',
            icon: '🌈',
            description: 'Beautiful gradient backgrounds'
        },
        special: {
            name: 'Special',
            icon: '✨',
            description: 'Unique and eye-catching themes'
        }
    },

    // Theme definitions with enhanced metadata
    themes: {
        default: {
            name: 'Default',
            class: '',
            category: 'basic',
            description: 'Clean default appearance',
            preview: 'default',
            tags: ['clean', 'simple']
        },
        transparent: {
            name: 'Transparent',
            class: 'bg-transparent',
            category: 'basic',
            description: 'See-through background',
            preview: 'transparent',
            tags: ['minimal', 'transparent']
        },
        glass: {
            name: 'Glass',
            class: 'bg-glass',
            category: 'basic',
            description: 'Frosted glass effect',
            preview: 'glass',
            tags: ['modern', 'blur']
        },
        dark: {
            name: 'Dark',
            class: 'bg-dark',
            category: 'basic',
            description: 'Dark theme for low light',
            preview: 'dark',
            tags: ['dark', 'night']
        },
        light: {
            name: 'Light',
            class: 'bg-light',
            category: 'basic',
            description: 'Bright and clean',
            preview: 'light',
            tags: ['bright', 'clean']
        },
        blue: {
            name: 'Ocean Blue',
            class: 'bg-blue',
            category: 'gradient',
            description: 'Calming blue gradient',
            preview: 'blue',
            tags: ['blue', 'calm', 'ocean']
        },
        green: {
            name: 'Forest Green',
            class: 'bg-green',
            category: 'gradient',
            description: 'Natural green tones',
            preview: 'green',
            tags: ['green', 'nature', 'forest']
        },
        purple: {
            name: 'Royal Purple',
            class: 'bg-purple',
            category: 'gradient',
            description: 'Elegant purple gradient',
            preview: 'purple',
            tags: ['purple', 'royal', 'elegant']
        },
        orange: {
            name: 'Sunset Orange',
            class: 'bg-orange',
            category: 'gradient',
            description: 'Warm orange sunset',
            preview: 'orange',
            tags: ['orange', 'warm', 'sunset']
        },
        pink: {
            name: 'Rose Pink',
            class: 'bg-pink',
            category: 'gradient',
            description: 'Soft pink tones',
            preview: 'pink',
            tags: ['pink', 'soft', 'rose']
        },
        gradient: {
            name: 'Rainbow',
            class: 'bg-gradient',
            category: 'gradient',
            description: 'Vibrant rainbow gradient',
            preview: 'gradient',
            tags: ['rainbow', 'vibrant', 'colorful']
        },
        neon: {
            name: 'Cyber Neon',
            class: 'bg-neon',
            category: 'special',
            description: 'Futuristic neon glow',
            preview: 'neon',
            tags: ['neon', 'cyber', 'futuristic']
        }
    },

    // Helper methods
    getThemeByKey(key) {
        return this.themes[key] || this.themes.default;
    },

    getThemesByCategory(category) {
        return Object.entries(this.themes)
            .filter(([key, theme]) => theme.category === category)
            .reduce((acc, [key, theme]) => {
                acc[key] = theme;
                return acc;
            }, {});
    },

    getAllCategories() {
        return this.categories;
    },

    getThemesForDropdown() {
        const categorized = {};
        
        Object.keys(this.categories).forEach(categoryKey => {
            const categoryThemes = this.getThemesByCategory(categoryKey);
            if (Object.keys(categoryThemes).length > 0) {
                categorized[categoryKey] = {
                    ...this.categories[categoryKey],
                    themes: categoryThemes
                };
            }
        });
        
        return categorized;
    },

    // Search functionality
    searchThemes(query) {
        const searchTerm = query.toLowerCase();
        return Object.entries(this.themes)
            .filter(([key, theme]) => 
                theme.name.toLowerCase().includes(searchTerm) ||
                theme.description.toLowerCase().includes(searchTerm) ||
                theme.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            )
            .reduce((acc, [key, theme]) => {
                acc[key] = theme;
                return acc;
            }, {});
    }
};

// Legacy compatibility - maintain the old structure for existing code
export const backgroundThemes = Object.entries(ThemeConfig.themes).reduce((acc, [key, theme]) => {
    acc[key] = {
        name: theme.name,
        class: theme.class
    };
    return acc;
}, {}); 