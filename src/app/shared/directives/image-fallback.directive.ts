import { Directive, input } from '@angular/core';

@Directive({
    selector: 'img[appImageFallback]',
    standalone: true,
    host: {
        '(error)': 'onError($event)',
    },
})
export class ImageFallbackDirective {
    readonly fallback = input<string, string | undefined>('assets/splash/cat-rafiki.svg', {
        alias: 'appImageFallback',
        transform: (val: string | undefined) => (val && val.trim().length > 0 ? val : 'assets/splash/cat-rafiki.svg'),
    });

    protected onError(event: Event): void {
        const img = event.target as HTMLImageElement | null;
        const fallbackUrl = this.fallback();
        if (img && !img.src.includes(fallbackUrl)) {
            img.src = fallbackUrl;
        }
    }
}
