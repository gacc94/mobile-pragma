import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { SplashPage } from './splash.page';
import { CatBreedsStore } from '../../core/store/cat-breeds.store';

vi.mock('@capacitor/splash-screen', () => ({
    SplashScreen: {
        hide: vi.fn().mockResolvedValue(undefined),
    },
}));

describe('SplashPage', () => {
    let component: SplashPage;
    let fixture: ComponentFixture<SplashPage>;
    let router: Router;
    let catBreedsStoreMock: { loadBreeds: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();

        catBreedsStoreMock = {
            loadBreeds: vi.fn(),
        };

        TestBed.configureTestingModule({
            imports: [SplashPage],
            providers: [provideRouter([]), { provide: CatBreedsStore, useValue: catBreedsStoreMock }],
        });

        router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);

        fixture = TestBed.createComponent(SplashPage);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should preload breeds on init', () => {
        fixture.detectChanges();
        expect(catBreedsStoreMock.loadBreeds).toHaveBeenCalledTimes(1);
    });

    it('should hide native splash screen if running on native platform', () => {
        vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
        const hideSpy = vi.spyOn(SplashScreen, 'hide').mockResolvedValue();

        fixture.detectChanges();

        expect(hideSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call SplashScreen.hide if running on web platform', () => {
        vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(false);
        const hideSpy = vi.spyOn(SplashScreen, 'hide').mockResolvedValue();

        fixture.detectChanges();

        expect(hideSpy).not.toHaveBeenCalled();
    });

    it('should navigate to /home with replaceUrl: true after 2000ms', () => {
        fixture.detectChanges();

        expect(router.navigate).not.toHaveBeenCalled();

        vi.advanceTimersByTime(2000);

        expect(router.navigate).toHaveBeenCalledWith(['/home'], { replaceUrl: true });
    });

    it('should cancel navigation timer on destroy', () => {
        fixture.detectChanges();

        fixture.destroy();
        vi.advanceTimersByTime(2000);

        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should render the "Catbreeds" title and cat mascot illustration', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;

        const title = compiled.querySelector('.splash-title');
        expect(title?.textContent?.trim()).toBe('Catbreeds');

        const illustration = compiled.querySelector('.splash-illustration') as HTMLImageElement;
        expect(illustration).toBeTruthy();
        expect(illustration.getAttribute('src')).toBe('assets/splash/cat-rafiki.svg');
    });
});
