import { Injectable } from "@angular/core";
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
        private store: Store<fromApp.AppState>
    ) { }

    setLogoutTimer(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration)
    }

    clearLogoutTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }

}