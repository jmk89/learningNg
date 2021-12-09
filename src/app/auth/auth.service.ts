import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from './user.model';

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

    constructor(private http: HttpClient) { }

    //check out https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
    //to see why the post request is constructed this way. The inline javascript object
    //matches the Request Body Payload in order to submit a signup
    //Post request yields response of the AuthResponseData
    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCmN3uD-8g8DD4Yt4Q8bDCosC46y7QBO6A',
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
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCmN3uD-8g8DD4Yt4Q8bDCosC46y7QBO6A",
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

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
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