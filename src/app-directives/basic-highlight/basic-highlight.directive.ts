import { Directive, ElementRef, OnInit } from "@angular/core";

@Directive({
    selector: '[appBasicHighlight]' //wrapping in square brackets means its an attribute of an element, rather than an element.
})
export class BasicHighlightDirective implements OnInit{
    
    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        this.elementRef.nativeElement.style.backgroundColor = 'green';
    }

}