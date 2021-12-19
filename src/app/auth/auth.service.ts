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
    // Behavior Subject - 
    // Can access the prev emitted User upon subscription, rather than only the next emitted user
    //user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient, 
        private router: Router, 
        private store: Store<fromApp.AppState>
    ) { }

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
            this.store.dispatch(new AuthActions.AuthenticateSuccess({
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
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            //this.logout();
            console.log("auto logout")
        }, expirationDuration)
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        //this.user.next(user);
        this.store.dispatch(
            new AuthActions.AuthenticateSuccess({
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