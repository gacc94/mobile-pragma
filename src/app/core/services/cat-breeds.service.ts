import { Injectable, Service, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CatBreed } from '../models/cat-breed.model';

@Service()
export class CatBreedsService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = environment.catApiUrl;
    private readonly apiKey = environment.catApiKey;

    // Reactive State Signals
    private readonly breedsState = signal<CatBreed[]>([]);
    readonly breeds = this.breedsState.asReadonly();

    readonly isLoading = signal<boolean>(false);
    readonly error = signal<string | null>(null);
    readonly searchQuery = signal<string>('');

    // Computed filtered breeds based on search query (case-insensitive English filter)
    readonly filteredBreeds = computed(() => {
        const query = this.searchQuery().trim().toLowerCase();
        const allBreeds = this.breedsState();

        if (!query) {
            return allBreeds;
        }

        return allBreeds.filter((breed) => breed.name.toLowerCase().includes(query));
    });

    /**
     * Loads cat breeds from TheCatAPI and populates the reactive signal state.
     */
    loadBreeds(): Observable<CatBreed[]> {
        this.isLoading.set(true);
        this.error.set(null);

        const headers = new HttpHeaders({
            'x-api-key': this.apiKey,
        });

        return this.http.get<CatBreed[]>(`${this.baseUrl}/breeds`, { headers }).pipe(
            tap({
                next: (breeds) => {
                    this.breedsState.set(breeds);
                },
                error: (err) => {
                    const message = err?.message ?? 'Failed to load cat breeds. Please try again.';
                    this.error.set(message);
                },
            }),
            finalize(() => {
                this.isLoading.set(false);
            }),
            catchError((err) => {
                return throwError(() => err);
            }),
        );
    }

    /**
     * Returns a computed Signal with the breed matching the given ID from current state,
     * or fetches from the API if not yet in state.
     */
    getBreedById(id: string): CatBreed | undefined {
        return this.breedsState().find((breed) => breed.id === id);
    }

    /**
     * Fetches single breed by ID from API if direct URL navigation occurred.
     */
    fetchBreedById(id: string): Observable<CatBreed> {
        const headers = new HttpHeaders({
            'x-api-key': this.apiKey,
        });

        return this.http.get<CatBreed>(`${this.baseUrl}/breeds/${id}`, { headers });
    }

    /**
     * Updates the reactive search query for breed filtering.
     */
    setSearchQuery(query: string): void {
        this.searchQuery.set(query);
    }

    /**
     * Clears the active search query.
     */
    clearSearch(): void {
        this.searchQuery.set('');
    }
}
