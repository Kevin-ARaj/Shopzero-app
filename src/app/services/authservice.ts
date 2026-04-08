import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserInt } from '../interfaces/user-int';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private apiUrl = "http://localhost:3000";
  
  constructor(private http:HttpClient){}

  // Login
  login(username: string, password: string):Observable<UserInt[]>{
  return this.http.get<UserInt[]>(`${this.apiUrl}/users?username=${username}&password=${password}`)
  }


  // Register new user
  register(newuser: UserInt): Observable<UserInt>{
    return this.http.post<UserInt>(`${this.apiUrl}/users`, newuser);
  }

  // Update user
  updateUser(user: UserInt): Observable<any>{
    return this.http.patch(`${this.apiUrl}/users/${user.id}`, user);
  }

  // Get user by ID
  getUserById(id: string): Observable<UserInt> {
    return this.http.get<UserInt>(`${this.apiUrl}/users/${id}`);
  }
}
