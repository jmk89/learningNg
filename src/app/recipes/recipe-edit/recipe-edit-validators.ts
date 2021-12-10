import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

export class RecipeEditValidators {
    static checkForbiddenRecipeName(control: FormControl): Promise<any> | Observable<any> {
        const promise = new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                if(control.value === 'chrinchins') {
                    resolve({'forbiddenRecipeName': true})
                } else {
                    resolve(null)
                }
            }, 2000)
        })
        return promise;
    }
}