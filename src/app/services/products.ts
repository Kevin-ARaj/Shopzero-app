import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProdInt } from '../interfaces/prod-int';

@Injectable({
  providedIn: 'root',
})
export class Products {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Get all products
  getAllProducts(): Observable<ProdInt[]> {
    return this.http.get<ProdInt[]>(`${this.apiUrl}/products`)  
  }

  // Get user's orders
  getOrders(id:any): Observable<ProdInt[]> {
    return this.http.get<{ items: ProdInt[] }>(`${this.apiUrl}/orders/${id}`).pipe(
      map(response => response.items)
    );
  }

  // Add item to cart (json-server supports PUT/PATCH/POST) 
  addToCart(id:any,product: ProdInt): Observable<any> {
    return this.http.get<{items:ProdInt[]}>(`${this.apiUrl}/cart/${id}`)
    .pipe(map(response => response.items),switchMap(items => {
      const updatedItems = [...items , product];
      return this.http.patch(`${this.apiUrl}/cart/${id}`,{items:updatedItems});
    }))
  }

  // Get cart items 
  getCartItems(id:any): Observable<ProdInt[]> {
    return this.http.get<{ items: ProdInt[] }>(`${this.apiUrl}/cart/${id}`).pipe(
      map(response => response.items)
    );
  }

  // Remove item from cart
  removeFromCart(id:any, productname: string): Observable<any> {
    return this.http.get<{ items: ProdInt[] }>(`${this.apiUrl}/cart/${id}`).pipe(
      map(response => response.items || []),
      switchMap(items => {
        const updatedItems = items.filter(item => item.name !== productname);
        return this.http.patch(`${this.apiUrl}/cart/${id}`, { items: updatedItems });
      })
    );
  }

  // Add to orders (place order)
  addToOrders(id:any, product: ProdInt): Observable<any> {
    return this.http.get<{items:ProdInt[]}>(`${this.apiUrl}/orders/${id}`).pipe(
      map(response => { const items = response.items; return Array.isArray(items) ? items : items ? [items] : []; }),
      switchMap(items =>{
        const updatedItems = [...items , product];
        return this.http.patch(`${this.apiUrl}/orders/${id}`,{items:updatedItems})
      })
    )
  }

  // Clear cart after order placement
  clearCart(id:any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/cart/${id}`, { items: [] }).pipe(
    );
  }

 }
