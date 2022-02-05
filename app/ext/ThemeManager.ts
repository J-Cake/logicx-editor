import $ from 'jquery';
import { GlobalState } from '..';

export type Colour = [r: number, g: number, b: number, a?: number] & { toString: () => string };
export const colour = (r: number, g: number, b: number, a?: number): Colour => Object.defineProperty([r, g, b, a] as Colour, 'toString', () => `rgba(${r}, ${g}, ${b}, ${a ?? 1})`);

export interface Theme {
    colours: {
        foreground: [light: Colour, dark: Colour],
        background: [light: Colour, dark: Colour],
        primary: [light: Colour, dark: Colour],
        secondary: [light: Colour, dark: Colour],
        warn: [light: Colour, dark: Colour],
        danger: [light: Colour, dark: Colour]
    },
    typography: {
        fontFamily: string,
        fontSize: number,
        colour: keyof Theme['colours'] | [light: Colour, dark: Colour]
    },
    borders: {
        radius: number,
        colour: keyof Theme['colours'] | [light: Colour, dark: Colour],
        weight: number,
        apply?: 'top' | 'bottom' | 'left' | 'right' | 'vertical' | 'horizontal' | 'all' | 'none'
    },
    margin: number
}

export default class ThemeMananger {

    private readonly themes: { [name: string]: Theme } = {};
    private mediaQuery: MediaQueryList;
    private currentTheme: Theme;
    private variant: 'light' | 'dark';

    private root = $(":root");

    constructor() {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.mediaQuery.addEventListener('change', ({ matches }) => {
            this.variant = matches ? 'dark' : 'light';

            this.applyTheme(this.currentTheme);
        });
        this.variant = this.mediaQuery.matches ? 'dark' : 'light';
    }

    async loadTheme(url: string, name: string) {
        const theme = await (await fetch(url)).json();

        this.themes[name] = theme;
    }

    pushTheme(theme: Theme, name: string) {
        if (!(name in this.themes))
            this.themes[name] = theme;
    }

    switchTheme(name: keyof ThemeMananger['themes']) {
        if (name in this.themes)
            this.applyTheme(this.themes[name]);
        else
            console.warn(`Theme "${name}" does not exist`);
    }

    applyTheme(theme: Theme) {
        this.currentTheme = theme;

        const variant = this.variant === 'light' ? 0 : 1;
        this.root.css('--theme-background', theme.colours.background[variant].toString());
        this.root.css('--theme-foreground', theme.colours.foreground[variant].toString());
        this.root.css('--theme-primary', theme.colours.primary[variant].toString());
        this.root.css('--theme-secondary', theme.colours.secondary[variant].toString());
        this.root.css('--theme-warn', theme.colours.warn[variant].toString());
        this.root.css('--theme-danger', theme.colours.danger[variant].toString());
        this.root.css('--theme-font-family', theme.typography.fontFamily);
        this.root.css('--theme-font-size', theme.typography.fontSize);
        this.root.css('--theme-font-colour', Array.isArray(theme.typography.colour) ? theme.typography.colour[variant].toString() : theme.colours[theme.typography.colour][variant].toString());
        this.root.css('--theme-border-radius', theme.borders.radius);
        this.root.css('--theme-border-colour', Array.isArray(theme.borders.colour) ? theme.borders.colour[variant].toString() : theme.colours[theme.borders.colour][variant].toString());
        this.root.css('--theme-border-weight', theme.borders.weight);
        this.root.css('--theme-margin', theme.margin);
    }
}