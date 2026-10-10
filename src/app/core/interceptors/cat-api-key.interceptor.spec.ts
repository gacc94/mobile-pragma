import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { catApiKeyInterceptor } from './cat-api-key.interceptor';
import { environment } from '../../../environments/environment';

describe('catApiKeyInterceptor', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(withInterceptors([catApiKeyInterceptor])), provideHttpClientTesting()],
        });

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should attach x-api-key header when request targets TheCatAPI', () => {
        httpClient.get(`${environment.catApiUrl}/breeds`).subscribe();

        const req = httpTestingController.expectOne(`${environment.catApiUrl}/breeds`);
        expect(req.request.headers.has('x-api-key')).toBe(true);
        expect(req.request.headers.get('x-api-key')).toBe(environment.catApiKey);
        req.flush([]);
    });

    it('should not attach x-api-key header to third-party URLs', () => {
        httpClient.get('https://other-api.example.com/data').subscribe();

        const req = httpTestingController.expectOne('https://other-api.example.com/data');
        expect(req.request.headers.has('x-api-key')).toBe(false);
        req.flush({});
    });
});
