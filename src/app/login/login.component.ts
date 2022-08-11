import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from './login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  passwordStatus = "none";
  error = '';
  constructor(private router: Router,
    private loginService: LoginServiceService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      emailId: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  showEmailErrors() {
    const usernameForm = this.loginForm.get('emailId');
    if (usernameForm.touched && !usernameForm.valid) {
      if (usernameForm.errors.required) {
        return 'Email/Phone number is required';
      }
      if (usernameForm.errors.email) {
        return 'Invalid Emai';
      }
      // regex 
    }
  }

  showPwErrors() {
    const passwordForm = this.loginForm.get('password');
    if (passwordForm.touched && !passwordForm.valid) {
      if (passwordForm.errors.required) {
        this.passwordStatus = "error";
        return 'Password is required';
      }
      if (passwordForm.errors.minlength) {
        return 'Password should be of minimum 8 characters length';
      }
    }
  }

  async onUserLogin() {

    if (this.loginForm.valid) {
      const response = await (await this.loginService.loginUser(this.loginForm.value)).toPromise()

      console.log(response  )

      if (response.data[0].message) {
        this.error = response.data[0].message;
      } else {
        if (
          response.data[0].usetType === 'admin' ||
          response.data[0].usetType === 'vendor'
        ) {
          localStorage.setItem('token', response.data[0].token);
          localStorage.setItem('user', JSON.stringify(response.data[0]));
          this.router.navigateByUrl('/lanch');
        } else {
          this.error = 'Try login with Admin / Vendor credentials';
        }
      }
    }

  }

}
