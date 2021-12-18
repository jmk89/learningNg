import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

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

@Injectable({providedIn: 'root'})
export class AuthService {
    //previously used a normal Subject, now switching to a BehaviorSubject
    //user = new Subject<User>();
    //let's us get access to the previously emitted User upon subscription, rather than only the next emitted user
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient, 
        private router: Router, 
        private store: Store<fromApp.AppState>
    ) { }

    //check out https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
    //to see why the post request is constructed this way. The inline javascript object
    //matches the Request Body Payload in order to submit a signup
    //Post request yields response of the AuthResponseData
    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            //allows us to step into the observable chain without changing or stopping it
            //just allows us to execute some code using the response data, in this case AuthResponseData
            tap(responseData => {
                this.handleAuthentication(
                    responseData.email, 
                    responseData.localId, 
                    responseData.idToken, 
                    +responseData.expiresIn);
            })
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(
                    responseData.email, 
                    responseData.localId, 
                    responseData.idToken, 
                    +responseData.expiresIn);
            })
        )
    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))
        if (loadedUser.token) {
            //this.user.next(loadedUser);
            //removing the usage of behaviorSubject in favor of dispatching an ngrx action
            this.store.dispatch(new AuthActions.Login({
                email: loadedUser.email,
                userID: loadedUser.id,
                token: loadedUser.token,
                expirationDate: new Date(userData._tokenExpirationDate)
            }))
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        //this.user.next(null);
        this.store.dispatch(new AuthActions.Logout());
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        //this.user.next(user);
        this.store.dispatch(
            new AuthActions.Login({
                email: email,
                userID: userId,
                token: token,
                expirationDate: expirationDate
            })
        );
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = "An unknown error occurred"
        //check if the errorResponse has the expected object structure
        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage)
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
        return throwError(errorMessage);
    }

}