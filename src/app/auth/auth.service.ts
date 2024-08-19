import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})
export class AuthService {
   private token: string;
   private authStatusListener = new Subject<boolean>();
   private isAuthenticated = false;

    constructor(private httpclient:HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getAuthListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string,password: string) {
        const authData : AuthData = {email:email, password:password};
        this.httpclient.post("http://localhost:3000/api/user/signup",authData)
        .subscribe(response => {
            console.log(response);
        })
    }

    login(email:string,password:string){
        const authData : AuthData = {email:email, password:password};
        this.httpclient.post<{token: string}>("http://localhost:3000/api/user/login",authData)
          .subscribe(response => {
            const token = response.token;
            this.token = token;
            if(token) {
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                this.router.navigate(['/']);
            }
          
        })
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
    }


}