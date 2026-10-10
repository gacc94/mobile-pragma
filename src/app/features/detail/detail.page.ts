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

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        if (img && !img.src.includes(this.fallbackImageUrl)) {
            img.src = this.fallbackImageUrl;
        }
    }
}
