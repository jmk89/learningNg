import { Actions, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';

export class AuthEffects {
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START)
    );
    
    //the $ sign is a convention recommended from ngrx team
    constructor(private actions$: Actions) { }

}