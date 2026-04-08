import { Component, OnInit } from '@angular/core';
import { ProdInt } from '../interfaces/prod-int';
import { Products } from '../services/products';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cartpage',
  imports: [CommonModule],
  templateUrl: './cartpage.html',
  styleUrl: './cartpage.css',
})
export class Cartpage implements OnInit{
  orders: ProdInt[] = [];
  cartitems: ProdInt[] = [];
  id:any=sessionStorage.getItem("id")||"";
  constructor(private prodserv : Products){}

  ngOnInit(): void {
    this.getCartItems(this.id);
  }

  getCartItems(id:any){
    return this.prodserv.getCartItems(id).subscribe({
      next:(res) => {
        this.cartitems = res,
        this.orders = [...res]
      },
      error:(err)=> console.log(err),
      complete:()=> console.log("fetched cart items")
    })
  }

  removeItem(id:any,productName: string) { 
    this.prodserv.removeFromCart(id, productName).subscribe(() => { 
      this.getCartItems(this.id);
    }); 
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
    this.cartitems.forEach(item => { 
      this.addToOrders(this.id, item); 
    }); 
    this.cartitems = []; // clear cart after placing order 
    this.orders= [] 
  } // Remove item from cart 
  
  
  addToOrders(id:any, product: ProdInt) { 
    this.prodserv.addToOrders(id, product).subscribe(order => { 
      this.orders.push(order); 
      location.reload();
      this.prodserv.clearCart(this.id).subscribe({
        next:()=>console.log("cart cleared"),
        error:(err) => console.log(err)
      })
    }); 
  }
}
