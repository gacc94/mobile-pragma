import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
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
