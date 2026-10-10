import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HomePage } from './home.page';
import { CatBreedsStore } from '../../core/store/cat-breeds.store';
import { ThemeStore } from '../../core/store/theme.store';
import { CatBreed } from '../../core/models/cat-breed.model';

const mockBreed: CatBreed = {
    id: 'abys',
    name: 'Abyssinian',
    origin: 'Egypt',
    description: 'The Abyssinian is easy to care for, and a joy to have in your home.',
    life_span: '14 - 15',
    adaptability: 5,
    intelligence: 5,
    image: {
        id: '0XYvRd7oD',
        url: 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg',
    },
};

describe('HomePage', () => {
    let component: HomePage;
    let fixture: ComponentFixture<HomePage>;
    let router: Router;

    let searchQuerySignal: WritableSignal<string>;
    let isLoadingSignal: WritableSignal<boolean>;
    let hasBreedsSignal: WritableSignal<boolean>;
    let errorSignal: WritableSignal<string | null>;
    let totalFilteredBreedsSignal: WritableSignal<number>;
    let filteredBreedsSignal: WritableSignal<CatBreed[]>;
    let visibleBreedsSignal: WritableSignal<CatBreed[]>;
    let canLoadMoreSignal: WritableSignal<boolean>;

    let storeMock: {
        searchQuery: WritableSignal<string>;
        isLoading: WritableSignal<boolean>;
        hasBreeds: WritableSignal<boolean>;
        error: WritableSignal<string | null>;
        totalFilteredBreeds: WritableSignal<number>;
        filteredBreeds: WritableSignal<CatBreed[]>;
        visibleBreeds: WritableSignal<CatBreed[]>;
        canLoadMore: WritableSignal<boolean>;
        loadBreeds: ReturnType<typeof vi.fn>;
        selectBreed: ReturnType<typeof vi.fn>;
        setSearchQuery: ReturnType<typeof vi.fn>;
        clearSearch: ReturnType<typeof vi.fn>;
        loadMoreBreeds: ReturnType<typeof vi.fn>;
        resetPagination: ReturnType<typeof vi.fn>;
    };

    let themeStoreMock: {
        mode: WritableSignal<string>;
        themeIcon: WritableSignal<string>;
        themeOptions: WritableSignal<Array<{ mode: string; label: string; icon: string }>>;
        setThemeMode: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        searchQuerySignal = signal('');
        isLoadingSignal = signal(false);
        hasBreedsSignal = signal(true);
        errorSignal = signal(null);
        totalFilteredBreedsSignal = signal(1);
        filteredBreedsSignal = signal([mockBreed]);
        visibleBreedsSignal = signal([mockBreed]);
        canLoadMoreSignal = signal(false);

        storeMock = {
            searchQuery: searchQuerySignal,
            isLoading: isLoadingSignal,
            hasBreeds: hasBreedsSignal,
            error: errorSignal,
            totalFilteredBreeds: totalFilteredBreedsSignal,
            filteredBreeds: filteredBreedsSignal,
            visibleBreeds: visibleBreedsSignal,
            canLoadMore: canLoadMoreSignal,
            loadBreeds: vi.fn(),
            selectBreed: vi.fn(),
            setSearchQuery: vi.fn(),
            clearSearch: vi.fn(),
            loadMoreBreeds: vi.fn(),
            resetPagination: vi.fn(),
        };

        themeStoreMock = {
            mode: signal('system'),
            themeIcon: signal('contrast-outline'),
            themeOptions: signal([
                { mode: 'light', label: 'Claro', icon: 'sunny-outline' },
                { mode: 'dark', label: 'Oscuro', icon: 'moon-outline' },
                { mode: 'system', label: 'Sistema', icon: 'contrast-outline' },
            ]),
            setThemeMode: vi.fn(),
        };

        TestBed.configureTestingModule({
            imports: [HomePage],
            providers: [
                provideRouter([]),
                { provide: CatBreedsStore, useValue: storeMock },
                { provide: ThemeStore, useValue: themeStoreMock },
            ],
        });

        router = TestBed.inject(Router);
        vi.spyOn(router, 'navigate').mockResolvedValue(true);

        fixture = TestBed.createComponent(HomePage);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create HomePage component', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should render cat breed cards when filteredBreeds has items', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const breedName = compiled.querySelector('.breed-name');
        const origin = compiled.querySelector('.origin-value');

        expect(breedName?.textContent?.trim()).toBe('Abyssinian');
        expect(origin?.textContent?.trim()).toBe('Egypt');
    });

    it('should update search query in store when searchbar emits ionInput', () => {
        fixture.detectChanges();
        const customEvent = new CustomEvent('ionInput', {
            detail: { value: 'Bengal' },
        });

        component.onSearchInput(customEvent);
        expect(storeMock.setSearchQuery).toHaveBeenCalledWith('Bengal');
    });

    it('should clear search query in store when onSearchClear is triggered', () => {
        fixture.detectChanges();
        component.onSearchClear();
        expect(storeMock.clearSearch).toHaveBeenCalledTimes(1);
    });

    it('should select breed and navigate to /detail/:id when onSelectBreed is triggered', () => {
        fixture.detectChanges();
        component.onSelectBreed('abys');

        expect(storeMock.selectBreed).toHaveBeenCalledWith('abys');
        expect(router.navigate).toHaveBeenCalledWith(['/detail', 'abys']);
    });

    it('should trigger store.loadBreeds and complete refresher on ionRefresh', () => {
        vi.useFakeTimers();
        fixture.detectChanges();

        const completeMock = vi.fn();
        const customEvent = {
            target: { complete: completeMock },
        } as unknown as CustomEvent;

        component.onRefresh(customEvent);

        expect(storeMock.loadBreeds).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(650);
        expect(completeMock).toHaveBeenCalledTimes(1);
        vi.useRealTimers();
    });

    it('should render skeleton loading items when store is loading without cached breeds', () => {
        isLoadingSignal.set(true);
        hasBreedsSignal.set(false);
        filteredBreedsSignal.set([]);
        visibleBreedsSignal.set([]);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const skeletons = compiled.querySelectorAll('.skeleton-card');
        expect(skeletons.length).toBe(3);
    });

    it('should render error state when store has error and no breeds', () => {
        isLoadingSignal.set(false);
        hasBreedsSignal.set(false);
        filteredBreedsSignal.set([]);
        visibleBreedsSignal.set([]);
        errorSignal.set('Network connection failed');
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const errorState = compiled.querySelector('.error-state');
        expect(errorState).toBeTruthy();
        expect(errorState?.textContent).toContain('Network connection failed');
    });

    it('should render empty state when breeds exist but totalFilteredBreeds is 0', () => {
        isLoadingSignal.set(false);
        hasBreedsSignal.set(true);
        totalFilteredBreedsSignal.set(0);
        filteredBreedsSignal.set([]);
        visibleBreedsSignal.set([]);
        searchQuerySignal.set('UnknownCat');
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const emptyState = compiled.querySelector('.empty-state');
        expect(emptyState).toBeTruthy();
        expect(emptyState?.textContent).toContain('No cat breeds match "UnknownCat"');
    });

    it('should render theme button in header and call themeStore.setThemeMode on onSelectTheme', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        const themeBtn = compiled.querySelector('#theme-popover-trigger');
        expect(themeBtn).toBeTruthy();

        component.onSelectTheme('dark');
        expect(themeStoreMock.setThemeMode).toHaveBeenCalledWith('dark');
    });

    it('should call store.loadMoreBreeds and complete event on onLoadMore', () => {
        fixture.detectChanges();
        const completeSpy = vi.fn();
        const infiniteEvent = {
            target: { complete: completeSpy },
        } as unknown as InfiniteScrollCustomEvent;

        component.onLoadMore(infiniteEvent);

        expect(storeMock.loadMoreBreeds).toHaveBeenCalledTimes(1);
        expect(completeSpy).toHaveBeenCalledTimes(1);
    });
});
