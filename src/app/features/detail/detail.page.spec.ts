import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DetailPage } from './detail.page';
import { CatBreedsStore } from '../../core/store/cat-breeds.store';
import { CatBreed } from '../../core/models/cat-breed.model';

const mockBreed: CatBreed = {
    id: 'abys',
    name: 'Abyssinian',
    origin: 'Egypt',
    description: 'The Abyssinian is easy to care for, and a joy to have in your home.',
    temperament: 'Active, Energetic, Independent, Intelligent, Gentle',
    life_span: '14 - 15',
    adaptability: 5,
    intelligence: 5,
    image: {
        id: '0XYvRd7oD',
        url: 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg',
    },
};

describe('DetailPage', () => {
    let component: DetailPage;
    let fixture: ComponentFixture<DetailPage>;

    let selectedBreedSignal: WritableSignal<CatBreed | null>;
    let isLoadingSignal: WritableSignal<boolean>;

    let storeMock: {
        selectedBreed: WritableSignal<CatBreed | null>;
        isLoading: WritableSignal<boolean>;
        selectBreed: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        selectedBreedSignal = signal<CatBreed | null>(mockBreed);
        isLoadingSignal = signal<boolean>(false);

        storeMock = {
            selectedBreed: selectedBreedSignal,
            isLoading: isLoadingSignal,
            selectBreed: vi.fn(),
        };

        TestBed.configureTestingModule({
            imports: [DetailPage],
            providers: [provideRouter([]), { provide: CatBreedsStore, useValue: storeMock }],
        });

        fixture = TestBed.createComponent(DetailPage);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create DetailPage component', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should select breed in store when id input changes', () => {
        fixture.componentRef.setInput('id', 'abys');
        fixture.detectChanges();

        expect(storeMock.selectBreed).toHaveBeenCalledWith('abys');
    });

    it('should render breed details, title, description, and traits when breed is selected', () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;

        const title = compiled.querySelector('.breed-title');
        const description = compiled.querySelector('.description-text');
        const origin = compiled.querySelector('.trait-value');
        const badges = compiled.querySelectorAll('.trait-badge');

        expect(title?.textContent?.trim()).toBe('Abyssinian');
        expect(description?.textContent?.trim()).toContain('easy to care for');
        expect(origin?.textContent?.trim()).toBe('Egypt');
        expect(badges.length).toBe(2);
        expect(badges[0]?.textContent?.trim()).toBe('5 / 5');
        expect(badges[1]?.textContent?.trim()).toBe('5 / 5');
    });

    it('should show loading skeletons when isLoading is true and selectedBreed is null', () => {
        selectedBreedSignal.set(null);
        isLoadingSignal.set(true);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const skeletonHero = compiled.querySelector('.skeleton-hero');
        expect(skeletonHero).toBeTruthy();
    });

    it('should show error / not found state when not loading and selectedBreed is null', () => {
        selectedBreedSignal.set(null);
        isLoadingSignal.set(false);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const errorState = compiled.querySelector('.error-state');
        expect(errorState).toBeTruthy();
        expect(errorState?.textContent).toContain('Raza no encontrada');
    });

    it('should fallback to placeholder image on image error event', () => {
        fixture.detectChanges();
        const img = document.createElement('img');
        img.src = 'https://broken-image.com/cat.jpg';

        const errorEvent = { target: img } as unknown as Event;
        component.onImageError(errorEvent);

        expect(img.src).toContain(component.fallbackImageUrl);
    });
});
