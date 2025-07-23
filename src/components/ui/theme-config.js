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
        },
        window: {
            name: 'Window',
            icon: '🪟',
            description: 'Window appearance themes'
        }
    },

    // Default themes for input and output messages
    defaults: {
        input: 'default',  // Default theme for user input messages
        output: 'glass',   // Default theme for assistant output messages
        window: 'standard' // Default theme for windows
    },

    // Theme definitions with enhanced metadata
    themes: {
        default: {
            name: 'Default',
            class: '',
            category: 'basic',
            description: 'Clean default appearance',
            preview: 'default',
            tags: ['clean', 'simple'],
            suitableFor: ['input', 'output'] // Can be used for both
        },
        transparent: {
            name: 'Transparent',
            class: 'bg-transparent',
            category: 'basic',
            description: 'See-through background',
            preview: 'transparent',
            tags: ['minimal', 'transparent'],
            suitableFor: ['input', 'output']
        },
        glass: {
            name: 'Glass',
            class: 'bg-glass',
            category: 'basic',
            description: 'Frosted glass effect',
            preview: 'glass',
            tags: ['modern', 'blur'],
            suitableFor: ['input', 'output']
        },
        dark: {
            name: 'Dark',
            class: 'bg-dark',
            category: 'basic',
            description: 'Dark theme for low light',
            preview: 'dark',
            tags: ['dark', 'night'],
            suitableFor: ['input', 'output']
        },
        light: {
            name: 'Light',
            class: 'bg-light',
            category: 'basic',
            description: 'Bright and clean',
            preview: 'light',
            tags: ['bright', 'clean'],
            suitableFor: ['input', 'output']
        },
        blue: {
            name: 'Ocean Blue',
            class: 'bg-blue',
            category: 'gradient',
            description: 'Calming blue gradient',
            preview: 'blue',
            tags: ['blue', 'calm', 'ocean'],
            suitableFor: ['input', 'output']
        },
        green: {
            name: 'Forest Green',
            class: 'bg-green',
            category: 'gradient',
            description: 'Natural green tones',
            preview: 'green',
            tags: ['green', 'nature', 'forest'],
            suitableFor: ['input', 'output']
        },
        purple: {
            name: 'Royal Purple',
            class: 'bg-purple',
            category: 'gradient',
            description: 'Elegant purple gradient',
            preview: 'purple',
            tags: ['purple', 'royal', 'elegant'],
            suitableFor: ['input', 'output']
        },
        orange: {
            name: 'Sunset Orange',
            class: 'bg-orange',
            category: 'gradient',
            description: 'Warm orange sunset',
            preview: 'orange',
            tags: ['orange', 'warm', 'sunset'],
            suitableFor: ['input', 'output']
        },
        pink: {
            name: 'Rose Pink',
            class: 'bg-pink',
            category: 'gradient',
            description: 'Soft pink tones',
            preview: 'pink',
            tags: ['pink', 'soft', 'rose'],
            suitableFor: ['input', 'output']
        },
        gradient: {
            name: 'Rainbow',
            class: 'bg-gradient',
            category: 'gradient',
            description: 'Vibrant rainbow gradient',
            preview: 'gradient',
            tags: ['rainbow', 'vibrant', 'colorful'],
            suitableFor: ['input', 'output']
        },
        neon: {
            name: 'Cyber Neon',
            class: 'bg-neon',
            category: 'special',
            description: 'Futuristic neon glow',
            preview: 'neon',
            tags: ['neon', 'cyber', 'futuristic'],
            suitableFor: ['input', 'output']
        },
        // Window Themes
        standard: {
            name: 'Standard',
            class: 'window-standard',
            category: 'window',
            description: 'Default window appearance',
            preview: 'standard',
            tags: ['window', 'default', 'standard'],
            suitableFor: ['window'],
            windowOptions: {
                transparent: true,
                backgroundColor: '#00000000',
                vibrancy: 'ultra-dark'
            }
        },
        solid: {
            name: 'Solid',
            class: 'window-solid',
            category: 'window',
            description: 'Solid window with no transparency',
            preview: 'solid',
            tags: ['window', 'solid', 'opaque'],
            suitableFor: ['window'],
            windowOptions: {
                transparent: false,
                backgroundColor: '#2d3748',
                vibrancy: null
            }
        },
        glass: {
            name: 'Glass',
            class: 'window-glass',
            category: 'window',
            description: 'Frosted glass effect for windows',
            preview: 'glass',
            tags: ['window', 'glass', 'transparent'],
            suitableFor: ['window'],
            windowOptions: {
                transparent: true,
                backgroundColor: '#ffffff20',
                vibrancy: 'blur'
            }
        },
        dark: {
            name: 'Dark Mode',
            class: 'window-dark',
            category: 'window',
            description: 'Dark themed window',
            preview: 'dark',
            tags: ['window', 'dark', 'night'],
            suitableFor: ['window'],
            windowOptions: {
                transparent: true,
                backgroundColor: '#121212cc',
                vibrancy: 'dark'
            }
        },
        light: {
            name: 'Light Mode',
            class: 'window-light',
            category: 'window',
            description: 'Light themed window',
            preview: 'light',
            tags: ['window', 'light', 'bright'],
            suitableFor: ['window'],
            windowOptions: {
                transparent: true,
                backgroundColor: '#f5f5f5cc',
                vibrancy: 'light'
            }
        },
        colorful: {
            name: 'Colorful',
            class: 'window-colorful',
            category: 'window',
            description: 'Colorful window with gradient background',
            preview: 'colorful',
            tags: ['window', 'colorful', 'gradient'],
            suitableFor: ['window'],
            windowOptions: {
                transparent: true,
                backgroundColor: '#4158D0cc',
                vibrancy: null
            }
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

    // Get themes suitable for specific message type
    getThemesForMessageType(messageType) {
        return Object.entries(this.themes)
            .filter(([key, theme]) => theme.suitableFor.includes(messageType))
            .reduce((acc, [key, theme]) => {
                acc[key] = theme;
                return acc;
            }, {});
    },

    // Get default theme for message type
    getDefaultTheme(messageType) {
        return this.defaults[messageType] || 'default';
    },

    getAllCategories() {
        return this.categories;
    },

    getThemesForDropdown(messageType = 'output') {
        const categorized = {};
        const availableThemes = this.getThemesForMessageType(messageType);
        
        Object.keys(this.categories).forEach(categoryKey => {
            const categoryThemes = Object.entries(availableThemes)
                .filter(([key, theme]) => theme.category === categoryKey)
                .reduce((acc, [key, theme]) => {
                    acc[key] = theme;
                    return acc;
                }, {});
            
            if (Object.keys(categoryThemes).length > 0) {
                categorized[categoryKey] = {
                    ...this.categories[categoryKey],
                    themes: categoryThemes
                };
            }
        });
        
        return categorized;
    },

    // Search functionality with message type filtering
    searchThemes(query, messageType = 'output') {
        const searchTerm = query.toLowerCase();
        const availableThemes = this.getThemesForMessageType(messageType);
        
        return Object.entries(availableThemes)
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