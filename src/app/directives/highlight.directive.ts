import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef,
    private render: Renderer2) { }

  @HostListener('mouseenter') onmouseenter() {
    this.render.addClass(this.el.nativeElement, 'highlight');
  } 

  @HostListener('mouseleave') onmouseleave() {
    this.render.removeClass(this.el.nativeElement, 'highlight');
  } 
}
