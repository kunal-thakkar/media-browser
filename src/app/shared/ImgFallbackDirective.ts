import { Directive, Input, ElementRef, HostListener, AfterViewInit } from "@angular/core";

@Directive({
    selector: 'img[fallback]'
})
export class ImgFallBackDirective implements AfterViewInit {
    @Input() lazySrc: string;
    @Input() fallback: string;

    element: HTMLImageElement = <HTMLImageElement>this.eRef.nativeElement;

    constructor(private eRef: ElementRef) { }

    ngAfterViewInit() {
        new IntersectionObserver((entries, observer) => {
            if (entries.length > 0 && entries[0].isIntersecting) {
                this.element.src = this.lazySrc;
                observer.unobserve(this.element);
                observer.disconnect();
            }
        }).observe(this.element);
    }

    @HostListener('error')
    loadFallbackOnError() {
        this.element.src = this.fallback;
    }

}