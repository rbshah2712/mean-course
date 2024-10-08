import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
    templateUrl:'./login.component.html',
    styleUrls:['./login.component.css']
})

export class LoginComponent {
    isLoading = false;
    private authStatusSubs: Subscription;

    constructor(public authService:AuthService){}

    ngOnInit() {
        this.authStatusSubs = this.authService.getAuthListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
    }

    onLogin(form:NgForm) {
    if(form.invalid){
        return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email,form.value.password);

    }

    ngOnDestroy() {
        this.authStatusSubs.unsubscribe();
    }

}