import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Functional HTTP interceptor that automatically attaches the TheCatAPI key header
 * to all outgoing requests directed at the API.
 */
export const catApiKeyInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    if (req.url.includes(environment.catApiUrl) && !req.headers.has('x-api-key')) {
        const clonedRequest = req.clone({
            setHeaders: {
                'x-api-key': environment.catApiKey,
            },
        });
        return next(clonedRequest);
    }

    return next(req);
};
