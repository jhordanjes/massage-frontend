import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './signUp.component.html',
})
export class SignUpComponent implements OnInit {
  loginForm: FormGroup;
  fieldTextType: boolean;
  repeatFieldTextType: boolean;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.initRegForm();
  }

  initRegForm() {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.userService.createUser(this.loginForm.value);
  }
}
