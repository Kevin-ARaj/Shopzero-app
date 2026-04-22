import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserInt } from '../interfaces/user-int';
import { UserRes } from '../interfaces/UserRes';
import { LogReq } from '../interfaces/LogReq';
import { LogRes } from '../interfaces/LogRes';
import { UserReq } from '../interfaces/UserReq';
import { deletedResponse } from './products';
@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private apiUrl = "http://localhost:8080/api";
  constructor(private http:HttpClient){}

  // Login
  login(userdet:LogReq):Observable<LogRes>{
  return this.http.post<LogRes>(`${this.apiUrl}/user/login`,userdet);
  }


  // Register new user - loginpage
  register(newuser: UserReq): Observable<LogRes>{
    return this.http.post<LogRes>(`${this.apiUrl}/user/register`, newuser);
  }

  // Update user
  updateUser(id: string, user: UserReq): Observable<UserRes>{
        const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
    return this.http.put<UserRes>(`${this.apiUrl}/user/${id}`, user, { headers });
  }

  // Get user by ID
  getUserById(id: string): Observable<UserRes> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
    return this.http.get<UserRes>(`${this.apiUrl}/user/${id}`,{headers});
  }

  //get all users - admin dashboard
  getAllUsers(): Observable<UserInt[]> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
    return this.http.get<UserInt[]>(`${this.apiUrl}/user`,{headers});
  }

  // Delete user - admin dashboard
  deleteUser(id: string): Observable<deletedResponse> {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({'Authorization' : `Bearer ${token}`,'Content-Type': 'application/json'});
    return this.http.delete<deletedResponse>(`${this.apiUrl}/user/${id}`, { headers });
  }
}
