import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
    IonBackButton,
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonProgressBar,
    IonSkeletonText,
    IonTitle,
    IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
    alertCircleOutline,
    arrowBackOutline,
    heartOutline,
    locationOutline,
    refreshOutline,
    star,
    timeOutline,
} from 'ionicons/icons';
import { CatBreedsStore } from '../../core/store/cat-breeds.store';
import { ImageFallbackDirective } from '../../shared/directives/image-fallback.directive';
import { ImageUrlFallbackPipe } from '../../shared/pipes/image-url-fallback.pipe';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonBackButton,
        IonContent,
        IonIcon,
        IonBadge,
        IonButton,
        IonProgressBar,
        IonSkeletonText,
        ImageFallbackDirective,
        ImageUrlFallbackPipe,
    ],
})
export class DetailPage {
    readonly id = input<string>('');
    readonly store = inject(CatBreedsStore);

    readonly fallbackImageUrl = 'assets/splash/cat-rafiki.svg';

    constructor() {
        addIcons({
            arrowBackOutline,
            locationOutline,
            star,
            heartOutline,
            timeOutline,
            alertCircleOutline,
            refreshOutline,
        });

        effect(() => {
            const breedId = this.id();
            if (breedId) {
                this.store.selectBreed(breedId);
            }
        });
    }
}
