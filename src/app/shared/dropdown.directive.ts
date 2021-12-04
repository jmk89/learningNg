import { Directive, ElementRef, HostBinding, HostListener, OnInit } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
}) 

export class DropdownDirective implements OnInit {
    @HostBinding('class.open') opened = false;
    @HostListener('document:click', ['$event']) toggleDropdown(event: Event) {
        this.opened = this.elRef.nativeElement.contains(event.target) ? !this.opened : false;
    }

    constructor(private elRef: ElementRef) {}

    ngOnInit() {
        this.opened = false;
    }

}