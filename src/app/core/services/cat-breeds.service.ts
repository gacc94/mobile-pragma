import { Service } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CatBreed } from '../models/cat-breed.model';

@Service()
export class CatBreedsService {
    private readonly baseUrl = environment.catApiUrl;

    /**
     * Creates an httpResource for fetching all cat breeds.
     * Headers (x-api-key) are automatically injected by catApiKeyInterceptor.
     */
    getBreedsResource(): HttpResourceRef<CatBreed[]> {
        return httpResource<CatBreed[]>(() => `${this.baseUrl}/breeds`, {
            defaultValue: [],
        });
    }

    /**
     * Creates an httpResource for fetching a single cat breed by ID reactive computation.
     * When the computed ID is null or undefined, the HTTP request is skipped.
     */
    getBreedByIdResource(idComputation: () => string | null | undefined): HttpResourceRef<CatBreed | undefined> {
        return httpResource<CatBreed | undefined>(
            () => {
                const id = idComputation();
                if (!id) {
                    return undefined;
                }
                return `${this.baseUrl}/breeds/${id}`;
            },
            {
                defaultValue: undefined,
            },
        );
    }
}
