import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

//defined at https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
//not a requirement of Angular, but makes life easier to have it defined in an interface
interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
}

@Injectable({providedIn: 'root'})
export class AuthService {

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
            catchError(errorResponse => {
                let errorMessage = "An unknown error occurred"
                //check if the errorResponse has the expected object structure
                if (!errorResponse.error || !errorResponse.error.error) {
                    return throwError(errorMessage)
                }
                switch (errorResponse.error.error.message) {
                    case 'EMAIL_EXISTS':
                        errorMessage = "Email already exists"
                }
                return throwError(errorMessage);
            })
        );
    }

}