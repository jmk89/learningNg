import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]'
})
//custom structural directive, accessed with a "*" in the html template
export class UnlessDirective {
  @Input() set appUnless(condition: boolean) {
    //this setter gets executed any time the value of "unless" is changed
    if (!condition) {
      this.vcRef.createEmbeddedView(this.templateRef)
    } else {
      this.vcRef.clear();
    }
  }

  //template is the "what", view is the "where"
  constructor(private templateRef: TemplateRef<any>, private vcRef: ViewContainerRef) { }

}
