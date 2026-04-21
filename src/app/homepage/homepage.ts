import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Products } from '../services/products';
import { CommonModule } from '@angular/common';
import { ProdInt } from '../interfaces/prod-int';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Authservice } from '../services/authservice';

@Component({
  selector: 'app-homepage',
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit{

  allProds:ProdInt[]=[];
  filteredProds: ProdInt[] = []; 
  searchInput:string="";  
  quantity:number=1;
  isUserLogged:boolean= false;
  username:string= sessionStorage.getItem("username") || "";
  id:string = sessionStorage.getItem("id")||"";
  
  private http = inject(HttpClient);
  constructor(private prodservice:Products,private auth:Authservice){}
  

  ngOnInit(): void {
    this.getAllproducts();

    if (!this.username) {
      this.isUserLogged = false;
    } else {
      this.isUserLogged = true;
    }
  }

  getAllproducts(){
    this.prodservice.getAllProducts().subscribe({
      next : (data) => {
        this.allProds = data
        this.filteredProds = this.allProds;
        },
      error: (err) => {console.log("failed to load",err)},
      complete: () => {console.log(JSON.stringify(this.allProds))}
    })
  }

  filterProducts() {
    const term = this.searchInput.trim().toLowerCase();
    if (!term) {
      this.filteredProds = this.allProds;
      return;
    }
    this.filteredProds = this.allProds.filter(prod =>
      prod.name.toLowerCase().includes(term)
    );
  }
  
  addcart(id:string){
    this.prodservice.addToCart(id,this.quantity).subscribe({
      next:()=>console.log("item added to cart"),
      error:(err) => {  console.log(err);
                        alert("Please login to add items to cart")
                      },
      complete:()=>  alert("item added to cart")
    })
  }

  logout(){
    sessionStorage.clear();
    this.username="";
    this.id="";
    location.reload();
  }

}

