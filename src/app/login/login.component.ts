import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  passwordStatus = "none";
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username : new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  showEmailErrors() {
    const usernameForm = this.loginForm.get('username');
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

  onUserLogin() {
   
    if(this.loginForm.valid){

      console.log(this.loginForm.value)
      this.router.navigateByUrl('/lanch')
    }
   
  }

}
