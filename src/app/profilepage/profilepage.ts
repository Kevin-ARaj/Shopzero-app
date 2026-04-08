import { Component, inject, OnInit } from '@angular/core';
import { ProdInt } from '../interfaces/prod-int';
import { FormsModule } from '@angular/forms';
import { Products } from '../services/products';
import { CommonModule } from '@angular/common';
import { Authservice } from '../services/authservice';
import { UserInt } from '../interfaces/user-int';

@Component({
  selector: 'app-profilepage',
  imports: [FormsModule,CommonModule],
  templateUrl: './profilepage.html',
  styleUrl: './profilepage.css',
})
export class Profilepage implements OnInit{
  isUserLogged:boolean= false;
  uname: string = sessionStorage.getItem("username") || "";
  uid: string = sessionStorage.getItem("id") || ""; 
  password:string="new password..";
  // email:string="";
  orders:ProdInt[]=[];
  constructor(private prodserv:Products,private auth :Authservice){}

  ngOnInit(): void {
    
    if(this.uname===""){
      this.isUserLogged=false;    
    }else{
      this.isUserLogged=true;
      this.getorders();
    }
  }

  getorders(){
    this.prodserv.getOrders(this.uid).subscribe({
      next : (res) =>{ 
        this.orders = Array.isArray(res) ? res : [res];
        console.log("printing orders"+this.orders)
      },
      error : (err) => console.log(err),
      complete : () => console.log("orders loaded") 
    })
  }

  changedata(){

  this.auth.getUserById(this.uid).subscribe({
      next: (res) =>{
      const user : UserInt = {
      id:res.id,
      username:this.uname,
      email:res.email, 
      password:this.password
      };

      this.auth.updateUser(user).subscribe({  
        next: () => {
            alert("User details updated successfully");
            sessionStorage.setItem("username", user.username);
            sessionStorage.setItem("id",user.id);
            },
        error: (err) => {
            console.error("Update failed:", err);
            alert("Failed to update user details. Please try again.");
            }
      });
    },
  error:(err) => console.log("Error to get userdetail "+err)
      });
  }

} 
