import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Preferences } from '@capacitor/preferences';
import { THEME_STORAGE_KEY, ThemeStore } from './theme.store';

vi.mock('@capacitor/preferences', () => ({
    Preferences: {
        get: vi.fn().mockResolvedValue({ value: null }),
        set: vi.fn().mockResolvedValue(undefined),
    },
}));

describe('ThemeStore', () => {
    let store: ThemeStore;

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        vi.mocked(Preferences.get).mockResolvedValue({ value: null });
        vi.mocked(Preferences.set).mockResolvedValue(undefined);

        TestBed.configureTestingModule({
            providers: [ThemeStore],
        });

        store = TestBed.inject(ThemeStore);
    });

    it('should initialize with system mode by default when localStorage is empty', () => {
        expect(store.mode()).toBe('system');
        expect(store.themeIcon()).toBe('contrast-outline');
    });

    it('should initialize with stored mode from localStorage when available', () => {
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');

        const newStore = TestBed.runInInjectionContext(() => new (ThemeStore as any)());
        expect(newStore.mode()).toBe('dark');
        expect(newStore.isDark()).toBe(true);
        expect(newStore.themeIcon()).toBe('moon-outline');
    });

    it('should update theme mode and persist in both localStorage and Capacitor Preferences when setThemeMode is called', () => {
        store.setThemeMode('dark');
        expect(store.mode()).toBe('dark');
        expect(store.isDark()).toBe(true);
        expect(store.themeIcon()).toBe('moon-outline');
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
        expect(Preferences.set).toHaveBeenCalledWith({ key: THEME_STORAGE_KEY, value: 'dark' });

        store.setThemeMode('light');
        expect(store.mode()).toBe('light');
        expect(store.isDark()).toBe(false);
        expect(store.themeIcon()).toBe('sunny-outline');
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
        expect(Preferences.set).toHaveBeenCalledWith({ key: THEME_STORAGE_KEY, value: 'light' });

        store.setThemeMode('system');
        expect(store.mode()).toBe('system');
        expect(store.themeIcon()).toBe('contrast-outline');
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
        expect(Preferences.set).toHaveBeenCalledWith({ key: THEME_STORAGE_KEY, value: 'system' });
    });

    it('should hydrate from Capacitor Preferences on initialization if native preference is available', async () => {
        vi.mocked(Preferences.get).mockResolvedValue({ value: 'dark' });

        const nativeStore = TestBed.runInInjectionContext(() => new (ThemeStore as any)());
        // Wait a tick for the async Preferences.get promise to resolve
        await Promise.resolve();
        await Promise.resolve();

        expect(nativeStore.mode()).toBe('dark');
        expect(nativeStore.isDark()).toBe(true);
    });

    it('should compute isDark based on systemDark when mode is system', () => {
        store.setThemeMode('system');

        store.updateSystemDark(true);
        expect(store.systemDark()).toBe(true);
        expect(store.isDark()).toBe(true);

        store.updateSystemDark(false);
        expect(store.systemDark()).toBe(false);
        expect(store.isDark()).toBe(false);
    });

    it('should ignore systemDark when mode is explicitly dark or light', () => {
        store.setThemeMode('light');
        store.updateSystemDark(true);
        expect(store.isDark()).toBe(false);

        store.setThemeMode('dark');
        store.updateSystemDark(false);
        expect(store.isDark()).toBe(true);
    });

    it('should expose the available theme options with labels and icons', () => {
        expect(store.themeOptions()).toEqual([
            { mode: 'light', label: 'Claro', icon: 'sunny-outline' },
            { mode: 'dark', label: 'Oscuro', icon: 'moon-outline' },
            { mode: 'system', label: 'Sistema', icon: 'contrast-outline' },
        ]);
    });
});
