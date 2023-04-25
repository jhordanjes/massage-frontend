import { Component, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  faPen = faPen;
  currentUser: IUser;
  page: 'FORM' | 'AVATAR' = 'FORM';
  loginForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl(''),
    email: new FormControl(''),
  });
  onCangePageValue = this.changePageValue.bind(this);

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    const user = this.authService.getUser();
    if (user) {
      this.currentUser = user;

      this.loginForm.setValue({
        name: user.name,
        username: user.username,
        email: user.email,
      });
    }
  }

  changePageValue(value: 'FORM' | 'AVATAR') {
    this.page = value;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const values = this.loginForm.value as IUser;
    this.userService.updateUser({
      ...values,
      _id: this.currentUser._id,
    });
  }
}
