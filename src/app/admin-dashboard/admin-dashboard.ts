import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Products } from '../services/products';
import { Authservice } from '../services/authservice';
import { ProdInt } from '../interfaces/prod-int';
import { UserInt } from '../interfaces/user-int';
import { UserRes } from '../interfaces/UserRes';
import { ProductRequest } from '../interfaces/ProductRequest';
import { UserReq } from '../interfaces/UserReq';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: string = 'products';
  
  // Products tab
  allProducts: ProdInt[] = [];
  
  // Users tab
  allUsers: UserInt[] = [];
  
  // Add record
  newUser: UserReq = { name: '', email: '', password: '' };
  newProduct: ProductRequest = {
    user: { id: '',name: '', email: '' },
    name: '',
    Description: '',
    price: 0,
    image: 'https://images.pexels.com/photos/6568665/pexels-photo-6568665.jpeg',
    discount: 0,
    availability: true,
    brand: '',
    rating: 0
  };
  
  // Update record
  updateUserId: string = '';
  updateProductId: string = '';
  updateUserData: UserRes | null = null;
  updateProductData: ProdInt | null = null;
  updateUserForm: UserReq = { name: '', email: '', password: '' };
  updateProductForm: ProductRequest = {
    user: { id: '',name: '', email: '' },
    name: '',
    Description: '',
    price: 0,
    image: '',
    discount: 0,
    availability: true,
    brand: '',
    rating: 0
  };
  
  constructor(
    private productsService: Products,
    private authService: Authservice
  ) {}
  
  ngOnInit() {
    this.loadAllProducts();
    this.loadAllUsers();
  }
  
  loadAllProducts() {
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }
  
  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(productId).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadAllProducts();
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Error deleting product');
        }
      });
    }
  }
  
  // USERS TAB 
  loadAllUsers() {
    this.authService.getAllUsers().subscribe({ 
        next: (users: any[]) => {
            // Map the API response - the API returns 'name' but UserInt expects 'username'
            this.allUsers = users.map((user: any) => ({
                id: user.id,
                username: user.name || user.username,  // Handle both 'name' and 'username' from API
                email: user.email
            }));
        },
        error: (err) => {
        console.error('Error loading users:', err);
        }

    })
    }
  
  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          alert('User deleted successfully!');
          this.loadAllUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Error deleting user');
        }
      });
    }
  }
  
  //ADD NEW RECORD
  addNewUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      alert('Please fill all user fields');
      return;
    }
    
    this.authService.register(this.newUser).subscribe({
      next: (response) => {
        alert('User added successfully!');
        this.newUser = { name: '', email: '', password: '' };
        this.loadAllUsers();
      },
      error: (err) => {
        console.error('Error adding user:', err);
        alert('Error adding user');
      }
    });
  }
  
  addNewProduct() {
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.Description) {
      alert('Please fill all required product fields');
      return;
    }
    
    // Get the logged-in user's ID from sessionStorage
    const userId = sessionStorage.getItem('id');
    if (!userId) {
      alert('Please log in first');
      return;
    }
    
    // Set the user ID for the product
    this.newProduct.user = { id: userId, name: '', email: '' };
    
    this.productsService.addProduct(this.newProduct).subscribe({
      next: (response) => {
        alert('Product added successfully!');
        this.newProduct = {
            user: { id: '',name: '', email: '' },
            name: '',
            Description: '',
            price: 0,
            image: '',
            discount: 0,
            availability: true,
            brand: '',
            rating: 0
        };
        this.loadAllProducts();
      },
      error: (err) => {
        console.error('Error adding product:', err);
        alert('Error adding product');
      }
    });
  }
  
  // UPDATE RECORD 
  searchUser() {
    if (!this.updateUserId) {
      alert('Please enter a user ID');
      return;
    }
    
    this.authService.getUserById(this.updateUserId).subscribe({
      next: (user) => {
        this.updateUserData = user;
        this.updateUserForm = {
          name: user.name,
          email: user.email,
          password: ''
        };
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        alert('User not found');
      }
    });
  }
  
  searchProduct() {
    if (!this.updateProductId) {
      alert('Please enter a product ID');
      return;
    }
    
    // Convert product ID to string for comparison (in case it's stored as number)
    const product = this.allProducts.find(p => String(p.id) === String(this.updateProductId));
    if (product) {
      this.updateProductData = product;
      this.updateProductForm.name = product.name;
      this.updateProductForm.Description = product.description;
      this.updateProductForm.price = product.price;
      this.updateProductForm.image = product.image;
      this.updateProductForm.discount = product.discount;
      this.updateProductForm.availability = product.availability;
      this.updateProductForm.brand = product.brand;
      this.updateProductForm.rating = product.rating;
    } else {
      alert('Product not found');
      this.updateProductData = null;
    }
  }
  
  updateUser() {
    if (!this.updateUserData) {
      alert('Please search for a user first');
      return;
    }
    
    this.authService.updateUser(this.updateUserData.id, this.updateUserForm).subscribe({
      next: (response) => {
        alert('User updated successfully!');
        this.updateUserId = '';
        this.updateUserData = null;
        this.loadAllUsers();
      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Error updating user');
      }
    });
  }
  
  updateProduct() {
    if (!this.updateProductData) {
      alert('Please search for a product first');
      return;
    }
    
    // Check if any changes were made
    let hasChanges = false;
    
    if (this.updateProductForm.name !== this.updateProductData.name) hasChanges = true;
    if (this.updateProductForm.Description !== this.updateProductData.description) hasChanges = true;
    if (this.updateProductForm.price !== this.updateProductData.price) hasChanges = true;
    if (this.updateProductForm.image !== this.updateProductData.image) hasChanges = true;
    if (this.updateProductForm.discount !== this.updateProductData.discount) hasChanges = true;
    if (this.updateProductForm.availability !== this.updateProductData.availability) hasChanges = true;
    if (this.updateProductForm.brand !== this.updateProductData.brand) hasChanges = true;
    if (this.updateProductForm.rating !== this.updateProductData.rating) hasChanges = true;
    
    if (!hasChanges) {
      alert('No changes made');
      return;
    }
    
    const updatePayload: ProductRequest = {
      user: { 
        id: sessionStorage.getItem('id') || '', 
        name: sessionStorage.getItem('username') || '', 
        email: sessionStorage.getItem('email') || '' 
      },
      name: this.updateProductForm.name,
      Description: this.updateProductForm.Description,
      price: this.updateProductForm.price,
      image: this.updateProductForm.image,
      discount: this.updateProductForm.discount,
      availability: this.updateProductForm.availability,
      brand: this.updateProductForm.brand,
      rating: this.updateProductForm.rating
    };
    
    this.productsService.updateProduct(this.updateProductData.id, updatePayload).subscribe({
      next: (response) => {
        alert('Product updated successfully!');
        this.updateProductId = '';
        this.updateProductData = null;
        this.clearUpdateProductForm();
        this.loadAllProducts();
      },
      error: (err) => {
        console.error('Error updating product:', err);
        alert('Error updating product');
      }
    });
  }
  
  clearUpdateUserForm() {
    this.updateUserId = '';
    this.updateUserData = null;
    this.updateUserForm = { name: '', email: '', password: '' };
  }
  
  clearUpdateProductForm() {
    this.updateProductId = '';
    this.updateProductData = null;
    this.updateProductForm = {
      user: { id: '',name: '', email: '' },
      name: '',
      Description: '',
      price: 0,
      image: '',
      discount: 0,
      availability: true,
      brand: '',
      rating: 0
    };
  }
}
