import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, ComponentFactoryResolver, ViewChild } from "@angular/core";
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoginMode = true;
    isLoading = false;
    error:string = null;
    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {}

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

        let authObservable: Observable<AuthResponseData>

        if (this.isLoginMode) {
            authObservable = this.authService.login(email,password)            
        } else {
            authObservable = this.authService.signup(email, password)
        }

        authObservable.subscribe(
            response => {
                console.log(response);
                this.isLoading = false;
                this.router.navigate(["/recipes"]);
            }, 
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
            });

        form.reset();
    }

    onHandleError() {
        this.error = null;
    }

    private showErrorAlert(message: string) {
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear() //just in case anything was rendered previously

        hostViewContainerRef.createComponent(alertComponentFactory);
    }

}