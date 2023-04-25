import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../interfaces/IUser';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = '@MassageSchedule: token';
  private userKey = '@MassageSchedule: user';
  private user = new BehaviorSubject<IUser | undefined>(
    JSON.parse(localStorage.getItem(this.userKey) as string)
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login({ username, password }: ILogin) {
    this.http
      .post(`${environment.apiUrl}/auth/login`, {
        username,
        password,
      })
      .subscribe(
        (result) => {
          const { access_token, user } = result as IData;
          localStorage.setItem(this.tokenKey, access_token);
          localStorage.setItem(this.userKey, JSON.stringify(user));
          this.user.next(user);
          this.router.navigate(['/dashboard']);
        },
        (error) => this.toastr.error(error.error.message || 'Error when login')
      );
  }

  updateUser(user: IUser) {
    this.user.next(user);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);

    this.router.navigate(['/']);
  }

  getToken(): string | undefined {
    const token = localStorage.getItem(this.tokenKey);
    return token || undefined;
  }

  getUser(): IUser | undefined {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : undefined;
  }

  getUserTwo(): Observable<IUser | undefined> {
    // const user = localStorage.getItem(this.userKey);
    return this.user.asObservable();
    //return user ? JSON.parse(user) : undefined;
  }
}

type ILogin = {
  username: string;
  password: string;
};

type IData = {
  access_token: string;
  user: IUser;
};
