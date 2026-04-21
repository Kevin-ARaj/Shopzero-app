import { Component, inject, OnInit } from '@angular/core';
import { ProdInt } from '../interfaces/prod-int';
import { FormsModule } from '@angular/forms';
import { Products } from '../services/products';
import { CommonModule } from '@angular/common';
import { Authservice } from '../services/authservice';
import {UserRes} from '../interfaces/UserRes'
import { UserReq } from '../interfaces/UserReq';
import {ProductRequest} from '../interfaces/ProductRequest';


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
  email: string = sessionStorage.getItem("email") || "";
  password:string="new password..";
  activeTab:string = 'details';
  orders:ProdInt[]=[];
  myAddedProducts: ProdInt[] = [];

  pname:string="";
  pprice:string="";
  pdescription:string="";
  pbrand:string="";
  prating:string="";
  pimage:string="https://images.pexels.com/photos/6568665/pexels-photo-6568665.jpeg"; 
  pdiscount:number=0;
  
  constructor(private prodserv:Products,private auth :Authservice){}

  ngOnInit(): void {
    
    if(this.uname===""){
      this.isUserLogged=false;    
    }else{
      this.isUserLogged=true;
      this.getorders();
      this.getMyAddedProducts();
    }
  }
  getMyAddedProducts(){
    this.prodserv.getMyProducts().subscribe({
      next : (res) =>{
        this.myAddedProducts = [...res];
      },
      error : (err) => {
        console.error("Failed to fetch my added products:", err);
      },
      complete : () => {
        console.log("getMyAddedProducts completed");
      }
    });
  }
  getorders(){
    console.log("[DEBUG] getorders() called");
    this.prodserv.getOrders().subscribe({
      next : (res) =>{ 
        console.log("[DEBUG] API response received:", res);
        console.log("[DEBUG] Response length:", res.length);
        this.orders = res.flatMap(order => {
          const items = order.items || order.items || [];
          console.log("[DEBUG] Processing order:", order);
          console.log("[DEBUG] Order items:", items);
          return Array.isArray(items) ? items : [];
        });
        console.log("[DEBUG] Final orders array:", this.orders);
        console.log("[DEBUG] Orders count:", this.orders.length);
      },
      error : (err) => {
        console.log("[DEBUG] Error occurred:", err);
      },
      complete : () => {
        console.log("[DEBUG] orders subscription completed");
      }
    })
  }

  changedata(){
    const data : UserReq= {
      name:this.uname,  
      email:this.email,
      password:this.password
    }

  this.auth.updateUser(this.uid,data).subscribe({
     next: (res) => {
            alert("User details updated successfully");
            localStorage.setItem("username", res.name);
            localStorage.setItem("email", res.email);
            },
        error: (err) => {
            console.error("Update failed:", err);
            alert("Failed to update user details. Please try again.");
            }
      });

  }

  addproduct(){
    const user : UserRes={
      id:this.uid,
      name:this.uname,
      email:this.email
    }
    const data : ProductRequest = {
      user:user,
      name:this.pname,
      price:parseFloat(this.pprice),
      Description:this.pdescription,
      brand:this.pbrand,
      rating:parseFloat(this.prating),
      image:this.pimage,
      discount:this.pdiscount,
      availability:true
    }

    this.prodserv.addProduct(data).subscribe({
      next: (res:any) => {
        alert("Product added successfully");
        const newProduct = res as ProdInt;
        if (newProduct?.id) {
          this.myAddedProducts.unshift(newProduct);
        }
        // Clear the input fields
        this.pname = "";
        this.pprice = "";
        this.pdescription = "";
        this.pbrand = "";
        this.prating = "";
        this.pimage = "";
      },
      error: (err) => {
        console.error("Failed to add product:", err);
        alert("Failed to add product. Please try again.");
      },
      complete:() =>{ console.log('[DEBUG] addProduct completed'); }
    });

  }
}