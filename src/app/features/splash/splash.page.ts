import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonSpinner } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { CatBreedsStore } from '../../core/store/cat-breeds.store';

@Component({
    selector: 'app-splash',
    templateUrl: './splash.page.html',
    styleUrls: ['./splash.page.scss'],
    imports: [IonContent, IonSpinner],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashPage implements OnInit, OnDestroy {
    private readonly router = inject(Router);
    private readonly store = inject(CatBreedsStore);

    private transitionTimeoutId: ReturnType<typeof setTimeout> | null = null;
    readonly splashDurationMs = 2000;

    ngOnInit(): void {
        this.hideNativeSplashScreen();
        this.preloadBreeds();
        this.scheduleNavigation();
    }

    ngOnDestroy(): void {
        if (this.transitionTimeoutId !== null) {
            clearTimeout(this.transitionTimeoutId);
            this.transitionTimeoutId = null;
        }
    }

    private hideNativeSplashScreen(): void {
        if (Capacitor.isNativePlatform()) {
            SplashScreen.hide().catch(() => {
                // Ignore errors when hiding native splash
            });
        }
    }

    private preloadBreeds(): void {
        void this.store.loadBreeds();
    }

    private scheduleNavigation(): void {
        this.transitionTimeoutId = setTimeout(() => {
            void this.router.navigate(['/home'], { replaceUrl: true });
        }, this.splashDurationMs);
    }
}
