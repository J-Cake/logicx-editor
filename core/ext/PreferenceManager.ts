import ThemeManager, { Theme } from "./ThemeManager";
import KeymapManager from "#core/ext/KeymapManager";

export interface GlobalPreferences {
    extensions: string[],
    theme: keyof ThemeManager['themes'][string],
    keymap: keyof KeymapManager['keymaps'][string]
    language: string,
    toolbarLeft: string[],
    toolbarRight: string[],
    toolbarTop: string[],
}

export default class PreferenceManager<Preferences extends { [Pref in string]: any }> {
    private readonly preferences: Preferences = {} as Preferences;

    private constructor(private readonly defaultPreferences: Preferences) {
        for (const i in defaultPreferences)
            window.localStorage.setItem(i, JSON.stringify(this.preferences[i as keyof Preferences] = JSON.parse(window.localStorage.getItem(i) as Preferences[typeof i]) ?? defaultPreferences[i as keyof Preferences]));
    }

    static async load<Preferences extends { [Pref in string]: any }>(store: string): Promise<PreferenceManager<Preferences>> {
        const preferences: Preferences = await (await fetch(store)).json();

        return new PreferenceManager<Preferences>(preferences);
    }

    get<T extends keyof Preferences>(key: T): Preferences[T] {
        return this.preferences[key] ?? this.defaultPreferences[key];
    }
}