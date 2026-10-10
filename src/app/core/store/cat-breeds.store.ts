import { computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { CatBreed } from '../models/cat-breed.model';
import { CatBreedsService } from '../services/cat-breeds.service';

export interface CatBreedsState {
    readonly searchQuery: string;
    readonly selectedId: string | null;
}

const initialState: CatBreedsState = {
    searchQuery: '',
    selectedId: null,
};

export const CatBreedsStore = signalStore(
    { providedIn: 'root' },
    withEntities<CatBreed>(),
    withState(initialState),
    withProps(({ selectedId, entityMap }, catBreedsService = inject(CatBreedsService)) => ({
        breedsResource: catBreedsService.getBreedsResource(),
        // Only fetch single breed if selectedId is present AND not already cached in entityMap
        singleBreedResource: catBreedsService.getBreedByIdResource(() => {
            const id = selectedId();
            if (!id || entityMap()[id]) {
                return undefined;
            }
            return id;
        }),
    })),
    withComputed(({ entities, searchQuery, selectedId, entityMap, breedsResource, singleBreedResource }) => {
        const filteredBreeds = computed<CatBreed[]>(() => {
            const query = searchQuery().trim().toLowerCase();
            const allBreeds = entities();

            if (!query) {
                return allBreeds;
            }

            return allBreeds.filter((breed) => breed.name.toLowerCase().includes(query));
        });

        return {
            filteredBreeds,
            selectedBreed: computed<CatBreed | null>(() => {
                const id = selectedId();
                if (!id) {
                    return null;
                }
                return entityMap()[id] ?? singleBreedResource.value() ?? null;
            }),
            isLoading: computed<boolean>(() => breedsResource.isLoading() || singleBreedResource.isLoading()),
            error: computed<string | null>(() => {
                const err = breedsResource.error() ?? singleBreedResource.error();
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
            }),
            totalBreeds: computed<number>(() => entities().length),
            totalFilteredBreeds: computed<number>(() => filteredBreeds().length),
            hasBreeds: computed<boolean>(() => entities().length > 0),
        };
    }),
    withMethods((store) => ({
        /**
         * Re-fetches the breeds resource (e.g., on pull-to-refresh).
         */
        loadBreeds(): void {
            store.breedsResource.reload();
        },

        /**
         * Selects a breed ID to display in detail.
         */
        selectBreed(id: string | null): void {
            patchState(store, { selectedId: id });
        },

        /**
         * Updates the reactive search filter query.
         */
        setSearchQuery(query: string): void {
            patchState(store, { searchQuery: query });
        },

        /**
         * Resets the active search query.
         */
        clearSearch(): void {
            patchState(store, { searchQuery: '' });
        },

        /**
         * Synchronously finds a breed by ID in current entityMap.
         */
        getBreedById(id: string): CatBreed | undefined {
            return store.entityMap()[id];
        },
    })),
    withHooks({
        onInit(store) {
            // Automatically synchronize loaded breeds from httpResource into withEntities collection
            effect(() => {
                const breeds = store.breedsResource.value();
                if (breeds && breeds.length > 0) {
                    patchState(store, setAllEntities(breeds));
                }
            });

            // Automatically synchronize single loaded breed from httpResource into withEntities collection
            effect(() => {
                const single = store.singleBreedResource.value();
                if (single) {
                    patchState(store, setEntity(single));
                }
            });
        },
    }),
);

export type CatBreedsStore = InstanceType<typeof CatBreedsStore>;
