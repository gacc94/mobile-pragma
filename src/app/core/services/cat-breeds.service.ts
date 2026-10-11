import { Service } from '@angular/core';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CatBreed } from '../models/cat-breed.model';

@Service()
export class CatBreedsService {
    private readonly baseUrl = environment.catApiUrl;

    getBreedsResource(): HttpResourceRef<CatBreed[]> {
        return httpResource<CatBreed[]>(() => `${this.baseUrl}/breeds`, {
            defaultValue: [],
        });
    }

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
