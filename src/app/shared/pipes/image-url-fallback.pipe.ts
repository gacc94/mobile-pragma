import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'imageUrlFallback',
    standalone: true,
    pure: true,
})
export class ImageUrlFallbackPipe implements PipeTransform {
    transform(url: string | null | undefined, fallback: string = 'assets/splash/cat-rafiki.svg'): string {
        if (!url || typeof url !== 'string' || url.trim().length === 0) {
            return fallback;
        }
        return url;
    }
}
