import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ImageFallbackDirective } from './image-fallback.directive';

@Component({
    standalone: true,
    imports: [ImageFallbackDirective],
    template: `
        <img id="test-img-custom" src="https://invalid-url.com/cat.jpg" [appImageFallback]="customFallback" />
        <img id="test-img-default" src="https://invalid-url.com/default-cat.jpg" appImageFallback />
    `,
})
class TestHostComponent {
    customFallback = 'assets/custom-fallback.png';
}

describe('ImageFallbackDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should replace src with custom fallback url on error event', () => {
        const imgEl = fixture.nativeElement.querySelector('#test-img-custom') as HTMLImageElement;
        expect(imgEl).toBeTruthy();

        imgEl.dispatchEvent(new Event('error'));
        fixture.detectChanges();

        expect(imgEl.src).toContain('assets/custom-fallback.png');
    });

    it('should replace src with default fallback url on error event when no input provided', () => {
        const imgEl = fixture.nativeElement.querySelector('#test-img-default') as HTMLImageElement;
        expect(imgEl).toBeTruthy();

        imgEl.dispatchEvent(new Event('error'));
        fixture.detectChanges();

        expect(imgEl.src).toContain('assets/splash/cat-rafiki.svg');
    });
});
