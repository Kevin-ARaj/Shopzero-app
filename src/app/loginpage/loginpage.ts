import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Authservice } from '../services/authservice';
import { LogReq } from '../interfaces/LogReq';
import { Router } from '@angular/router';
import { LogRes } from '../interfaces/LogRes';
import { UserReq } from '../interfaces/UserReq';

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
        const userdet:LogReq = {
          email,
          password
        }
        this.loginUser(userdet);
      } else if (this.temp === "signin"){
        this.registerUser(username, email, password);
      }
    }
  }
  loginUser(userdet:LogReq) { 
    this.authservice.login(userdet).subscribe({ 
      next: (user) => { 
          this.handleLoginSuccess(user);   
        },
      error: () => { 
        alert("Login failed. Please check your credentials."); 
      } 
    }); 
  }
  registerUser(name: string, email: string, password: string) {
    const newUser: UserReq = {
      name,
      email,
      password
    };

    this.authservice.register(newUser).subscribe({
      next: (user) => {
        alert("Registration successful! You are now logged in.");
        this.handleLoginSuccess(user);
      },
      error: (err) => {
        alert("Registration failed. Please try again.");
      }
    });
  }

  handleLoginSuccess(user: LogRes) {
    sessionStorage.setItem("id",user.id);
    sessionStorage.setItem("username",user.name);
    sessionStorage.setItem("email",user.email);
    sessionStorage.setItem("token",user.token);
    sessionStorage.setItem("role",user.role);
    if(user.role == "USER"){
      this.router.navigateByUrl("homepage");
    }else if(user.role == "ADMIN"){ 
      this.router.navigateByUrl("admin-dashboard");
    }
    
  }
}

