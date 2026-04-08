import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Authservice } from '../services/authservice';
import { UserInt } from '../interfaces/user-int';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginpage',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './loginpage.html',
  styleUrl: './loginpage.css',
})
export class Loginpage {
  temp= "login"  

  logvalue(){
    this.temp="login";
  }
  signvalue(){
    this.temp="signin"
  }

  loginform: FormGroup; 
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authservice: Authservice,
    private router: Router
  ) {
    this.loginform = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-ZÀ-ÿ_]{2,}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginform.valid) {
      const username = this.loginform.get('username')?.value;
      const email = this.loginform.get('email')?.value;
      const password = this.loginform.get('password')?.value;
      // console.log(this.loginform.get('username')?.value,this.loginform.get('email')?.value) - works good
      if (this.temp === "login") {
        this.loginUser(username, password);
      } else if (this.temp === "signin"){
        this.registerUser(username, email, password);
      }
    }
  }
  loginUser(username: string, password: string) { 
    this.authservice.login(username, password).subscribe({ 
      next: (user) => { 
        if (user.length > 0) { 
          this.handleLoginSuccess(user[0]); 
          } else { 
           alert("Invalid username or password"); 
          }
        },
      error: () => { 
        alert("Login failed. Please check your credentials."); 
      } 
    }); 
  }
  registerUser(name: string, email: string, password: string) {
    const newUser: UserInt = {
      id: Date.now().toString(), // Generates unique ID
      username:name,
      email,
      password
    };

    this.authservice.register(newUser).subscribe({
      next: (user) => {
        this.handleLoginSuccess(user);
        alert("Registration successful! You are now logged in.");
      },
      error: (err) => {
        alert("Registration failed. Please try again.");
      }
    });
  }

  handleLoginSuccess(user: UserInt) {
    sessionStorage.setItem("username",user.username);
    sessionStorage.setItem("id",user.id);
    this.router.navigateByUrl("homepage");
  }
}

