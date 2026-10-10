import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CatBreedsStore } from './cat-breeds.store';
import { CatBreedsService } from '../services/cat-breeds.service';
import { catApiKeyInterceptor } from '../interceptors/cat-api-key.interceptor';
import { CatBreed } from '../models/cat-breed.model';

describe('CatBreedsStore', () => {
    let store: CatBreedsStore;
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
            providers: [
                CatBreedsService,
                CatBreedsStore,
                provideHttpClient(withInterceptors([catApiKeyInterceptor])),
                provideHttpClientTesting(),
            ],
        });

        httpTestingController = TestBed.inject(HttpTestingController);
        store = TestBed.inject(CatBreedsStore);
        TestBed.flushEffects();
    });

    afterEach(() => {
        httpTestingController.verify();
        TestBed.resetTestingModule();
    });

    it('should initialize and automatically sync loaded breeds via httpResource and onInit hook', async () => {
        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        expect(req.request.headers.get('x-api-key')).toBeTruthy();

        req.flush(mockBreeds);
        await Promise.resolve();
        TestBed.flushEffects();

        expect(store.entities()).toEqual(mockBreeds);
        expect(store.totalBreeds()).toBe(2);
        expect(store.hasBreeds()).toBe(true);
        expect(store.isLoading()).toBe(false);
    });

    it('should filter breeds dynamically by search query in English', async () => {
        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        req.flush(mockBreeds);
        await Promise.resolve();
        TestBed.flushEffects();

        store.setSearchQuery('beng');
        expect(store.filteredBreeds().length).toBe(1);
        expect(store.filteredBreeds()[0].name).toBe('Bengal');
        expect(store.totalFilteredBreeds()).toBe(1);

        store.setSearchQuery('ABYS');
        expect(store.filteredBreeds().length).toBe(1);
        expect(store.filteredBreeds()[0].name).toBe('Abyssinian');

        store.clearSearch();
        expect(store.filteredBreeds().length).toBe(2);
    });

    it('should select breed from entityMap when cached without triggering an HTTP request', async () => {
        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        req.flush(mockBreeds);
        await Promise.resolve();
        TestBed.flushEffects();

        store.selectBreed('abys');
        TestBed.flushEffects();

        httpTestingController.expectNone('https://api.thecatapi.com/v1/breeds/abys');
        expect(store.selectedBreed()?.name).toBe('Abyssinian');

        store.selectBreed(null);
        expect(store.selectedBreed()).toBeNull();
    });

    it('should fetch single breed via singleBreedResource when selecting uncached breed', async () => {
        const initialReq = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        initialReq.flush(mockBreeds);
        await Promise.resolve();
        TestBed.flushEffects();

        store.selectBreed('pers');
        TestBed.flushEffects();

        const singleReq = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds/pers');
        singleReq.flush({
            id: 'pers',
            name: 'Persian',
            origin: 'Iran',
            description: 'Quiet and gentle...',
            life_span: '10 - 17',
            adaptability: 5,
            intelligence: 3,
        } as CatBreed);
        await Promise.resolve();
        TestBed.flushEffects();

        expect(store.selectedBreed()?.name).toBe('Persian');
        expect(store.entityMap()['pers']).toBeDefined();
    });

    it('should reload breeds via loadBreeds()', async () => {
        const initialReq = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        initialReq.flush(mockBreeds);
        await Promise.resolve();
        TestBed.flushEffects();

        store.loadBreeds();
        TestBed.flushEffects();

        const reloadReq = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        reloadReq.flush(mockBreeds);
        await Promise.resolve();
        TestBed.flushEffects();

        expect(store.entities().length).toBe(2);
    });

    it('should find breed by ID synchronously with getBreedById', async () => {
        const req = httpTestingController.expectOne('https://api.thecatapi.com/v1/breeds');
        req.flush(mockBreeds);
        await Promise.resolve();
        TestBed.flushEffects();

        const found = store.getBreedById('beng');
        expect(found?.name).toBe('Bengal');

        const notFound = store.getBreedById('unknown');
        expect(notFound).toBeUndefined();
    });
});
