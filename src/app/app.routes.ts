import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'splash',
        pathMatch: 'full',
    },
    {
        path: 'splash',
        loadComponent: () => import('./features/splash/splash.page').then((m) => m.SplashPage),
        title: 'Catbreeds | Splash',
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
        title: 'Catbreeds | Breeds',
    },
    {
        path: 'detail/:id',
        loadComponent: () => import('./features/detail/detail.page').then((m) => m.DetailPage),
        title: 'Catbreeds | Detail',
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
