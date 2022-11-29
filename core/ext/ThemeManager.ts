import $ from 'jquery';

import {StateMgr} from '..';

export type Colour = [r: number, g: number, b: number, a?: number] & { stringify: (alpha?: boolean) => string };
export const colour = (r: number, g: number, b: number, a?: number): Colour => Object.defineProperty([r, g, b, a] as Colour, 'stringify', {value: (alpha: boolean = true) => `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${alpha ? (a ?? 255).toString(16).padStart(2, '0') : ''}`});

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
    padding: number,

    stylesheet?: StylesheetLoader[]
}

export type StylesheetLoader = string | ((theme: Theme) => string);

export interface Stylesheet {
    origin: string,
    loaded: boolean,
    sheet: JQuery<HTMLLinkElement | HTMLStyleElement>

    load(): void,

    unload(): void
}

const isColour = (colour: any): colour is Colour => Array.isArray(colour) && (colour.length === 3 || colour.length === 4) && 'stringify' in colour && (typeof colour['stringify'] === 'function' && /^#([a-fA-F0-9]{2}){3,4}$/.test((colour as Colour)['stringify']()));
const isColourOption = (option: any): option is [light: Colour, dark: Colour] => Array.isArray(option) && option.length === 2 && isColour(option[0]) && isColour(option[1]);

type LoadedTheme = { userTheme: Theme, stylesheet: Stylesheet[] };

export default class ThemeManager {

    public current: keyof ThemeManager['themes'] = "default";
    private readonly themes: { [name: string]: LoadedTheme } = {};
    private mediaQuery: MediaQueryList;
    private variant: 'light' | 'dark';

    private root = $(":root");

    constructor() {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.mediaQuery.addEventListener('change', ({matches}) => {
            this.variant = matches ? 'dark' : 'light';

            this.applyTheme(this.current);
        });
        this.variant = this.mediaQuery.matches ? 'dark' : 'light';
    }

    get dark() {
        return this.variant == 'dark';
    }

    get currentTheme(): LoadedTheme {
        return this.themes[this.current];
    }

    getValue<T>(name: string): T {
        let value: any = this.themes[this.current].userTheme;

        for (const part of name.split('.'))
            value = value[part];

        if (isColourOption(value))
            return value[this.variant === 'light' ? 0 : 1] as unknown as T;
        return value;
    }

    async loadTheme(url: string, name: string) {
        this.themes[name] = await (await fetch(url)).json();
    }

    pushTheme(name: string, theme: Theme) {
        if (!(name in this.themes))
            this.themes[name] = {userTheme: theme, stylesheet: null as any};

        else console.warn(`Theme "${name}" already exists`);
    }

    switchTheme(name: keyof ThemeManager['themes']) {
        if (name in this.themes)
            this.applyTheme(name);
        else
            console.warn(`Theme "${name}" does not exist`);
    }

    applyTheme(name: keyof ThemeManager['themes']) {

        for (const i of this.currentTheme.stylesheet ?? [])
            i.unload();

        if (this.currentTheme.stylesheet == null) // lazy loading
            this.themes[this.current].stylesheet = this.currentTheme.userTheme.stylesheet?.map(i => this.useStylesheet(i)) ?? [];

        const {userTheme: theme, stylesheet} = this.themes[this.current = name];

        const variant = this.variant === 'light' ? 0 : 1;
        this.root.css('--theme-background', theme.colours.background[variant].stringify());
        this.root.css('--theme-foreground', theme.colours.foreground[variant].stringify());
        this.root.css('--theme-primary', theme.colours.primary[variant].stringify());
        this.root.css('--theme-secondary', theme.colours.secondary[variant].stringify());
        this.root.css('--theme-warn', theme.colours.warn[variant].stringify());
        this.root.css('--theme-danger', theme.colours.danger[variant].stringify());
        this.root.css('--theme-font-family', theme.typography.fontFamily);
        this.root.css('--theme-font-size', theme.typography.fontSize);
        this.root.css('--theme-font-colour', theme.typography.colour[variant].stringify());
        this.root.css('--theme-border-radius', theme.borders.radius);
        this.root.css('--theme-border-colour', theme.borders.colour[variant].stringify());
        this.root.css('--theme-border-weight', theme.borders.weight);
        this.root.css('--theme-padding', theme.padding);

        for (const i of stylesheet ?? [])
            i.load();

        StateMgr.broadcast('theme-change');
    }

    useStylesheet(props: StylesheetLoader): Stylesheet {
        const ctx = this;

        const stylesheet = typeof props == 'string' ?
            $(document.createElement('link'))
                .attr('rel', 'stylesheet')
                .attr('href', props) : $(document.createElement('style'))
                .text(props(this.currentTheme?.userTheme));

        return {
            sheet: stylesheet,

            load() {
                $(':root head')
                    .append(stylesheet);

                this.loaded = true;
                if (typeof props == 'function')
                    ctx.mediaQuery.addEventListener('change', () => stylesheet.text(props(ctx.currentTheme.userTheme)));
            },

            unload: stylesheet.remove.bind(stylesheet),

            loaded: false,
            origin: typeof props == 'string' ? props : props.name
        };
    }

    parseColour(colourValue: string): Colour;
    parseColour(colourValue: [string, string]): [Colour, Colour];
    parseColour(colourValue: string | [string, string]): Colour | [Colour, Colour] {
        const parseColour = function (colourValue: string): Colour {
            if (colourValue.startsWith('#') && (colourValue.length === 7 || colourValue.length === 9))
                return colour(...colourValue.slice(1).split(/(..)/).filter(i => i).map(i => parseInt(i, 16)) as [number, number, number, number?]);
            else
                throw `Invalid Colour Format: Expected rgb (#rrggbb) or rgba (#rrggbbaa)`;
        };

        if (typeof colourValue === 'string') {
            return parseColour(colourValue);
        } else {
            return [parseColour(colourValue[0]), parseColour(colourValue[1])];
        }
    }

    switchColour(colour: string | [string, string] | Colour | [Colour, Colour]) {
        if (typeof colour == 'string')
            return this.parseColour(colour);

        if ('stringify' in colour)
            return colour;

        const _colour = colour[this.dark ? 1 : 0];

        if (typeof _colour == 'string')
            return this.parseColour(_colour);

        return _colour;
    }
}