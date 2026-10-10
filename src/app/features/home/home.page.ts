import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonSearchbar,
    IonSkeletonText,
    IonTitle,
    IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
    alertCircleOutline,
    arrowDownOutline,
    locationOutline,
    refreshOutline,
    searchOutline,
    star,
} from 'ionicons/icons';
import { CatBreedsStore } from '../../core/store/cat-breeds.store';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        IonHeader,
        IonToolbar,
        IonTitle,
        IonSearchbar,
        IonContent,
        IonRefresher,
        IonRefresherContent,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
        IonSkeletonText,
        IonIcon,
        IonButton,
        IonBadge,
    ],
})
export class HomePage {
    readonly store = inject(CatBreedsStore);
    private readonly router = inject(Router);

    readonly fallbackImageUrl = 'assets/splash/cat-rafiki.svg';

    constructor() {
        addIcons({
            arrowDownOutline,
            alertCircleOutline,
            refreshOutline,
            searchOutline,
            locationOutline,
            star,
        });
    }

    onSearchInput(event: CustomEvent): void {
        const query = (event.detail?.value as string | undefined) ?? '';
        this.store.setSearchQuery(query);
    }

    onSearchClear(): void {
        this.store.clearSearch();
    }

    onRefresh(event: CustomEvent): void {
        this.store.loadBreeds();
        setTimeout(() => {
            const refresher = event.target as HTMLIonRefresherElement | null;
            refresher?.complete();
        }, 600);
    }

    onSelectBreed(breedId: string): void {
        this.store.selectBreed(breedId);
        void this.router.navigate(['/detail', breedId]);
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        if (img && !img.src.includes(this.fallbackImageUrl)) {
            img.src = this.fallbackImageUrl;
        }
    }
}
