import { Component, OnInit } from '@angular/core';
import { ProdInt } from '../interfaces/prod-int';
import { FormsModule } from '@angular/forms';
import { Products } from '../services/products';
import { CommonModule } from '@angular/common';
import { Authservice } from '../services/authservice';
import { UserReq } from '../interfaces/UserReq';
import { OrderInt } from '../interfaces/orders-int';
import { OrderResponse } from '../interfaces/OrderResponse';

@Component({
  selector: 'app-profilepage',
  imports: [FormsModule, CommonModule],
  templateUrl: './profilepage.html',
  styleUrls: ['./profilepage.css'],
})
export class Profilepage implements OnInit {
  isUserLogged: boolean = false;
  uname: string = "";
  uid: string = "";
  email: string = "";
  password: string = "new password..";
  activeTab: string = 'details';
  orders: OrderResponse[] = [];
  orderedProds: ProdInt[] = [];

  constructor(private prodserv: Products, private auth: Authservice) { }

  ngOnInit(): void {
    // Fetch session data inside ngOnInit to ensure session is loaded
    this.uname = sessionStorage.getItem("username") || "";
    this.uid = sessionStorage.getItem("id") || "";
    this.email = sessionStorage.getItem("email") || "";

    if (this.uname === "") {
      this.isUserLogged = false;
    } else {
      this.isUserLogged = true;
      this.getOrders();
    }
  }

    addcart(id:string, quantity:number=1) {
    this.prodserv.addToCart(id,quantity).subscribe({
      next:()=>console.log("item added to cart"),
      error:(err) => {  console.log(err);
                        alert("Please login to add items to cart")
                      },
      complete:()=>  alert("item added to cart")
    })
  }
  getOrders() {
    this.prodserv.getOrders().subscribe({
      next: (res) => {
        if (!res || res.length === 0) {
          console.log('No orders found for this user.');
          this.orders = [];
          this.orderedProds = [];
          return;
        }

        console.log('Orders received', res);
        this.orders = res;
        //
        //
        //this boiler plate codes because of i used "items" naming in productresponse but my backend sends "products", So use same name as used in backed sent dataset.
        //
        //
        this.orderedProds = this.orders.flatMap(order => {
          const anyOrder: any = order;
          let items = anyOrder.items ?? anyOrder.products ?? anyOrder.orderItems ?? anyOrder.itemsList ?? [];
          if (!items) return [];
          if (typeof items === 'string') {
            try {
              const parsed = JSON.parse(items);
              return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              return [];
            }
          }
          return Array.isArray(items) ? items : [];
        });

        this.orderedProds.forEach(prod => {
          console.log('Ordered product:', prod?.name, prod?.price, prod?.brand);
        });
      },
      error: (err) => {
        console.error('Failed to fetch orders:', err);
      },
      complete: () => {
        console.log('getOrders completed');
      }
    });
  }

  changeData() {
    const data: UserReq = {
      name: this.uname,
      email: this.email,
      password: this.password
    };

    this.auth.updateUser(this.uid, data).subscribe({
      next: (res) => {
        alert("User details updated successfully");
        sessionStorage.setItem("username", res.name);
        sessionStorage.setItem("email", res.email);
      },
      error: (err) => {
        console.error("Update failed:", err);
        alert("Failed to update user details. Please try again.");
      }
    });
  }
}