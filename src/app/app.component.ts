import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
    async ngOnInit() {
        await SplashScreen.hide({ fadeOutDuration: 200 });
    }
}
