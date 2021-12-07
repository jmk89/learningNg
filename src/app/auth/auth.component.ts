import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component } from "@angular/core";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error:string = null;

    constructor(private authService: AuthService) {}

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }

        this.isLoading = true;
        const email = form.value.email;
        const password = form.value.password;

        if (this.isLoginMode) {
            //...
        } else {
            this.authService.signup(email, password)
            .subscribe(response => {
                console.log(response);
                this.isLoading = false;
            }, error => {
                console.log(error);
                this.error = "An error occurred"
                this.isLoading = false;
            });
        }

        
        form.reset();
    }

}