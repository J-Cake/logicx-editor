import $ from 'jquery';

export type Colour = [r: number, g: number, b: number, a?: number] & { toString: () => string };
export const colour = (r: number, g: number, b: number, a?: number): Colour => Object.defineProperty([r, g, b, a] as Colour, 'toString', { value: () => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${(a ?? 1).toString(16).padStart(2, '0')})` });

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
        colour: [light: Colour, dark: Colour]
    },
    borders: {
        radius: number,
        colour: [light: Colour, dark: Colour],
        weight: number,
        apply?: 'top' | 'bottom' | 'left' | 'right' | 'vertical' | 'horizontal' | 'all' | 'none'
    },
    margin: number
}

const isColour = (colour: any): colour is Colour => Array.isArray(colour) && (colour.length === 3 || colour.length === 4) && typeof colour.toString === 'function' && /^rgba\((\d{1,3}(, )?){4}\)$/.test(colour.toString());
const isColourOption = (option: any): option is [light: Colour, dark: Colour] => Array.isArray(option) && option.length === 2 && isColour(option[0]) && isColour(option[1]);

export default class ThemeMananger {

    private readonly themes: { [name: string]: Theme } = {};
    public current: keyof ThemeMananger['themes'];
    private mediaQuery: MediaQueryList;
    private variant: 'light' | 'dark';

    private root = $(":root");

    getValue<T>(name: string): T {
        const getValue = (obj: any, path: string[], transform: (x: any) => any): T => path[0] in obj ? path.length > 1 ? transform(getValue(transform(obj[path[0]]), path.slice(1), transform)) : transform(obj[path[0]]) : null;

        return getValue(this.themes[this.current], name.split('.'), x => isColourOption(x) ? x[this.variant] : x);
    }

    constructor() {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.mediaQuery.addEventListener('change', ({ matches }) => {
            this.variant = matches ? 'dark' : 'light';

            this.applyTheme(this.current);
        });
        this.variant = this.mediaQuery.matches ? 'dark' : 'light';
    }

    async loadTheme(url: string, name: string) {
        const theme = await (await fetch(url)).json();

        this.themes[name] = theme;
    }

    pushTheme(name: string, theme: Theme) {
        if (!(name in this.themes))
            this.themes[name] = theme;

            else console.warn(`Theme "${name}" already exists`);
    }

    switchTheme(name: keyof ThemeMananger['themes']) {
        if (name in this.themes)
            this.applyTheme(name);
        else
            console.warn(`Theme "${name}" does not exist`);
    }

    applyTheme(name: keyof ThemeMananger['themes']) {
        const theme = this.themes[this.current = name];
        console.log(name, theme);

        const variant = this.variant === 'light' ? 0 : 1;
        this.root.css('--theme-background', theme.colours.background[variant].toString());
        this.root.css('--theme-foreground', theme.colours.foreground[variant].toString());
        this.root.css('--theme-primary', theme.colours.primary[variant].toString());
        this.root.css('--theme-secondary', theme.colours.secondary[variant].toString());
        this.root.css('--theme-warn', theme.colours.warn[variant].toString());
        this.root.css('--theme-danger', theme.colours.danger[variant].toString());
        this.root.css('--theme-font-family', theme.typography.fontFamily);
        this.root.css('--theme-font-size', theme.typography.fontSize);
        this.root.css('--theme-font-colour', theme.typography.colour[variant].toString());
        this.root.css('--theme-border-radius', theme.borders.radius);
        this.root.css('--theme-border-colour', theme.borders.colour[variant].toString());
        this.root.css('--theme-border-weight', theme.borders.weight);
        this.root.css('--theme-margin', theme.margin);
    }
}