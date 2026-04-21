import { Component, OnInit } from '@angular/core';
import { ProdInt } from '../interfaces/prod-int';
import { deletedResponse, Products } from '../services/products';
import { CommonModule } from '@angular/common';
import { CartInt } from '../interfaces/cart-int';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cartpage',
  imports: [CommonModule],
  templateUrl: './cartpage.html',
  styleUrl: './cartpage.css',
})
export class Cartpage implements OnInit{
  orders: ProdInt[] = [];
  cartitems: ProdInt[] = [];
  totalcart: CartInt[] = [];
  id:any=sessionStorage.getItem("id")||"";
  constructor(
    private prodserv : Products,
    private router: Router){}

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems(){
    return this.prodserv.getCartItems().subscribe({
      next:(res) => {
        this.totalcart = res;
         this.cartitems = res.map(item => item.product);
         this.orders = [...this.cartitems]
      },
      error:(err)=> console.log(err),
      complete:()=> console.log("fetched cart items")
    })
  }

  removeItem(id:string){ 
    this.prodserv.removeFromCart(id).subscribe({
      next:(res: deletedResponse)=> console.log(res.message),
      error:(err) => console.log(err),
      complete: () => { 
      this.getCartItems();
    }}); 
  }
  getTotalPrice(): number { 
    return this.orders.reduce((sum, item) => sum + item.price, 0); 

  } 
  getTotalDiscount(): number { 
    return this.orders.reduce((sum, item) => sum + item.discount, 0); 
  } 
  getFinalAmount(): number { 
    return this.orders.reduce((sum, item) => { 
      const discountedPrice = item.price - (item.price * item.discount / 100); 
      return sum + discountedPrice; }, 0); 
    }
  
  placeOrder() {
      this.addToOrders(); 
    this.cartitems = []; // clear cart after placing order 
    this.orders= [] 
    this.totalcart = [];
  } 
  
  
  addToOrders() { 
    this.prodserv.addToOrders().subscribe({ 
      next: () => console.log("order placed"),
      error: (err) => console.log(err),
      complete: () => { this.router.navigate(['/profile']); }
    }); 
  }
}
