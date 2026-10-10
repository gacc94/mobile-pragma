import { computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { CatBreed } from '../models/cat-breed.model';
import { CatBreedsService } from '../services/cat-breeds.service';

export interface CatBreedsState {
    readonly searchQuery: string;
    readonly selectedId: string | null;
    readonly displayedLimit: number;
    readonly pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 12;

const initialState: CatBreedsState = {
    searchQuery: '',
    selectedId: null,
    displayedLimit: DEFAULT_PAGE_SIZE,
    pageSize: DEFAULT_PAGE_SIZE,
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
    withComputed(
        ({ entities, searchQuery, selectedId, displayedLimit, entityMap, breedsResource, singleBreedResource }) => {
            const filteredBreeds = computed<CatBreed[]>(() => {
                const query = searchQuery().trim().toLowerCase();
                const allBreeds = entities();

                if (!query) {
                    return allBreeds;
                }

                return allBreeds.filter((breed) => breed.name.toLowerCase().includes(query));
            });

            const visibleBreeds = computed<CatBreed[]>(() => filteredBreeds().slice(0, displayedLimit()));

            const canLoadMore = computed<boolean>(() => visibleBreeds().length < filteredBreeds().length);

            return {
                filteredBreeds,
                visibleBreeds,
                canLoadMore,
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
        },
    ),
    withMethods((store) => ({
        /**
         * Re-fetches the breeds resource and resets displayed pagination limit.
         */
        loadBreeds(): void {
            patchState(store, { displayedLimit: DEFAULT_PAGE_SIZE });
            store.breedsResource.reload();
        },

        /**
         * Increases the visible limit of breeds rendered in the DOM by one pageSize.
         */
        loadMoreBreeds(): void {
            patchState(store, (state) => ({ displayedLimit: state.displayedLimit + state.pageSize }));
        },

        /**
         * Resets the progressive pagination window to initial page size.
         */
        resetPagination(): void {
            patchState(store, { displayedLimit: DEFAULT_PAGE_SIZE });
        },

        /**
         * Selects a breed ID to display in detail.
         */
        selectBreed(id: string | null): void {
            patchState(store, { selectedId: id });
        },

        /**
         * Updates the reactive search filter query and resets pagination.
         */
        setSearchQuery(query: string): void {
            patchState(store, { searchQuery: query, displayedLimit: DEFAULT_PAGE_SIZE });
        },

        /**
         * Resets the active search query and pagination limit.
         */
        clearSearch(): void {
            patchState(store, { searchQuery: '', displayedLimit: DEFAULT_PAGE_SIZE });
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
