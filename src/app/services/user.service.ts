import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces/IUser';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  createUser(data: IUser) {
    this.http.post(`${environment.apiUrl}/users`, data).subscribe(
      () => {
        this.toastr.success('User created successfully, login now');
        this.router.navigate(['/']);
      },
      (error) => this.toastr.error(error.error.message || 'Error when login')
    );
  }

  updateUser(data: IUser) {
    this.http.patch(`${environment.apiUrl}/users/${data._id}`, data).subscribe(
      () => {
        this.toastr.success('User updated successfully');
        this.authService.updateUser(data);
        this.router.parseUrl('/dashboard');
      },
      (error) => this.toastr.error(error.error.message || 'Error when updating')
    );
  }
}
