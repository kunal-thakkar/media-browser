import { Directive, Input, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: 'img[fallback]'
})
export class ImgFallBackDirective {
    @Input() fallback: string;

    constructor(private eRef: ElementRef){}

    @HostListener('error')
    loadFallbackOnError(){
        const element: HTMLImageElement = <HTMLImageElement>this.eRef.nativeElement;
        element.src = this.fallback;
    }

}