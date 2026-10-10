import { describe, it, expect } from 'vitest';
import { ImageUrlFallbackPipe } from './image-url-fallback.pipe';

describe('ImageUrlFallbackPipe', () => {
    const pipe = new ImageUrlFallbackPipe();
    const defaultFallback = 'assets/splash/cat-rafiki.svg';

    it('should return url if valid non-empty string is provided', () => {
        const validUrl = 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg';
        expect(pipe.transform(validUrl)).toBe(validUrl);
    });

    it('should return default fallback if url is null', () => {
        expect(pipe.transform(null)).toBe(defaultFallback);
    });

    it('should return default fallback if url is undefined', () => {
        expect(pipe.transform(undefined)).toBe(defaultFallback);
    });

    it('should return default fallback if url is empty string', () => {
        expect(pipe.transform('')).toBe(defaultFallback);
        expect(pipe.transform('   ')).toBe(defaultFallback);
    });

    it('should return custom fallback if provided and url is missing', () => {
        const customFallback = 'assets/custom.png';
        expect(pipe.transform(null, customFallback)).toBe(customFallback);
    });
});
