import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
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

        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(CatBreedsService);
        TestBed.tick();
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created and initiate breeds fetch via httpResource', async () => {
        expect(service).toBeTruthy();
        expect(service.breeds()).toEqual([]);

        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('x-api-key')).toBe(
            'live_99Qe4Ppj34NdplyLW67xCV7Ds0oSLKGgcWWYnSzMJY9C0QOu0HUR4azYxWkyW2nr',
        );

        req.flush(mockBreeds);
        await Promise.resolve();
        TestBed.tick();

        expect(service.breeds()).toEqual(mockBreeds);
        expect(service.isLoading()).toBe(false);
        expect(service.error()).toBeNull();
    });

    it('should handle error when httpResource fails', async () => {
        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        req.flush('Failed to fetch', { status: 500, statusText: 'Internal Server Error' });
        await Promise.resolve();
        TestBed.tick();

        expect(service.isLoading()).toBe(false);
        expect(service.error()).toContain('500');
    });

    it('should reload breeds on loadBreeds()', async () => {
        const initialReq = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        initialReq.flush(mockBreeds);
        await Promise.resolve();
        TestBed.tick();

        expect(service.breeds().length).toBe(2);

        service.loadBreeds();
        TestBed.tick();

        const reloadReq = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        expect(reloadReq.request.method).toBe('GET');
        reloadReq.flush(mockBreeds);
        await Promise.resolve();
        TestBed.tick();

        expect(service.breeds()).toEqual(mockBreeds);
    });

    it('should filter breeds by search query case-insensitively', async () => {
        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        req.flush(mockBreeds);
        await Promise.resolve();
        TestBed.tick();

        service.setSearchQuery('beng');
        expect(service.filteredBreeds().length).toBe(1);
        expect(service.filteredBreeds()[0].name).toBe('Bengal');

        service.setSearchQuery('abys');
        expect(service.filteredBreeds().length).toBe(1);
        expect(service.filteredBreeds()[0].name).toBe('Abyssinian');

        service.clearSearch();
        expect(service.filteredBreeds().length).toBe(2);
    });

    it('should find breed by ID from state', async () => {
        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        req.flush(mockBreeds);
        await Promise.resolve();
        TestBed.tick();

        const breed = service.getBreedById('abys');
        expect(breed).toBeDefined();
        expect(breed?.name).toBe('Abyssinian');

        const notFound = service.getBreedById('unknown');
        expect(notFound).toBeUndefined();
    });

    it('should create a single breed resource with getBreedResource', async () => {
        const reqInitial = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        reqInitial.flush(mockBreeds);
        await Promise.resolve();
        TestBed.tick();

        const idSignal = signal<string | undefined>(undefined);
        const singleResource = TestBed.runInInjectionContext(() => service.getBreedResource(() => idSignal()));

        TestBed.tick();
        expect(singleResource.value()).toBeUndefined();
        httpTestingController.expectNone('https://api.thecatapi.com/v1/breeds/abys');

        idSignal.set('abys');
        TestBed.tick();

        const singleReq = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds/abys');
        expect(singleReq.request.method).toBe('GET');
        singleReq.flush(mockBreeds[0]);
        await Promise.resolve();
        TestBed.tick();

        expect(singleResource.value()?.name).toBe('Abyssinian');
    });
});
