import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from './auth.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        //returning the user observable isn't quite right, because the canActivate method requires a boolean observable
        //so we use pipe and map to transform the observable to boolean
        return this.authService.user
        .pipe(
            take(1), //just need to listen once, could cause unknown effects if listening all the time
            map(user => {
                const isAuth = !!user;
                if (isAuth) {
                    return true;
                }
            return this.router.createUrlTree(['/auth']);
            })
        );


        //below is old way of navigating upon auth guard failure
        //use tap operator to perform some work which doesn't
        //directly affect the observables in the chain.
        //tap is useful. I'm kind of getting it now
        //however this old method can lead to race conditions
        //new rxjs approach above, with url tree observable
        // return this.authService.user
        // .pipe(
        //     map(user => {
        //         //nifty trick (if exists ? false: true)
        //         return !!user;
        //     }), 
        //     tap(isAuth => {
        //         this.router.navigate(['/auth'])
        //     })
        // );

    }

}