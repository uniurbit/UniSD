import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { AppConstants } from '../app-constants';



interface LoginResponse {
  accessToken: string;
  accessExpiration: number;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private authUrl: string;
    private loggedIn = new BehaviorSubject<boolean>(false);

    _username: string;
    _roles: string[]  = [''];
    _id: number;
    _email: string;
    _dips: string[];

    static TOKEN = 'tokenUNISD'

    constructor( private http: HttpClient,
                 public jwtHelper: JwtHelperService,
                 private router: Router,
                 private permissionsService: NgxPermissionsService ) {
        this.loggedIn.next(this.isAuthenticated());
        this.authUrl = AppConstants.baseURL;
    }

    login() {
        // il login purtroppo non passa da questo metodo.
        // Effetuando la chimamata da una sorgente diversa da quello del server
        // otteniamo un errore CORS

        return this.http.get(`${this.authUrl}/loginSaml`, httpOptions)
        .subscribe(res => {
            // if (res.headers.get(AuthService.TOKEN)) {
            //   localStorage.setItem('auth_token', res.headers.get('token'));
            //   this.loggedIn = true;
            // }
            // console.log(res.accessToken, res.accessExpiration);
            // localStorage.setItem('auth_token', res.accessToken);
            console.log(res);
        });
    }

    refreshToken() {
        return this.http.post<any>(`${this.authUrl}/api/auth/refreshtoken`, {
          'refreshToken': this.getToken()
        }).pipe(tap((data) => {
          this.storeJwtToken(data.token);
        }));
    }
    
    loginWithToken(token: any) {
        localStorage.setItem(AuthService.TOKEN, token);
        this.loggedIn.next(this.isAuthenticated());
        this.reload();
    }

    reload(): any {
        if (this.isAuthenticated()) {
            const helper = new JwtHelperService();
            const decodedToken = helper.decodeToken(localStorage.getItem(AuthService.TOKEN));
            this._email = decodedToken['email'];
            this._username = decodedToken['name'];
            this._roles = decodedToken['roles'];
            this._dips = decodedToken['dips'];
            this._id = decodedToken['id'];
            this.permissionsService.loadPermissions(this._roles);
        }
    }

    redirectFirstLogin(){

        const permissions = this.permissionsService.getPermissions();
        this.permissionsService.permissions$.subscribe((permissions) => {
            if (permissions['SUPER-ADMIN']){
                this.router.navigate(['home/lista-domande']);                    
            }else if(permissions['OP_DOCENTE']){
                this.router.navigate(['home/dashboard/dashboarddocenti']); 
            }else if(permissions['OP_COMMISSIONE']){
                this.router.navigate(['home/dashboard/dashboardcommissione']); 
            } else {
                this.router.navigate(['home']); 
            }
        });

    }


    resetFields() {
        this._username = '';
        this._id = null;
        this._roles = [];
        this._email = '';
    }

    getToken() {
        return localStorage.getItem(AuthService.TOKEN);
    }

    private storeJwtToken(jwt: string) {
        localStorage.setItem(AuthService.TOKEN, jwt);
    }

    logout() {

        this.http.get(this.authUrl + "api/auth/logout", httpOptions)
        .subscribe(res => {
            console.log(res);
        });

        localStorage.removeItem(AuthService.TOKEN);
        localStorage.clear();
        this.permissionsService.flushPermissions();
        this.resetFields();
        this.loggedIn.next(false);
    }

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    public get userid(): number {
        return this._id;
    }

    public get email(): string {
        return this._email;
    }

    public get username(): string {
        return this._username;
    }

    public get roles(): string[] {
        return this._roles;
    }

    public get dips(): string[] {
        return this._dips;
    }

    public isAuthenticated(): boolean {
        const token = localStorage.getItem(AuthService.TOKEN);
        // alert(token);
        // Check whether the token is expired and return
        // true or false
        return !this.jwtHelper.isTokenExpired(token);
    }

    /**
     * Handle any errors from the API
     */
    private handleError(err) {
        let errMessage: string;
        errMessage = '';
        // if (err instanceof Response) {
        //   let body = err.json() || '';
        //   let error = body.error || JSON.stringify(body);
        //   errMessage = `${err.status} - ${err.statusText || ''} ${error}`;
        // } else {
        //   errMessage = err.message ? err.message : err.toString();
        // }

        return Observable.throw(errMessage);
    }
}
