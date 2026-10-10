import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { ThemeStore } from './core/store/theme.store';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
    // Eagerly initialize theme store to apply palette and listeners on boot
    private readonly themeStore = inject(ThemeStore);

    ngOnInit(): void {
        void this.initApp();
    }

    private async initApp(): Promise<void> {
        try {
            await SplashScreen.hide({ fadeOutDuration: 200 });
        } catch (error) {
            console.warn('Could not hide splash screen:', error);
        }
    }
}
