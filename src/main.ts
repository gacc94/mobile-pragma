import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { catApiKeyInterceptor } from './app/core/interceptors/cat-api-key.interceptor';
import { bootstrapApplication } from '@angular/platform-browser';
import {
    RouteReuseStrategy,
    provideRouter,
    withComponentInputBinding,
    withPreloading,
    PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideHttpClient(withFetch(), withInterceptors([catApiKeyInterceptor])),
        provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    ],
});
