
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrls:['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

    userIsAuthenticated = false;
    
    private authListenerSubs : Subscription;

    constructor(private authservice : AuthService) {}

    ngOnInit() {
        this.userIsAuthenticated = this.authservice.getIsAuth();
        this.authListenerSubs = this.authservice
        .getAuthListener()
        .subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
        });
    }

    OnLogout() {
        this.authservice.logout();
    }
    
    ngOnDestroy() {
        this.authListenerSubs.unsubscribe();

    }

}