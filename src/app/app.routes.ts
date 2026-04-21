import { RouterModule, Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Profilepage } from './profilepage/profilepage';
import { Cartpage } from './cartpage/cartpage';
import { Loginpage } from './loginpage/loginpage';

export const routes: Routes = [ 
    {path:'' ,component:Homepage},
    {path:'profilepage',component:Profilepage},
    {path:'cartpage',component:Cartpage},
    {path:'loginpage',component:Loginpage},
    { path: '**', redirectTo: '' }
];
