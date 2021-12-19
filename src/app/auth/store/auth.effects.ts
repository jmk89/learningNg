import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../user.model';

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

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userID: userId,
        token: token,
        expirationDate: expirationDate
    });
};

const handleError = (errorResponse: any) => {
    let errorMessage = "An unknown error occurred"
    //check if the errorResponse has the expected object structure
    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage))
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
    return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
                }),
                catchError(errorResponse => {
                    return handleError(errorResponse);
                })
            );
        })
    )

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
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
                }),
                catchError(errorResponse => {
                    return handleError(errorResponse);
                })
            );
        }),
    );

    //this is an effect which will not yield a dispatchable action at the end
    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS), 
        tap(() => {
            this.router.navigate(['/']);
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string,
                id: string,
                _token: string,
                _tokenExpirationDate: string
            } = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                return { type: 'DUMMY'};
            }
    
            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))
            if (loadedUser.token) {
                //this.user.next(loadedUser);
                //removing the usage of behaviorSubject in favor of dispatching an ngrx action
                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email,
                    userID: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate)
                });
                // const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                // this.autoLogout(expirationDuration);
            }
            return { type: 'DUMMY'};
        })
    )

    @Effect({dispatch: false})
    authLogout = this.actions$.
        pipe(
            ofType(AuthActions.LOGOUT),
            tap(() => {
                console.log("authLogout Effect")
                localStorage.removeItem('userData');
        })
    );
    
    
    //the $ sign is a convention recommended from ngrx team
    constructor(
        private actions$: Actions, 
        private http: HttpClient,
        private router: Router
    ) { }

}