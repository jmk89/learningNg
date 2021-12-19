import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

//defined at https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
//not a requirement of Angular, but makes life easier to have it defined in an interface
export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean //this is only used for sign in requests, not sign UP requests
}

@Injectable()
export class AuthEffects {
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(
                "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                map(resData => {
                    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
                    return new AuthActions.Login({
                        email: resData.email,
                        userID: resData.localId,
                        token: resData.idToken,
                        expirationDate: expirationDate
                    });
                }),
                catchError(errorResponse => {
                    let errorMessage = "An unknown error occurred"
                    //check if the errorResponse has the expected object structure
                    if (!errorResponse.error || !errorResponse.error.error) {
                        return of(new AuthActions.LoginFail(errorMessage))
                    }
                    switch (errorResponse.error.error.message) {
                        case 'EMAIL_EXISTS':
                            errorMessage = "Email already exists"
                            break;
                        case 'EMAIL_NOT_FOUND':
                            errorMessage = "Email doesn't exist"
                            break;
                        case 'INVALID_PASSWORD':
                            errorMessage = "Incorrect password"
                            break;
                    }
                    return of(new AuthActions.LoginFail(errorMessage));
                }), 

            );
            
        }),
    );

    //this is an effect which will not yield a dispatchable action at the end
    @Effect({dispatch: false})
    authSuccess = this.actions$.pipe(
        ofType(AuthActions.LOGIN), 
        tap(() => {
            this.router.navigate(['/']);
        })
    )
    
    //the $ sign is a convention recommended from ngrx team
    constructor(
        private actions$: Actions, 
        private http: HttpClient,
        private router: Router
    ) { }

}