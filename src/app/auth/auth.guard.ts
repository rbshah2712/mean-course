import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";

export const AuthGuard : CanActivateFn = (route, state) => {

    const authService = inject(AuthService);
    const router = inject(Router);
    const isAuth = authService.getIsAuth();
    if(!isAuth) {
        router.navigate(['/auth/login']);
    }
    return isAuth;
}