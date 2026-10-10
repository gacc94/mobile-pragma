import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonList,
    IonPopover,
    IonRadio,
    IonRadioGroup,
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
    contrastOutline,
    locationOutline,
    moonOutline,
    refreshOutline,
    searchOutline,
    star,
    sunnyOutline,
} from 'ionicons/icons';
import { CatBreedsStore } from '../../core/store/cat-breeds.store';
import { ThemeMode, ThemeStore } from '../../core/store/theme.store';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonPopover,
        IonList,
        IonItem,
        IonRadioGroup,
        IonRadio,
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
    readonly themeStore = inject(ThemeStore);
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
            sunnyOutline,
            moonOutline,
            contrastOutline,
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

    onSelectTheme(mode: string): void {
        if (mode === 'light' || mode === 'dark' || mode === 'system') {
            this.themeStore.setThemeMode(mode);
        }
    }
}
