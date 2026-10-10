import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CatBreedsService } from './cat-breeds.service';
import { catApiKeyInterceptor } from '../interceptors/cat-api-key.interceptor';
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
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CatBreedsService,
                provideHttpClient(withInterceptors([catApiKeyInterceptor])),
                provideHttpClientTesting(),
            ],
        });

        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(CatBreedsService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create breedsResource and fetch with intercepted api key header', async () => {
        const resource = TestBed.runInInjectionContext(() => service.getBreedsResource());
        TestBed.flushEffects();

        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('x-api-key')).toBe(
            'live_99Qe4Ppj34NdplyLW67xCV7Ds0oSLKGgcWWYnSzMJY9C0QOu0HUR4azYxWkyW2nr',
        );

        req.flush(mockBreeds);
        await Promise.resolve();
        TestBed.flushEffects();

        expect(resource.value()).toEqual(mockBreeds);
    });

    it('should skip request when breed ID is null or undefined in getBreedByIdResource', async () => {
        const idSignal = signal<string | null>(null);
        const resource = TestBed.runInInjectionContext(() => service.getBreedByIdResource(() => idSignal()));

        TestBed.flushEffects();
        httpTestingController.expectNone('https://api.thecatapi.com/v1/breeds');
        expect(resource.value()).toBeUndefined();

        idSignal.set('abys');
        TestBed.flushEffects();

        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds/abys');
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.has('x-api-key')).toBe(true);

        req.flush(mockBreeds[0]);
        await Promise.resolve();
        TestBed.flushEffects();

        expect(resource.value()).toEqual(mockBreeds[0]);
    });
});
