import { RouterModule, Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Profilepage } from './profilepage/profilepage';
import { Cartpage } from './cartpage/cartpage';
import { Loginpage } from './loginpage/loginpage';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';

export const routes: Routes = [ 
    {path:'' ,component:Homepage},
    {path:'profilepage',component:Profilepage},
    {path:'cartpage',component:Cartpage},
    {path:'loginpage',component:Loginpage},
    {path:'admin-dashboard',component:AdminDashboardComponent},
    { path: '**', redirectTo: '' }
];
