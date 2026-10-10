import { Service, computed, signal } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CatBreed } from '../models/cat-breed.model';

@Service()
export class CatBreedsService {
    private readonly baseUrl = environment.catApiUrl;
    private readonly apiKey = environment.catApiKey;

    /**
     * Primary reactive HTTP resource for fetching all cat breeds.
     * httpResource automatically dispatches the GET request on creation and
     * manages loading, error, and resolved signal states natively.
     */
    readonly breedsResource: HttpResourceRef<CatBreed[]> = httpResource<CatBreed[]>(
        () => ({
            url: `${this.baseUrl}/breeds`,
            headers: {
                'x-api-key': this.apiKey,
            },
        }),
        {
            defaultValue: [],
        },
    );

    // Derived State Signals
    readonly breeds = computed<CatBreed[]>(() => this.breedsResource.value());
    readonly isLoading = this.breedsResource.isLoading;
    readonly status = this.breedsResource.status;

    readonly error = computed<string | null>(() => {
        const err = this.breedsResource.error();
        if (!err) {
            return null;
        }
        if (typeof err === 'string') {
            return err;
        }
        if (err instanceof Error) {
            return err.message;
        }
        return (err as { message?: string })?.message ?? 'Failed to load cat breeds. Please try again.';
    });

    readonly searchQuery = signal<string>('');

    // Computed filtered breeds based on search query (case-insensitive English filter)
    readonly filteredBreeds = computed<CatBreed[]>(() => {
        const query = this.searchQuery().trim().toLowerCase();
        const allBreeds = this.breeds();

        if (!query) {
            return allBreeds;
        }

        return allBreeds.filter((breed) => breed.name.toLowerCase().includes(query));
    });

    /**
     * Imperatively triggers a reload of the breeds resource.
     * Useful for pull-to-refresh or retry buttons.
     */
    loadBreeds(): void {
        this.breedsResource.reload();
    }

    /**
     * Finds a breed by ID in the currently loaded state.
     */
    getBreedById(id: string): CatBreed | undefined {
        return this.breeds().find((breed) => breed.id === id);
    }

    /**
     * Creates an httpResource for a single breed by ID computation/signal.
     * If the ID is undefined or empty, no request is dispatched.
     */
    getBreedResource(idComputation: () => string | undefined): HttpResourceRef<CatBreed | undefined> {
        return httpResource<CatBreed | undefined>(
            () => {
                const id = idComputation();
                if (!id) {
                    return undefined;
                }

                return {
                    url: `${this.baseUrl}/breeds/${id}`,
                    headers: {
                        'x-api-key': this.apiKey,
                    },
                };
            },
            {
                defaultValue: undefined,
            },
        );
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
