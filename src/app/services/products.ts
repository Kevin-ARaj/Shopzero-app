import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { ProdInt } from '../interfaces/prod-int';
import { CartInt } from '../interfaces/cart-int';
import {OrderInt} from '../interfaces/orders-int';
import {ProductRequest} from '../interfaces/ProductRequest';

export interface deletedResponse{
  message:string
}

@Injectable({
  providedIn: 'root',
})
export class Products {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  //add a product
  addProduct(product:ProductRequest){
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
    return this.http.post(`${this.apiUrl}/products/add`,product,{headers})
  }

  // Get all products
  getAllProducts(): Observable<ProdInt[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
    return this.http.get<ProdInt[]>(`${this.apiUrl}/products`,{headers});  
  }

  //get products i added
    getMyProducts(): Observable<ProdInt[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
    return this.http.get<ProdInt[]>(`${this.apiUrl}/products/my`,{headers});
    }

  // Get user's orders
  getOrders(): Observable<OrderInt[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
    return this.http.get<OrderInt[]>(`${this.apiUrl}/orders`,{headers});
  }

  // Add item to cart 
  addToCart(id:string,quantity:number): Observable<any> { 
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
    return this.http.post(`${this.apiUrl}/cart/${id}?quantity=${quantity}`, {}, { headers });
  }

  // Get cart items 
  getCartItems(): Observable<CartInt[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
    return this.http.get<CartInt[]>(`${this.apiUrl}/cart`, {headers})
  }

  // Remove item from cart
  removeFromCart(id:string):Observable<deletedResponse>{
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
    return this.http.delete<deletedResponse>(`${this.apiUrl}/cart/${id}`,{headers})
  }

  // Add to orders (place order)
  addToOrders(): Observable<OrderInt> {
      const token = sessionStorage.getItem('token');
      const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
      return this.http.post<OrderInt>(`${this.apiUrl}/orders`, null , { headers });
  }

  // Clear cart after order placement
  clearCart(id:any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/cart/${id}`, { items: [] }).pipe(
    );
  }

 }
