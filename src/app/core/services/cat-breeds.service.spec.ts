import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CatBreedsService } from './cat-breeds.service';
import { CatBreed } from '../models/cat-breed.model';

describe('CatBreedsService', () => {
    let service: CatBreedsService;
    let httpTestingController: HttpTestingController;

    const mockBreeds: CatBreed[] = [
        {
            id: 'abys',
            name: 'Abyssinian',
            origin: 'Egypt',
            description: 'The Abyssinian is easy to care for...',
            life_span: '14 - 15',
            adaptability: 5,
            intelligence: 5,
            image: {
                id: '0XYvRd7oD',
                url: 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg',
            },
        },
        {
            id: 'beng',
            name: 'Bengal',
            origin: 'United States',
            description: 'Bengals are a lot of fun to live with...',
            life_span: '12 - 15',
            adaptability: 5,
            intelligence: 5,
            image: {
                id: 'O3btzLlsO',
                url: 'https://cdn2.thecatapi.com/images/O3btzLlsO.jpg',
            },
        },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CatBreedsService, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(CatBreedsService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service.breeds()).toEqual([]);
        expect(service.isLoading()).toBe(false);
    });

    it('should load breeds and update signal state', () => {
        service.loadBreeds().subscribe((breeds) => {
            expect(breeds.length).toBe(2);
            expect(breeds).toEqual(mockBreeds);
        });

        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('x-api-key')).toBe(
            'live_99Qe4Ppj34NdplyLW67xCV7Ds0oSLKGgcWWYnSzMJY9C0QOu0HUR4azYxWkyW2nr',
        );

        req.flush(mockBreeds);

        expect(service.breeds()).toEqual(mockBreeds);
        expect(service.isLoading()).toBe(false);
    });

    it('should filter breeds by search query case-insensitively', () => {
        service.loadBreeds().subscribe();
        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        req.flush(mockBreeds);

        service.setSearchQuery('beng');
        expect(service.filteredBreeds().length).toBe(1);
        expect(service.filteredBreeds()[0].name).toBe('Bengal');

        service.setSearchQuery('abys');
        expect(service.filteredBreeds().length).toBe(1);
        expect(service.filteredBreeds()[0].name).toBe('Abyssinian');

        service.clearSearch();
        expect(service.filteredBreeds().length).toBe(2);
    });

    it('should find breed by ID from state', () => {
        service.loadBreeds().subscribe();
        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        req.flush(mockBreeds);

        const breed = service.getBreedById('abys');
        expect(breed).toBeDefined();
        expect(breed?.name).toBe('Abyssinian');

        const notFound = service.getBreedById('unknown');
        expect(notFound).toBeUndefined();
    });
});
