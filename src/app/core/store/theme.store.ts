import { computed, effect } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { Preferences } from '@capacitor/preferences';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeOption {
    readonly mode: ThemeMode;
    readonly label: string;
    readonly icon: string;
}

export interface ThemeState {
    readonly mode: ThemeMode;
    readonly systemDark: boolean;
}

export const THEME_STORAGE_KEY = 'catbreeds_theme_mode';

const THEME_OPTIONS: readonly ThemeOption[] = [
    { mode: 'light', label: 'Claro', icon: 'sunny-outline' },
    { mode: 'dark', label: 'Oscuro', icon: 'moon-outline' },
    { mode: 'system', label: 'Sistema', icon: 'contrast-outline' },
];

function isValidThemeMode(value: unknown): value is ThemeMode {
    return value === 'light' || value === 'dark' || value === 'system';
}

function getStoredMode(): ThemeMode {
    try {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(THEME_STORAGE_KEY);
            if (isValidThemeMode(stored)) {
                return stored;
            }
        }
    } catch {
        // Fallback gracefully if localStorage is restricted
    }
    return 'system';
}

function getSystemPrefersDark(): boolean {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
}

export const ThemeStore = signalStore(
    { providedIn: 'root' },
    withState<ThemeState>(() => ({
        mode: getStoredMode(),
        systemDark: getSystemPrefersDark(),
    })),
    withComputed(({ mode, systemDark }) => {
        const isDark = computed<boolean>(() => {
            const currentMode = mode();
            if (currentMode === 'dark') {
                return true;
            }
            if (currentMode === 'light') {
                return false;
            }
            return systemDark();
        });

        const activeTheme = computed<'dark' | 'light'>(() => (isDark() ? 'dark' : 'light'));

        const themeIcon = computed<string>(() => {
            switch (mode()) {
                case 'light':
                    return 'sunny-outline';
                case 'dark':
                    return 'moon-outline';
                case 'system':
                default:
                    return 'contrast-outline';
            }
        });

        const themeOptions = computed<readonly ThemeOption[]>(() => THEME_OPTIONS);

        return {
            isDark,
            activeTheme,
            themeIcon,
            themeOptions,
        };
    }),
    withMethods((store) => ({
        /**
         * Sets and persists the theme mode across localStorage (instant sync)
         * and Capacitor Preferences (native UserDefaults / SharedPreferences).
         */
        setThemeMode(mode: ThemeMode): void {
            patchState(store, { mode });

            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(THEME_STORAGE_KEY, mode);
                }
            } catch {
                // Storage access handling
            }

            void Preferences.set({ key: THEME_STORAGE_KEY, value: mode }).catch(() => {
                // Non-fatal native preference save error
            });
        },

        /**
         * Updates the detected system dark preference (from matchMedia).
         */
        updateSystemDark(systemDark: boolean): void {
            patchState(store, { systemDark });
        },
    })),
    withHooks({
        onInit(store) {
            // Asynchronously hydrate from Capacitor Preferences (UserDefaults / SharedPreferences)
            void Preferences.get({ key: THEME_STORAGE_KEY })
                .then(({ value }) => {
                    if (isValidThemeMode(value) && value !== store.mode()) {
                        patchState(store, { mode: value });
                        try {
                            if (typeof localStorage !== 'undefined') {
                                localStorage.setItem(THEME_STORAGE_KEY, value);
                            }
                        } catch {
                            // Non-fatal storage sync
                        }
                    }
                })
                .catch(() => {
                    // Non-fatal native preference read error
                });

            // Listen to OS system color scheme changes if available
            if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                store.updateSystemDark(mediaQuery.matches);

                const listener = (event: MediaQueryListEvent) => {
                    store.updateSystemDark(event.matches);
                };

                if (typeof mediaQuery.addEventListener === 'function') {
                    mediaQuery.addEventListener('change', listener);
                } else if (typeof (mediaQuery as any).addListener === 'function') {
                    (mediaQuery as any).addListener(listener);
                }
            }

            // Synchronize document palette and color-scheme reactively
            effect(() => {
                const dark = store.isDark();
                if (typeof document !== 'undefined') {
                    document.documentElement.classList.toggle('ion-palette-dark', dark);
                    document.documentElement.classList.toggle('dark', dark);
                    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
                }
            });
        },
    }),
);

export type ThemeStore = InstanceType<typeof ThemeStore>;
